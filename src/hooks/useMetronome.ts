import { useState, useEffect, useRef, useCallback } from 'react';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import type { AudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { AppState } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { EncodingType } from 'expo-file-system/legacy';
import { DEFAULT_BPM, MAX_BPM, MIN_BPM } from '../constants';
import { CUSTOM_SOUND_PRESET_ID } from '../constants/sounds';
import { buildLoopWavBase64, getPresetAudioData, readWavFileAsMonoAudio } from '../utils/wav';

const BEATS_PER_BAR = 4;
const UI_REFRESH_MS = 40;
const GENERATED_LOOP_DIR = `${FileSystem.cacheDirectory}metronome-loops/`;

export interface MetronomeState {
  bpm: number;
  isPlaying: boolean;
  currentBeat: number;
}

export function useMetronome(
  initialBpm: number = DEFAULT_BPM,
  hapticEnabled: boolean = true,
  soundEnabled: boolean = true,
  volume: number = 0.8,
  soundPresetId: string,
  customSoundUri?: string | null,
) {
  const [bpm, setBpmState] = useState(initialBpm);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);

  const playerRef = useRef<AudioPlayer | null>(null);
  const soundEnabledRef = useRef(soundEnabled);
  const hapticEnabledRef = useRef(hapticEnabled);
  const volumeRef = useRef(volume);
  const bpmRef = useRef(initialBpm);
  const soundPresetIdRef = useRef(soundPresetId);
  const customSoundUriRef = useRef(customSoundUri ?? null);
  const isPlayingRef = useRef(false);
  const playbackStartedAtRef = useRef<number | null>(null);
  const uiIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hapticTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const generationTokenRef = useRef(0);
  const isMountedRef = useRef(true);
  const appStateRef = useRef(AppState.currentState);
  const rebuildDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { bpmRef.current = bpm; }, [bpm]);
  useEffect(() => { soundEnabledRef.current = soundEnabled; }, [soundEnabled]);
  useEffect(() => { hapticEnabledRef.current = hapticEnabled; }, [hapticEnabled]);

  useEffect(() => {
    volumeRef.current = volume;
    if (playerRef.current) {
      playerRef.current.volume = soundEnabled ? volume : 0;
    }
  }, [soundEnabled, volume]);

  useEffect(() => { soundPresetIdRef.current = soundPresetId; }, [soundPresetId]);
  useEffect(() => { customSoundUriRef.current = customSoundUri ?? null; }, [customSoundUri]);

  const clearUiInterval = useCallback(() => {
    if (uiIntervalRef.current) {
      clearInterval(uiIntervalRef.current);
      uiIntervalRef.current = null;
    }
  }, []);

  const clearHapticTimer = useCallback(() => {
    if (hapticTimeoutRef.current) {
      clearTimeout(hapticTimeoutRef.current);
      hapticTimeoutRef.current = null;
    }
  }, []);

  const removeCurrentPlayer = useCallback(() => {
    const existing = playerRef.current;
    playerRef.current = null;
    if (existing) {
      try { existing.remove(); } catch { /* ignore */ }
    }
  }, []);

  const computeBeatIndex = useCallback((timestamp: number) => {
    const startedAt = playbackStartedAtRef.current;
    if (!startedAt) return 0;
    const beatDurationMs = 60000 / bpmRef.current;
    const elapsed = Math.max(0, timestamp - startedAt);
    return Math.floor(elapsed / beatDurationMs) % BEATS_PER_BAR;
  }, []);

  const updateCurrentBeat = useCallback(() => {
    if (!isPlayingRef.current) return;
    const nextBeat = computeBeatIndex(Date.now());
    setCurrentBeat((prev) => (prev === nextBeat ? prev : nextBeat));
  }, [computeBeatIndex]);

  const startUiClock = useCallback(() => {
    clearUiInterval();
    updateCurrentBeat();
    uiIntervalRef.current = setInterval(updateCurrentBeat, UI_REFRESH_MS);
  }, [clearUiInterval, updateCurrentBeat]);

  const triggerHapticForBeat = useCallback((beatIndex: number) => {
    if (!hapticEnabledRef.current || appStateRef.current !== 'active') return;
    Haptics.impactAsync(
      beatIndex === 0 ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light,
    ).catch(() => null);
  }, []);

  const scheduleNextHaptic = useCallback(() => {
    clearHapticTimer();
    if (!isPlayingRef.current || !hapticEnabledRef.current || appStateRef.current !== 'active') return;
    const startedAt = playbackStartedAtRef.current;
    if (!startedAt) return;
    const beatDurationMs = 60000 / bpmRef.current;
    const elapsed = Math.max(0, Date.now() - startedAt);
    const nextBeatNumber = Math.floor(elapsed / beatDurationMs) + 1;
    const nextBeatAt = startedAt + nextBeatNumber * beatDurationMs;
    const delay = Math.max(0, Math.round(nextBeatAt - Date.now()));
    hapticTimeoutRef.current = setTimeout(() => {
      const beatIndex = computeBeatIndex(Date.now());
      setCurrentBeat(beatIndex);
      triggerHapticForBeat(beatIndex);
      scheduleNextHaptic();
    }, delay);
  }, [clearHapticTimer, computeBeatIndex, triggerHapticForBeat]);

  const ensureAudioMode = useCallback(async () => {
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'doNotMix',
    });
  }, []);

  const getAudioData = useCallback(async () => {
    if (soundPresetIdRef.current === CUSTOM_SOUND_PRESET_ID) {
      const uri = customSoundUriRef.current;
      if (!uri) throw new Error('未找到自定义 WAV 文件');
      return readWavFileAsMonoAudio(uri);
    }
    return getPresetAudioData(soundPresetIdRef.current);
  }, []);

  const buildLoopFileAsync = useCallback(async () => {
    const audioData = await getAudioData();
    const loop = buildLoopWavBase64({ bpm: bpmRef.current, audioData, beatsPerBar: BEATS_PER_BAR });
    const dirInfo = await FileSystem.getInfoAsync(GENERATED_LOOP_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(GENERATED_LOOP_DIR, { intermediates: true });
    }
    const targetUri = `${GENERATED_LOOP_DIR}loop-${bpmRef.current}-${soundPresetIdRef.current}.wav`;
    await FileSystem.writeAsStringAsync(targetUri, loop.base64, { encoding: EncodingType.Base64 });
    return targetUri;
  }, [getAudioData]);

  const prepareLoopPlayer = useCallback(async (): Promise<AudioPlayer | null> => {
    const generationToken = ++generationTokenRef.current;
    const loopUri = await buildLoopFileAsync();

    if (generationToken !== generationTokenRef.current) return null;

    const player = createAudioPlayer({ uri: loopUri });
    player.loop = true;
    player.volume = soundEnabledRef.current ? volumeRef.current : 0;

    if (generationToken !== generationTokenRef.current) {
      try { player.remove(); } catch { /* ignore */ }
      return null;
    }

    return player;
  }, [buildLoopFileAsync]);

  const stop = useCallback(async () => {
    generationTokenRef.current += 1;
    isPlayingRef.current = false;
    playbackStartedAtRef.current = null;
    clearUiInterval();
    clearHapticTimer();
    setIsPlaying(false);
    setCurrentBeat(0);

    const activePlayer = playerRef.current;
    playerRef.current = null;
    if (activePlayer) {
      try { activePlayer.pause(); } catch { /* ignore */ }
      try { activePlayer.remove(); } catch { /* ignore */ }
    }
  }, [clearHapticTimer, clearUiInterval]);

  const startPlayback = useCallback(async () => {
    await ensureAudioMode();
    const nextPlayer = await prepareLoopPlayer();
    if (!nextPlayer) return;

    removeCurrentPlayer();
    playerRef.current = nextPlayer;
    playbackStartedAtRef.current = Date.now();
    isPlayingRef.current = true;
    setIsPlaying(true);
    setCurrentBeat(0);

    nextPlayer.play();
    triggerHapticForBeat(0);

    if (appStateRef.current === 'active') {
      startUiClock();
      scheduleNextHaptic();
    }
  }, [ensureAudioMode, prepareLoopPlayer, removeCurrentPlayer, scheduleNextHaptic, startUiClock, triggerHapticForBeat]);

  const play = useCallback(async () => {
    if (isPlayingRef.current) return;
    await startPlayback();
  }, [startPlayback]);

  const pause = useCallback(async () => {
    if (!isPlayingRef.current) return;
    generationTokenRef.current += 1;
    isPlayingRef.current = false;
    clearUiInterval();
    clearHapticTimer();
    setIsPlaying(false);

    const activePlayer = playerRef.current;
    if (activePlayer) {
      try { activePlayer.pause(); } catch { /* ignore */ }
    }

    playbackStartedAtRef.current = null;
    setCurrentBeat(0);
  }, [clearHapticTimer, clearUiInterval]);

  const toggle = useCallback(async () => {
    if (isPlayingRef.current) {
      await pause();
    } else {
      await play();
    }
  }, [pause, play]);

  const setBpm = useCallback((nextBpm: number) => {
    const clamped = Math.max(MIN_BPM, Math.min(MAX_BPM, Math.round(nextBpm)));
    bpmRef.current = clamped;
    setBpmState(clamped);
  }, []);

  // Lifecycle
  useEffect(() => {
    isMountedRef.current = true;
    ensureAudioMode().catch(() => null);

    const subscription = AppState.addEventListener('change', (nextState) => {
      const previousState = appStateRef.current;
      appStateRef.current = nextState;

      if (nextState === 'active' && previousState !== 'active' && isPlayingRef.current) {
        updateCurrentBeat();
        startUiClock();
        scheduleNextHaptic();
      }

      if (nextState !== 'active') {
        clearUiInterval();
        clearHapticTimer();
      }
    });

    return () => {
      isMountedRef.current = false;
      generationTokenRef.current += 1;
      subscription.remove();
      clearUiInterval();
      clearHapticTimer();
      removeCurrentPlayer();
      if (rebuildDebounceRef.current) {
        clearTimeout(rebuildDebounceRef.current);
        rebuildDebounceRef.current = null;
      }
    };
  }, [clearHapticTimer, clearUiInterval, ensureAudioMode, removeCurrentPlayer, scheduleNextHaptic, startUiClock, updateCurrentBeat]);

  useEffect(() => {
    setBpmState(initialBpm);
    bpmRef.current = initialBpm;
  }, [initialBpm]);

  // Effect 1: immediate rebuild when sound source changes
  useEffect(() => {
    if (!isPlayingRef.current) return;
    startPlayback().catch((error) => {
      console.warn('[useMetronome] failed to rebuild loop (sound change):', error);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundPresetId, customSoundUri]);

  // Effect 2: debounced rebuild when BPM changes (400ms after user stops dragging)
  useEffect(() => {
    if (!isPlayingRef.current) return;
    if (rebuildDebounceRef.current) clearTimeout(rebuildDebounceRef.current);
    rebuildDebounceRef.current = setTimeout(() => {
      rebuildDebounceRef.current = null;
      if (!isPlayingRef.current) return;
      startPlayback().catch((error) => {
        console.warn('[useMetronome] failed to rebuild loop (bpm change):', error);
      });
    }, 400);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bpm]);

  return { bpm, isPlaying, currentBeat, play, pause, stop, toggle, setBpm };
}

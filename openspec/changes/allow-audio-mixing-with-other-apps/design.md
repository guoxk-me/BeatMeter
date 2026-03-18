## Context

The metronome currently configures Expo Audio with `interruptionMode: 'doNotMix'` in `src/hooks/useMetronome.ts`. That setting requests exclusive audio focus, which conflicts with the app's real-world use case: many users practice while another music app is playing. In the reported failure mode, the metronome starts while another app is active, but after the external app changes tracks the metronome no longer produces audible sound.

This change is localized to metronome playback, but it is cross-cutting across iOS and Android audio session behavior. The app must keep its existing expectations for silent mode playback, background playback, and non-fatal recovery when audio state changes.

## Goals / Non-Goals

**Goals:**
- Allow the metronome to remain audible while another audio app is also playing.
- Preserve metronome playback when the external app starts, resumes, or changes tracks.
- Keep current silent-mode and background playback support.
- Handle recoverable audio interruptions without crashing or leaving stale playback state.

**Non-Goals:**
- Adding a user-facing toggle for exclusive versus mixed audio.
- Reworking beat scheduling, loop generation, or haptic timing beyond what is needed for audio continuity.
- Building lock-screen transport controls or other background media-session features.

## Decisions

### Use shared audio focus instead of exclusive focus
Set Expo Audio interruption mode to `mixWithOthers` instead of `doNotMix` when configuring the metronome session.

- Why: exclusive focus is the direct cause of the conflict with music apps. `mixWithOthers` matches the product expectation that the metronome can run alongside background reference audio.
- Alternative considered: `duckOthers`. Rejected because it would reduce the volume of the user's music app, which is more intrusive than needed for a practice utility.
- Alternative considered: keep `doNotMix` and attempt to recover after every interruption. Rejected because it preserves the core incompatibility and depends on brittle interruption timing.

### Re-apply audio mode before metronome playback starts or rebuilds
Keep audio mode configuration in the playback path so the app reasserts the desired shared session before starting or rebuilding the loop player.

- Why: the hook already rebuilds audio on BPM and sound changes, and external audio apps may cause session churn. Re-applying the expected mode reduces the chance that a later system transition leaves the metronome in an incompatible session state.
- Alternative considered: configure audio mode only once on mount. Rejected because one-time setup is less resilient after interruptions or app-state changes.

### Treat external audio changes as recoverable, not fatal
If player start or rebuild fails after another app changes audio state, log a warning and keep the app responsive so playback can be retried cleanly.

- Why: users should not lose metronome controls or see a crash because another app took audio focus momentarily.
- Alternative considered: surfacing a blocking alert for every interruption. Rejected because transient audio focus changes are common and would create noisy UX.

## Risks / Trade-offs

- [Mixed playback can sound louder or cluttered] -> Keep existing volume control behavior so users can rebalance the metronome against external music.
- [Platform differences in audio focus handling may still produce edge cases] -> Verify on at least one real mixed-audio flow and preserve retryable playback state if the OS interrupts audio unexpectedly.
- [Re-applying audio mode during rebuilds may add minor overhead] -> Limit the change to existing playback boundaries rather than adding more frequent audio-session churn.
- [Background media control features remain unavailable with mixed mode] -> Accept this trade-off because the app's priority is simultaneous playback, not lock-screen transport integration.

## Migration Plan

1. Update the metronome audio session configuration to use shared mixing behavior.
2. Verify metronome playback against an external music app, including track changes during active playback.
3. If regressions appear, revert the audio mode change to restore previous exclusive-focus behavior while investigating platform-specific handling.

## Open Questions

- Does either platform require an explicit player restart callback beyond the existing rebuild flow after severe audio interruptions?
- Should the app eventually expose a setting for musicians who prefer to duck or pause other audio instead of mixing?

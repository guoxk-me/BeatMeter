## 1. Audio Session Update

- [x] 1.1 Change the metronome audio mode in `src/hooks/useMetronome.ts` from exclusive focus to `mixWithOthers` while preserving silent-mode and background playback flags.
- [x] 1.2 Ensure audio mode is still applied at the playback and rebuild boundaries so external track changes do not leave the metronome in an incompatible session state.

## 2. Playback Resilience

- [x] 2.1 Review start and rebuild error handling in `src/hooks/useMetronome.ts` so recoverable external audio interruptions remain non-fatal and retryable.
- [x] 2.2 Confirm no existing metronome lifecycle behavior regresses for app foreground/background transitions while mixed audio is enabled.

## 3. Verification

- [x] 3.1 Run `npx tsc --noEmit` after the implementation change.
- [ ] 3.2 Manually verify the metronome can play alongside another audio app, including after the other app changes tracks, and record any platform-specific gaps.

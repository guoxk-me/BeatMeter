## Why

When users play music in another app alongside the metronome, the metronome loses audio after the other app changes tracks. The current audio session is configured not to mix with other audio, so the app cannot reliably keep metronome playback active during common practice workflows.

## What Changes

- Allow the metronome audio session to mix with other apps instead of forcing exclusive playback.
- Define how the metronome should behave when external audio starts, pauses, or changes tracks.
- Preserve recoverable behavior so the metronome does not silently stop after an external audio interruption.
- Keep existing background playback and silent-mode support intact.

## Capabilities

### New Capabilities
- `external-audio-mixing`: Defines metronome behavior when device audio is shared with other apps, including playback continuity across external track changes and interruptions.

### Modified Capabilities

None.

## Impact

- Affected code: `src/hooks/useMetronome.ts`, and possibly app-level audio configuration touchpoints.
- Affected systems: Expo audio session configuration and metronome playback lifecycle.
- User impact: musicians can keep reference music and the metronome playing at the same time with fewer silent failures.

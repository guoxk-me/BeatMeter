## 1. App shell and navigation foundation

- [x] 1.1 Review `App.tsx` and existing UI composition to identify the safest insertion point for dual-module navigation
- [x] 1.2 Add shared app-shell state/constants for switching between metronome and fitness guidance
- [x] 1.3 Implement the top-level dual-module entry UI with consistent naming for metronome and fitness guidance
- [ ] 1.4 Verify switching between the two primary destinations does not break existing metronome rendering

## 2. Fitness guidance content model

- [x] 2.1 Create structured local data definitions for training categories, actions, equipment, and placeholder media metadata
- [x] 2.2 Populate MVP category data for chest, shoulders, back, and legs with action detail content and safety guidance
- [x] 2.3 Populate MVP equipment guidance data for at least eight common equipment items
- [x] 2.4 Add reusable helpers/types so fitness content can be rendered without duplicating shape logic across components

## 3. Fitness guidance UI implementation

- [x] 3.1 Build the fitness guidance home view with category, equipment, and media entry points
- [x] 3.2 Implement category listing and action detail screens/components using the local structured content
- [x] 3.3 Implement equipment listing and equipment detail screens/components with clear back navigation
- [x] 3.4 Add placeholder action media presentation using bundled images and/or static video placeholder blocks instead of live AI generation
- [x] 3.5 Add clear disclaimer copy for training safety and non-medical guidance in the relevant fitness detail surfaces

## 4. Training duration persistence

- [x] 4.1 Extend local persisted settings/storage shape to support recent training result data without breaking existing metronome settings
- [x] 4.2 Implement start/stop training timer behavior for the fitness guidance flow
- [x] 4.3 Display the completed training duration result in the UI and restore the most recent saved result on app relaunch
- [x] 4.4 Verify invalid or missing stored fitness data fails gracefully without crashing the app

## 5. Branding, about page, and feedback

- [x] 5.1 Introduce centralized branding constants for the new in-app product name and shared descriptive copy
- [x] 5.2 Update key app surfaces to use the centralized branding instead of scattered legacy labels
- [x] 5.3 Implement the about page with AI-assisted + human-reviewed messaging, free usage statement, blog entry, and feedback entry
- [x] 5.4 Add lightweight configurable blog/feedback links with fallback behavior if a destination is unavailable or not yet finalized

## 6. Metronome experience protection

- [x] 6.1 Review the existing metronome hook/component flow to ensure module switching does not reset or corrupt core playback state unexpectedly
- [x] 6.2 Update metronome entry and return paths so the user can reach the metronome directly from the new app shell
- [ ] 6.3 Verify BPM adjustment, play/pause/stop controls, settings persistence, and beat feedback remain equivalent to the prior experience after the shell changes

## 7. Verification and implementation readiness

- [x] 7.1 Run `npx tsc --noEmit` after the implementation work and fix any type regressions
- [ ] 7.2 Manually verify dual-module navigation, fitness content browsing, equipment guidance, training timer persistence, about page links, and metronome regression coverage
- [x] 7.3 Document any unresolved asset placeholders, final branding decisions, or external link values that must be confirmed before release

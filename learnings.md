# Learnings

## 2026-06-13 - Repository setup

Assumptions tested:
- `C:\Projects\EcoEYE` was not already a Git checkout; it was an empty workspace directory.
- The GitHub repository currently contains only `README.md` as application content.
- There is no dependency manifest yet, so there is no install command to run.

Refinements:
- Use project-local `.worktrees/` for isolated Codex work in this repo.
- Use flat branch names in this environment because the sandbox blocked nested ref creation before escalation.
- Baseline verification for now is repository/worktree cleanliness rather than a test suite.

Next likely slice:
- Scaffold the hackathon demo app from the README MVP: dashboard map, mesh animation, simulated ingest route, and notifier demo path.

## 2026-06-13 - MVP proof of concept

Assumptions tested:
- The README is a product/demo spec rather than an existing app implementation.
- A local in-memory Spider API is enough for the hackathon proof of concept.
- Twilio must be optional: without credentials the notifier should return visible simulated logs; with configured numbers and a client it can call Twilio.
- Leaflet can support the demo without remote map tiles by rendering vector nodes and links over a CSS terrain background.

Refinements:
- Added `?autorun=1` to support deterministic booth screenshots and headless visual QA without changing the normal click workflow.
- Changed TypeScript `moduleResolution` to `Bundler` so Vite package exports resolve cleanly.
- Removed the React plugin from `vitest.config.ts` to avoid duplicate Vite type conflicts between Vitest and root Vite.
- Darkened the UI after visual QA so the implementation better matches the generated forest operations dashboard concept.

Next likely slice:
- Add a second threat button and a short replay/reset control if the demo team wants more than the single chainsaw story.

## 2026-06-13 - PR readiness

Assumptions tested:
- Running Vitest from local `main` while a project-local worktree exists can collect duplicate tests under `.worktrees/`.
- The feature branch itself was still healthy; the failure was caused by local test discovery crossing worktree boundaries.

Refinements:
- Exclude `.worktrees/**` in `vitest.config.ts` so the mandated worktree workflow and the test runner can coexist.
- Keep the PR branch worktree alive after publishing because it will be needed for review feedback.

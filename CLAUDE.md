# typing

A browser typing game built with Vite, React, TypeScript, and react-three-fiber (Three.js). A spaceship crosses the screen from left to right as the player types a sample sentence correctly; a wrong keystroke blocks progress until the correct key is pressed.

## Tech choices

- **Vite + React + TypeScript**, scaffolded from `create-vite`'s `react-ts` template.
- **react-three-fiber** (`@react-three/fiber`) for the 3D scene rather than vanilla Three.js — keeps the scene declarative and idiomatic to the rest of the React codebase. `@react-three/drei` supplies helpers (e.g. `Stars` for the background field).
- `OrbitControls` (`@react-three/drei`) is enabled in the game scene, with mousewheel zoom, so the camera can be freely orbited/zoomed while typing.
- Keyboard input is handled with a single global `window` `keydown` listener inside `useTypingChallenge` (not a focused `<input>`), so the player never needs to click into a text field to start typing.
- `vite.config.ts` sets `build.chunkSizeWarningLimit: 2000` (2MB) — Three.js bundles routinely exceed Vite's 500KB default, and code-splitting isn't worth it at this project's size.

## Development log

After implementing each feature, capture a screenshot of the running app and save it to `dev-log/`, named:

```
dev-log/YYYY-MM-DD_HH-MM-SS-<short-feature-slug>.png
```

Use the local date and time the screenshot was taken (not just the date), so multiple screenshots on the same day don't collide and can be ordered chronologically.

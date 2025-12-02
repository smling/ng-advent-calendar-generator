# NG Advent Calendar Generator 🎄

Generate ready-to-embed advent calendar HTML/CSS/JS with a live preview. Built with Angular 21 and Angular Material; defaults to a two-column layout: form on the left, Preview/Code tabs on the right.

## Features at a glance

| ✅  | What            | Details                                                                                            |
| --- | --------------- | -------------------------------------------------------------------------------------------------- |
| 🎯  | Number range    | Set start/end numbers (defaults 1–24); sequential or randomized ordering.                          |
| 🧩  | Layout styles   | Fixed grid or random mosaic tile sizes for a denser layout.                                        |
| 🌈  | Tile styling    | Gradient or solid backgrounds, custom start/end colors, font size/family/color.                    |
| 🖼️  | Live sandbox    | Preview tab renders the calendar in a sandboxed iframe so clicks and styling are safe.             |
| 💻  | Copy-paste code | Code tab shows the generated HTML/JS/CSS, including the `onDayClicked(dayElement, dayValue)` hook. |

## Using the page

| Step | What to do                                                                                        |
| ---- | ------------------------------------------------------------------------------------------------- |
| 1    | Choose start/end numbers (positive integers). Validation hints appear if values are invalid.      |
| 2    | Pick a format: Random shuffles once, Sequential lists numbers in order.                           |
| 3    | Choose a calendar item layout: Fixed (uniform tiles) or Random (varied tile sizes).               |
| 4    | Select background format: Linear gradient (start + end colors) or Solid color (start color only). |
| 5    | Tune typography: font size (rem), font family, and font color.                                    |
| 6    | Open **Preview** to see the sandboxed calendar; click a tile to trigger `onDayClicked`.           |
| 7    | Open **Code** to copy the HTML, JavaScript, and CSS snippets for your site/app.                   |

## Dependencies

| Type            | Packages                                                                        |
| --------------- | ------------------------------------------------------------------------------- |
| Runtime         | @angular/core, @angular/common, @angular/material, @angular/router, rxjs, tslib |
| Dev             | @angular/cli, @angular/build, @angular/compiler-cli, typescript, vitest, jsdom  |
| Package manager | npm 11.x (see `packageManager` in `package.json`)                               |

## Local setup

1. Install Node (matching npm 11.x).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server (http://localhost:4200/):
   ```bash
   npm start
   # or: ng serve
   ```
4. Run tests (Vitest via Angular):
   ```bash
   npm test
   # add -- --coverage for coverage
   ```
5. Build for production (outputs to `dist/`):
   ```bash
   npm run build
   ```

## Project scripts

| Command                        | Purpose                                                   |
| ------------------------------ | --------------------------------------------------------- |
| `npm start`                    | Serve the app with live reload at http://localhost:4200/. |
| `npm run build`                | Production build to `dist/`.                              |
| `npm test`                     | Run Vitest unit tests (JSDOM).                            |
| `ng generate component <name>` | Scaffold new Angular components/directives/pipes.         |

## Notes

- Generated preview uses precomputed random days/sizes so the embedded snippet stays stable across renders.
- The sandboxed iframe keeps the preview isolated while still allowing click handling via `onDayClicked`.
- Global styles live in `src/styles.css`; entry points are `src/main.ts` and `src/index.html`.

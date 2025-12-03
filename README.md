# NG Advent Calendar Generator

Generate ready-to-embed advent calendar HTML/CSS/JS with a live preview. Built with Angular 21 + Angular Material; the UI uses signals for state, a two-column shell (form left, Preview/Code tabs right), and precomputes random values so previews match the copied snippet.

![Screenshot of the generator](public/images/Screenshot%202025-12-02%20213317.png)

## 🔎 Quick highlights

| What            | Details                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Number range    | Defaults to 1–24; inputs are coerced to positive integers with sane fallbacks.                                           |
| Format          | Sequential order or a one-time random shuffle; precomputed days are baked into the snippet for deterministic embeds.     |
| Layout styles   | Fixed grid or random mosaic sizes (four variants) generated once and embedded alongside the day list.                    |
| Tile styling    | Gradient or solid backgrounds (solid reuses start color) plus font size/family/color via CSS variables.                  |
| Live sandbox    | Preview tab renders the HTML/CSS/JS in a sanitized `srcdoc` iframe (`allow-scripts`) isolated from the app.              |
| Copy-paste code | Code tab shows HTML, JavaScript, and CSS, including `onDayClicked(dayElement, dayValue)` with a 300ms highlight outline. |

## 🚀 How to use

- Pick start/end numbers; invalid entries fall back to defaults (1 and 24).
- Choose format: Random shuffles once; Sequential lists in order.
- Select layout: Fixed uniform tiles or Random mosaic sizes.
- Set background format: Linear gradient (start + end colors) or Solid (start color only).
- Tune typography: font size (rem), font family, and font color.
- Open **Preview** to see the sandboxed calendar and click tiles to trigger `onDayClicked`.
- Open **Code** to copy the HTML/JS/CSS snippets for your site/app.

## 🧰 Project scripts

| Command                        | Purpose                                                   |
| ------------------------------ | --------------------------------------------------------- |
| `npm start`                    | Serve the app with live reload at http://localhost:4200/. |
| `npm run build`                | Production build to `dist/`.                              |
| `npm test`                     | Run Vitest unit tests (JSDOM).                            |
| `ng generate component <name>` | Scaffold new Angular components/directives/pipes.         |

## 📦 Dependencies

| Type            | Packages                                                                        |
| --------------- | ------------------------------------------------------------------------------- |
| Runtime         | @angular/core, @angular/common, @angular/material, @angular/router, rxjs, tslib |
| Dev             | @angular/cli, @angular/build, @angular/compiler-cli, typescript, vitest, jsdom  |
| Package manager | npm 11.x (see `packageManager` in `package.json`)                               |

## 🛠️ Local setup

1. Install Node (matching npm 11.x).
2. Install dependencies: `npm install`
3. Start dev server (http://localhost:4200/): `npm start`
4. Run tests (Vitest via Angular): `npm test` (add `-- --coverage` for coverage)
5. Build for production (`dist/`): `npm run build`

## 📝 Notes

- Random days and tile sizes come from `GeneratorService.buildCodeBlocks`, embedded into `config` so preview and copied code stay in sync.
- `renderCalendar` applies CSS variables for background (solid reuses start color), font size, font family, and font color; fixed layout forces `size-1x1`.
- The iframe preview uses sanitized `srcdoc` to isolate the generated calendar while still letting `onDayClicked` log the day and briefly outline the tile.
- Global styles live in `src/styles.css`; entry points are `src/main.ts` and `src/index.html`.

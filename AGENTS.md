# Repository Guidelines

## Project Structure & Module Organization

- App source lives in `src/` with the root module scaffolded in `src/app/` (`app.ts`, `app.routes.ts`, `app.html`).
- Global entry files: `src/main.ts` bootstraps the Angular app; `src/index.html` hosts it; shared styles sit in `src/styles.css`.
- Unit specs reside alongside code as `*.spec.ts` (e.g., `src/app/app.spec.ts`). Built assets emit to `dist/` after a build.
- Components are kept in folders named after the component (e.g., `src/app/generator/generator/`, `src/app/generator/generator-preview/`, `src/app/generator/generator-code/`).

## Build, Test, and Development Commands

- `npm install` - install dependencies (project expects npm 11.x per `package.json`).
- `npm start` or `ng serve` - run the dev server at `http://localhost:4200/` with live reload.
- `npm run build` or `ng build` - production build to `dist/`.
- `npm test` or `ng test` — run Vitest-powered unit tests (JSDOM environment). Add `-- --coverage` to collect coverage.
- `ng generate component <name>` — scaffold Angular building blocks (components, directives, pipes).

## Coding Style & Naming Conventions

- TypeScript/HTML/SCSS indent with 2 spaces; UTF-8, final newline; trim trailing whitespace (`.editorconfig`).
- Prefer single quotes in TS (`quote_type = single`); align with Prettier settings: `printWidth: 100`, `singleQuote: true`.
- Component selectors: `app-<feature>`; filenames: kebab-case (`calendar-item.component.ts`).
- Keep templates presentational; push logic into TypeScript; keep functions pure where practical.

## Testing Guidelines

- Unit tests use Vitest via `ng test`; keep specs close to the code they cover as `*.spec.ts`.
- Name tests by behavior (“renders empty state”, “builds day list for December”).
- Aim for meaningful coverage on date logic and generator rules; add edge cases for leap years and incomplete calendars.

## Commit & Pull Request Guidelines

- Use concise, imperative commit messages (“Add calendar grid layout”, “Fix day generation off-by-one”).
- Keep PRs focused; include a short summary, screenshots/GIFs for UI changes, and steps to reproduce/test.
- Link issues when available; mention breaking changes explicitly; ensure `npm test` passes before requesting review.

## Security & Configuration Tips

- Do not commit secrets; Angular env files or API keys should stay out of VCS. Prefer environment variables or local `src/environments/*.ts` ignored by Git.
- Verify generated assets before publishing; review third-party additions in `package.json` for licensing and size impact.

## Current UI Implementation Notes

- Angular Material is installed with a custom theme (`src/custom-theme.scss`) and async animations enabled in `app.config.ts`.
- Generator screen uses a two-column layout on desktop: form on the left, Material tabs (Preview/Code) on the right; the shell is centered at ~95% width (max 1400px).
- Preview tab renders a sandboxed iframe (`srcdoc` sanitized with `DomSanitizer`) showing the generated calendar; height expanded to reduce scroll. Summary cards sit above the iframe.
- Generator options include format (sequential/random) and calendar item layout (fixed/random). Random choices are precomputed once (days and tile sizes) and injected into the code snippet to avoid re-randomizing on render.
- Additional customization: background format (gradient/solid) with color pickers, tile font size/family/color; preview tab can optionally hide/show summary.
- Generated code defines `onDayClicked(dayElement, dayValue)` and binds each tile click inside the iframe; tiles get a transient highlight on click.
- Calendar CSS in the snippet uses a dense grid (min 120px tracks, auto-rows 120px, min-height 480px) and random size classes when requested to better fill space.

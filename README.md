# Louka Altdorf Reynes — portfolio

Personal portfolio built with Next.js 15, React, TypeScript, Tailwind CSS and
next-intl. Available in French, English and German at /fr, /en and /de.

## Local development

Run from the repository root in WSL:

```sh
yarn install --frozen-lockfile
yarn dev
```

Open http://localhost:3000/fr. Use `yarn build` followed by `yarn start` to
preview the production build. Both Next.js commands accept `--port` if needed.

## Content and design

- `locales/{fr,en,de}.json`: translated profile, experience, skills, education and projects.
- `src/components/`: homepage sections; `src/app/[locale]`: homepage and services routes.
- `src/lib/contact.ts`: shared contact details and CV download URL.
- `public/CV_Louka_Altdorf-Reynes.pdf`: the latest user-supplied complete CV, in French.
- `public/resume_en.pdf`: compatibility URL serving the same current French PDF.
- `public/figma/`: original artwork extracted from the selected Figma variant.
- `public/technology/`: transparent Devicon / Simple Icons SVGs, source attribution and licenses.
- `src/app/fonts/`: local Mulish/Fraunces fonts and OFL licenses.

The current content is based on CV_complet_Louka_Altdorf-Reynes.pdf supplied on
18 September 2026. Translations do not imply a translated downloadable PDF.
Keep dates and achievements tied to this source; do not add assumed education dates.

Design reference: [Portfolio Website (Copy)](https://www.figma.com/design/xDgGk6pHfYtVCDDXIb4KkE/Portfolio-Website--Copy-?node-id=0-1).
Consult through the browser; the Figma file is on the free plan.

Carousels use Embla for infinite movement and free dragging. Experiences, skills
and projects start immediately at 0.65 px/frame on desktop and pause on hover or
keyboard focus. Pointer clicks do not retain a focus pause after mouse leave.
They expose navigation/pause controls. On small screens or touch-first devices,
these content carousels are manual only, with arrows, dots and free dragging.
Technologies scroll faster without arrows, pause button or hover pause, per the
owner's choice. All respect reduced motion, hidden tabs and open dialogs.
The wheel always scrolls the page vertically. The technology band spans the full page width and runs at 1.2 px/frame on desktop
(0.45 px/frame on mobile/touch),
independently of vertical scroll and pointer/keyboard hover; dragging pauses them
until release. A fixed header smoothly contracts and offers a return-to-top link.
Above 900px, major sections have a minimum screen height minus the header;
content can grow naturally, and short CTA/technology interludes stay compact.
Details open in accessible native dialogs with the shared technology tiles.
TechnologyIcon supplies brand logos or Heroicons pictograms for every tag,
including project tags and concepts such as RAG. Skill examples have pastel
project panels with a folder icon and orange accent.
Education uses two static school panels with official CESI/Rouen marks (sources
in public/schools/SOURCES.md), with natural card heights and consistent Bac +3 / Bac +2 / Bac +3
badges for the three courses in all languages. Mobile sections have more space and a next-card peek;
scroll reveals and decorative transforms are disabled on mobile/touch. Desktop
reveals are shorter; reduced motion disables automatic movement on every device.
Styles are mobile first.

## Validation

```sh
yarn tsc --noEmit
yarn build
git diff --check
```

Check /fr, /en and /de on desktop and mobile, language switching, carousels (arrows, dots, keyboard, touch),
education, section links, contact links and the CV download.
Chat regression tests: `node --test tests/chat.test.mjs`. GitHub Actions builds and tests the ARM64 production container.
See `docs/design-validation.md` for design references, checks and intentional content changes.
`yarn lint` is declared but currently opens Next.js ESLint setup: no ESLint
dependency/config is installed. Do not treat it as a completed lint check.

## Hosting

The owner authorized migration from Vercel to the Telalucis K3s cluster on
18 September 2026. Dockerfile builds a non-root Node 24 standalone server;
GitHub Actions publishes ARM64 images to GHCR. The infra-cluster repository
pins the image digest and owns Argo CD, routing, resource limits and isolation.
See [deployment](docs/deployment.md) for release, DNS cutover and rollback.

## AI assistant: local by default

The chatbot uses the existing local Ollama model `qwen3:8b`, with the public CV
as server-side context. It presents itself as Louka’s assistant. No model tools or
filesystem access. No external paid API is active.
Production mode is disabled by default. For a **local-only** production preview:

```sh
yarn build
PORTFOLIO_CHAT_MODE=local yarn start --hostname localhost --port 3002
```

Open http://localhost:3002/fr. Ollama must already be running. Cold model startup
can delay the first answer. Messages stream as plain text; stopping/closing
cancels generation. Completed exchanges and the draft persist in sessionStorage per tab/language,
including after dialog closure and page reload, for up to eight hours of inactivity.
The dialog offers a clear-conversation button. Interrupted replies are not saved;
the pending question is restored as a draft. No login or conversation database.

The API enforces bounded input/output/time, signed history, origin checks,
one concurrent request and global per-process minute/hour quotas.
See [chat security](docs/chat-security.md) for exact limits, environment settings,
remaining risks and the protections required before public activation.
The future VPS deployment is separate; this local pass enables no public access.

An optional OpenRouter adapter is prepared but inactive. It requires an explicitly
selected model, a dedicated server-side key and a monthly budget. Before sending
any question, it verifies that the key has a positive monthly credit limit no
higher than the configured budget, remaining credit and BYOK usage included.
Routing also sets fixed price/output limits, no fallback and privacy filters.
No provider account, key, model or budget has been selected or provisioned.
The remote adapter has mock tests only; live verification remains necessary
after provider selection. See .env.example and docs/chat-security.md.

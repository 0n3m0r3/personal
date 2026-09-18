# Portfolio instructions

## Architecture
Next.js 15 App Router, React 18, TypeScript and Tailwind CSS. Routes live in
src/app/[locale]; next-intl loads locales/fr.json, locales/en.json and locales/de.json.
Homepage sections are in src/components; shared contact/download URLs are in
src/lib/contact.ts. Public images, Figma exports and PDFs live in public/.

## Commands and validation
Use WSL/Linux from the repository root. yarn.lock is the existing lockfile.
- yarn dev: local development.
- yarn build: production build, including Next.js type validation.
- yarn start: serve a completed production build.
- yarn tsc --noEmit: standalone TypeScript check.
- yarn lint: declared script, but ESLint/config are not currently installed; report
  this limitation rather than accepting the interactive setup or adding dependencies.
Chat regression tests: node --test tests/chat.test.mjs. GitHub Actions builds/tests the ARM64 container. For UI changes, run build and
type checks, then check desktop/mobile, FR/EN/DE, interactive sections and PDF links.

## Git and ticketing
Fetch and inspect status, divergence and diffs before development and delivery.
Preserve existing work. Merge upstream changes without rewriting shared history.
Use codex/ for new branches; retain the current feature branch for ongoing work.
No project tracker is declared; do not create tickets. The user has authorized deployment to Telalucis (18 September 2026).
Deliver through reviewed PRs and the infra-cluster GitOps repository. Review the complete diff before delivery.

## Design and content
Use the supplied Figma through the browser. Preserve its navy/orange palette,
pastel backgrounds, typography and responsive section structure.
Use the user's latest supplied CV as the professional content source. Keep all
three languages consistent; never invent dates, qualifications, client reviews,
results or project URLs. The downloadable source CV remains in French.

## Infrastructure, environment and approvals
Hosting is migrating from Vercel to Telalucis. The infrastructure source of truth
is /home/louka/projets/infra-cluster; follow its instructions and Argo CD workflow.
Container builds use Dockerfile and .github/workflows/container.yaml.
Do not change hosting configuration or promote production without explicit approval.
The active AI route uses loopback Ollama (OLLAMA_BASE_URL/OLLAMA_MODEL).
An optional, inactive OpenRouter adapter is configured in .env.example; it
requires a dedicated monthly-capped key, explicit model and budget. No credentials
or paid provider are provisioned. Keep inference local until the user chooses and
authorizes a provider/model/budget. Sessions use sessionStorage per tab/language
with an eight-hour TTL; only signed server history is accepted by the API. Never expose
or commit credentials, local environment files or private operational information.
Production chat is disabled by default; local build previews explicitly set
PORTFOLIO_CHAT_MODE=local. See docs/chat-security.md before any public activation.

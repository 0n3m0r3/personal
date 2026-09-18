# Local portfolio validation

Reference: [Figma Portfolio Website](https://www.figma.com/design/xDgGk6pHfYtVCDDXIb4KkE/Portfolio-Website--Copy-?node-id=129-80).
Inspected through the browser on 18 September 2026. The selected reference is
Homepage-02 (1920 × 6612), the second desktop variant, with the Mobile Version
(390 × 4818) as the mobile reference.

## Design and content

Original exported Figma artwork supplies the hero/about gradients and strokes,
both CTA backgrounds, footer pattern, waving hand and chatbot artwork. Skill icons now use the existing Heroicons library.
Portrait rings use the measured offset centers; social circles link to the
actual LinkedIn/GitHub profiles and email. About has no rounded outer corners.
The footer restores outlined contact labels, two navigation columns, a white
email panel and full-width separators.

Layouts start with mobile rules and expand at 600/900/1280/1600px. The skill
cards follow variant 2: icon, serif heading, white logo tiles, concise summary,
then an accessible detail button. The whole skill card is clickable; dragging
does not accidentally open it. Education now uses two static panels grouped by establishment with official logos.
The 23 technology logos are transparent local SVGs from Devicon; source commit
and license are in public/technology. Mulish and Fraunces are served locally with their OFL
licenses; Fraunces is not preloaded above the fold.

Content deliberately differs from the old mockup: the current CV, LinkedIn
portrait, four years of experience (owner correction) and factual projects
replace placeholders and the fictional testimonial. Translated copy and fuller
content affect line breaks and section heights. This is a visual comparison
against the source frames, not a zero-difference full-page pixel assertion.

## Interactions

- Embla 8.6.0 provides infinite, slow continuous movement with free inertial
  dragging. Original content is not duplicated into extra focusable DOM copies.
- On desktop with a mouse, experiences, skills and projects start immediately
  at 0.65 px/frame and pause on hover,
  keyboard focus or explicit pause. Technologies span the full page width and move at 1.2 px/frame on desktop
  (0.45 on mobile/touch), without
  navigation/pause buttons and continue on hover, keyboard focus and vertical scroll.
- All loops suspend for dragging, dialogs, hidden tabs and reduced motion.
  Offscreen state suspends experiences/skills/projects, but not technologies. The mouse wheel remains native vertical scrolling everywhere.
- Removing the technology pause button is an explicit owner choice. Reduced
  motion remains supported; no full WCAG 2.2.2 conformance claim is made for this
  uninterrupted marquee.
- The header switches to a compact fixed bar after 80px; the brand returns to
  the top. Anchor offsets reserve space below the fixed bar.
- Arrow/dot controls and Left/Right/Home/End navigation wrap around. Active dots
  use the Figma peach disc/orange center. The loop seam preserves slide spacing.
- Native modal dialogs hold experience/skill details and fieldwork. They support
  Escape, backdrop close, initial focus and return to their original trigger.
- Headless UI language listbox supports keyboard navigation and keyboard-only
  focus outlines. Locale replacement keeps current scroll and drops stale hashes.
- Chat launcher is fixed at the viewport edge. The local AI dialog remains
  dynamically loaded. CV labels translate to CV / Résumé / Lebenslauf; the PDF
  remains the supplied French source. External profile links open a new tab.
- The collaboration CTA opens projects; the final CTA opens an email draft.
  French punctuation uses nonbreaking spaces.

## Verification

Earlier refinement pass (before the current interaction/security update):
- Production build, standalone TypeScript, five chat regression tests and
  git diff --check.
- Browser desktop/mobile visual comparison; FR/EN/DE copy and controls.
- Final local inference returns a grounded one-sentence description of Pitly;
  closing the chat restores focus to its fixed launcher.
- Localized homepage/services routes all return HTTP 200; downloaded CV still
  matches the supplied source PDF byte-for-byte.
- 320px German hero: no title/badge overlap or horizontal document overflow.
- Layouts inspected at 390, 768, 1024, 1440 and 1920px.
- Contact anchor, return to header, then English selection: URL has no stale
  hash and scrollY stays 0. Pointer focus has no outline.
- Experience details keep all neighboring cards at their original height;
  Escape restores focus to the trigger.
- Skill details show CV-backed examples; keyboard tabs select education.
- Touch swipe moves horizontally without opening a modal; vertical touch scroll
  remains available. End then Right wraps from skill 6 back to skill 1.
- Hover stops the track immediately and leaving it resumes continuous movement.
  Reduced-motion emulation stops the track; temporary emulation is reset.
- The former wheel passage was verified here; it has since been removed at the owner’s request.
- Lighthouse production measurements are recorded in validation-results.json.
  They are local machine measurements, not a guarantee for deployed hosting.

Earlier baseline checks retained: HTTP 200 for localized home/services pages,
downloaded PDF SHA-256 identical to the source, chat rejects invalid roles and
foreign origins, real local inference/streaming/cancellation/history reset, and
email-copy confirmation. The PDF is unchanged. The AI request contract has since been hardened; see chat-security.md.

Lint remains unconfigured: yarn lint invokes Next.js ESLint setup, so no
standalone lint pass is claimed. No CI workflow exists.

## Local AI boundary

Ollama/qwen3:8b remains the active local provider. An optional OpenRouter adapter
is implemented but inactive and mock-tested only; no account/key/model/budget was
selected. Sessions now persist per tab/language in sessionStorage with an eight-hour
TTL and explicit reset. Only completed server-signed history is sent to the model.
See chat-security.md for exact limits and public deployment prerequisites.

The preview binds to localhost:3002. Nothing was pushed or deployed.
Future VPS hosting remains outside this local design iteration.

## Previous interaction and security update

- Production build, standalone TypeScript, 11 chat tests and git diff --check pass.
- Browser checks at 1920/1440px desktop and 390/320px mobile; localized navigation
  FR -> DE -> EN -> FR, no horizontal document overflow at the tested mobile widths.
- Header fixed at y=0 after scroll, 77px including border on desktop. Experience
  anchor sits at y=96px, below the header; brand returns to scrollY=0.
- Wheel moves the document immediately (2214px -> 2727px in the observed gesture).
- Skill icons use Heroicons; first card remains neutral unless hovered/focused.
  Detail dialogs use a plus indicator, pastel header and consistent body type.
  Escape restores the trigger focus and body scrolling.
- Technology carousel has zero buttons. Track moves from -242px to -1474px with
  pointer held over it. Reduced-motion emulation stops it; override restored.
- Chat layout verified at 390x844 and 320x568 with composer/close button available.
  Native dialog focus and session clearing on close verified.
- Real Ollama response to a Pitly question, followed by a context-dependent question
  about its technologies, completed successfully with the new signed history.
- A request to access private files/execute commands was refused by the model.
  This single behavioral check is not a prompt-injection immunity claim.
- HTTP checks: absent/foreign origin -> 403; forged assistant history -> 400;
  tampered signed history -> 400 expired; production server without activation
  -> 503 unavailable. The temporary default-off server was stopped after testing.
- All six localized homepage/services routes return HTTP 200.
- Browser console contained no errors in the final UI session.
- Lighthouse results are in validation-results.json; automated scores do not
  establish full WCAG conformance (see the intentional marquee choice above).

Current implementation details and deployment prerequisites are documented in
[chat-security.md](chat-security.md). Only the local preview is running.

## Current section, session and provider update — 18 September 2026

- Desktop major sections use a minimum 100svh minus the compact header; the hero
  reserves the expanded header. Content may exceed that height. Short interludes
  and mobile layouts retain natural height. At 1920x855 the about/experience/skills
  sections measured 779px; at 1440x900 skills measured 824px.
- The header stays fixed throughout its 450ms size transition, avoiding a
  fixed-position switch. Brand/logo/language control resize with it.
- Skill details use a solid navy title area, white body and separated project rows,
  replacing gradients and nested cards. Keyboard focus/Escape remain available.
- Technology movement observed while offscreen, hovered and after a manual drag.
  The document wheel remains vertical. Reduced-motion emulation stopped the
  track; the temporary override was reset.
- Browser: desktop 1920x855 and 1440x900; mobile 390x844 and 320x568. Chat close,
  composer and reset remain visible; mobile document has no horizontal overflow.
- Real local identity response used the assistant role. Completed exchanges
  survived close/reopen and page reload; a follow-up recognized the prior project.
  Draft survived close/reopen. Reset removed both transcript and draft.
- One answer extrapolated cloud providers for BoB. The prompt was strengthened
  to prohibit attaching general skills to individual projects. This does not
  establish factual or prompt-injection immunity.
- 19 regression tests pass, covering session data and fail-closed remote budgets
  in addition to the existing input/history/rate/security tests.
- Remote key validation, request policy and streaming are mock-tested only.
  No remote inference or paid service was activated.

- Final production build, standalone TypeScript and git diff --check pass.
- Final Lighthouse 13.4.1: desktop 100/100/100/100; mobile 96/100/100/100
  (performance/accessibility/best practices/SEO). Mobile LCP 2.8s, TBT 10ms,
  CLS 0; desktop LCP 0.6s, TBT 0ms, CLS 0. Reports summarized in
  validation-results.json. These are local measurements, not hosting guarantees.
- FR -> DE -> EN -> FR language switching and translated assistant identity
  verified. All six homepage/services routes return HTTP 200.
- Downloaded CV SHA-256 still matches the supplied source PDF.
- Closing during generation restored only the original draft on reopening;
  no incomplete assistant reply was retained. Test conversation then cleared.
- Final browser error log empty. Temporary viewport/media overrides restored.


## Previous mobile and carousel refinement — 18 September 2026

- Removed the 1.6s auto-scroll startup delay; desktop content movement is now
  0.65 px/frame. Pointer/focus pauses remain intentional for reading. Projects
  and skills retain manual controls and free dragging; no wheel interception.
- Below 900px or without a fine hover pointer, content carousels are manual only.
  The technology strip is the sole continuous mobile movement, slowed to 0.45
  px/frame. All honor reduced motion, hidden tabs and modal pauses.
- Technologies cover the content viewport from x=0 to x=1425 at a 1440px desktop
  viewport with its 15px scrollbar, removing the previous left offset.
- More mobile section spacing, readable line height, left-aligned skill cards and
  a next-card peek. Decorative hover transforms, smooth page scrolling, modal
  entrance and scroll reveals are disabled on mobile/touch. Desktop reveals are
  shortened to 400ms / 10px; useful focus/hover feedback remains.
- Experience and skill modal tags reuse TechnologyTiles. Source labels are
  preserved; existing matching logos are used, with text-only tiles for other
  labels. Modal outer border is removed. No new UI dependency was added.
- Education is a static two-column desktop / stacked mobile layout: CESI (two
  qualifications) and Rouen (one course). Official SVG marks are stored locally
  with attribution in public/schools/SOURCES.md. No dates or qualifications added.
- Browser: 1440x900 desktop, 390x844 and 320x568 mobile; FR/DE/EN formation labels,
  loaded school marks, manual controls, modals and zero horizontal document
  overflow verified. Mobile content transforms stayed at 0px across observations
  while the technology strip continued; no mobile pause buttons or reveal nodes.
- Build, standalone TypeScript, 19 existing chat tests and git diff --check pass.
  Lint remains unconfigured. Six localized routes return 200; CV matches source.
- Lighthouse 13.4.1: desktop 100/100/100/100; mobile 97/100/100/100
  (performance/accessibility/best practices/SEO). Mobile LCP 2.6s, TBT 0ms,
  CLS 0; desktop LCP 0.6s. Results in validation-results.json are local measurements.

## Current icons, education and click-resume refinement — 18 September 2026

- TechnologyIcon now supplies a logo or an existing Heroicons pictogram for all
  skill, experience and project tags. LangGraph uses Simple Icons; Java,
  JavaScript and Chrome use Devicon. Versions/licenses are recorded locally.
  RAG uses a document/search pictogram. The technology marquee is unchanged.
- Bachelor has an explicit Bac +3 badge in FR/EN/DE. School panels use natural
  heights: at 1440x900, CESI measured 446px and Rouen 278px, without adding content.
- Content carousels distinguish pointer focus from keyboard focus. Clicking
  no longer leaves autoplay suspended after the pointer exits. Keyboard
  navigation still pauses for reading; explicit pause and modal behavior remain.
- Browser: pointer click followed by mouse leave resumed movement; keyboard
  focus held the settled track at -1343px across observations. The IA modal
  displays LangGraph, RAG and Python icons, with no tag lacking an icon.
- Production build, standalone TypeScript, 19 chat regression tests and
  git diff --check pass. All six localized routes return 200; the downloaded
  PDF still matches the supplied source byte-for-byte.
- Lighthouse was not rerun for this small refinement; scores above describe
  the preceding pass. Lint remains unconfigured. Nothing was pushed or deployed.

## Formation badges, project emphasis and assistant wording — 18 September 2026

- All three courses use the same level badge: Bac +3, Bac +2 and Bac +3.
  The former Bac +2 title prefix moved into its badge to avoid repetition.
  Titles, schools and downloadable PDF retain their source content.
- Skill example projects now have pale navy backgrounds, a slim orange accent
  and Heroicons folder pictograms. No new dependency or invented project link.
- Unknown personal/professional facts receive a plain acknowledgment of missing
  knowledge and an invitation to contact Louka, instead of a comment about his CV.
- Six real API exchanges with local Ollama completed: age FR/DE, unavailable
  availability/rate EN, contact follow-up using signed history, grounded BoB
  summary, and a request to impersonate Louka/invent birth data/send a message
  (refused without claiming an action). No paid provider was used.
- A seventh real exchange through the mobile chat returned the expected age
  fallback. Closing/reopening retained it; the test conversation was cleared.
  These samples do not establish immunity to hallucination or prompt injection.
- Build, TypeScript, 19 existing regression tests and diff whitespace check pass.
  Six localized home/services routes return 200; downloaded CV matches source.
- Desktop project modal inspected at 1440x900 and mobile at 390x844. Formation
  badges checked in FR/EN/DE, with no document overflow at 320px.
  Lint remains unconfigured; Lighthouse was not rerun for these small changes.

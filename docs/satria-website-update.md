# RumahKuVR website content update

The existing page now describes VR Mode / Mod VR, Controller Mode / Mod Kawalan,
and Android Tablet Touch Mode / Skrin Sentuh as input methods for the same
scenarios, hazards, tiers, scoring and objectives. The hero, platform cards,
development journey, contact copy, page metadata and `/api/project` agree.

SATRIA AI 2.0 is the performance feedback layer. The existing interactive System
pipeline describes:

Gameplay Session → Gameplay Metrics → Deterministic Scoring → Fuzzy Logic
Analysis → Gemini Generative AI → SATRIA Personalised Feedback.

Safety Performance, Independence, Attention and Recovery remain the four fuzzy
dimensions. Player recognition and correction happen in gameplay; Gemini works
with the resulting structured performance data after scoring and fuzzy analysis.

## Existing integration

The working tree already contained `SatriaAiController`, `SatriaAiService`,
`config/satria.php`, `routes/api.php`, API registration in `bootstrap/app.php`,
environment examples and `SatriaAiTest`. This update preserves them and adds no
duplicate endpoint or frontend Gemini call.

`POST /api/satria/analyze` accepts the defined session fields: platform,
difficulty, score, maximum score, hazard counts and status lists, mistakes,
retries, elapsed time, end reason, and the existing fuzzy analysis summaries.
The current contract forwards fuzzy summaries rather than four separate numeric
dimension scores. Unknown account fields are excluded; unknown nested keys are
rejected. Credentials and account or medical records are not required input.

The service requests concise Bahasa Melayu feedback, validates the returned
fields and returns `source: gemini` only on success. Missing configuration,
connection errors, timeouts, HTTP errors and invalid output produce
`503 {"error":"satria_unavailable"}`. The game client must retain its existing
fuzzy/rule-based result on that response or its own timeout:

Fuzzy Logic Analysis → SATRIA structured/rule-based feedback.

The fallback is a client responsibility; this Laravel endpoint does not compute
scores, fuzzy membership/rules or a replacement fallback result. Unity gameplay
source is outside this website repository, so this update does not independently
verify Android input handling or the Unity client's fallback behaviour.

Server configuration uses the existing `GEMINI_API_KEY`, `GEMINI_MODEL`,
`SATRIA_GEMINI_TIMEOUT` and `SATRIA_THINKING_LEVEL` settings. Keep the key on the
server, never in React, public assets or the Unity client. No real Gemini request
was made as part of this website update; mocked service checks do not prove live
provider availability.

## Capture provenance

No genuine tablet image exists in `public/images/platform`. The new card uses a
labelled text overview with a decorative tablet icon. Future real captures belong
at `public/images/platform/tablet-touch.webp` and
`public/images/platform/tablet-touch-1400w.webp`. Neither file is requested by
the current UI, so the reserved paths cause no broken images.

The mode-selection images have been replaced with a genuine current Unity Game
View capture. The screen visibly contains Mod VR, Mod Kawalan and Mod Tablet /
Skrin Sentuh. The source is
`C:/UnityProjects/FYP_HomeSafety_Kampung/Captures/website_mode_select_three_modes_2026-10-03.png`
(3840x2160). Unity MCP captured the authored UI in Edit Mode on
`Assets/Scenes/XR_ModeSelectScene.unity` without loading/saving scenes, entering
Play Mode or changing source, gameplay, accounts or settings. The full frame was
encoded into `public/images/ui/mode-select.webp` (3840x2160) and
`mode-select-1400w.webp` (1400x788); there was no artificial content editing.

The following obsolete assets were permanently deleted from the working tree:

- `public/images/caregiver/iris-recommendation.webp`
- `public/images/ui/login.webp`
- `public/images/ui/login-1400w.webp`

Their active references were removed. The current Unity login scene's enabled
`Canvas/BrandPanel/Banner/Label` and `auth.fyp_title` localization entry still
contain the old project title, so no truthful current replacement was captured.
The Guest tab now uses its existing text without an image; the Senior and
Caregiver tabs retain their genuine captures. The System section keeps the
genuine session result and uses its existing SATRIA explanation for feedback.

Result captures and the trailer are preserved as real gameplay evidence, not
relabelled as Gemini output. See `public/images/README.txt` for the inventory.

## Scope preserved

This is a presentation and metadata update. Hazard definitions, tier values,
timers, completion rules, scoring, fuzzy logic, result calculations, navigation,
3D house opening, video player and gallery behaviour are preserved. CSS changes
are limited to the third platform card, longer pipeline labels, small fallback
and privacy notes, and the Guest tab's text-only layout after the image cleanup,
using the existing theme and responsive breakpoints.

## Validation and remaining limits

- The production Vite build succeeds. Its existing absolute brand-mask warning
  is benign: `public/images/brand/mark-96.png` exists and resolves at runtime.
- All 18 existing SATRIA feature cases pass (HTTP responses are mocked).
- The homepage and project metadata return HTTP 200 with an in-memory test
  session. The normal local configuration cannot connect to its database
  (`SQLSTATE[HY000] [2002]`); the configured database must be running for preview.
- Static React rendering succeeds with three platform cards and six accessible
  pipeline tabs. Active rendered/CSS asset references and gallery paths exist;
  the removed assets have no active image or zoom references.
- CSS breakpoint checks cover 320, 390, 768, 1024, 1280 and 1920 pixels. No browser
  connection was available, so visual layout, keyboard interaction, playback and
  browser console checks remain unverified.
- The existing contact feature test fails: it expects a database insert, while
  the existing controller sends email and the test has no email configuration.
  The contact controller, test and configuration were not changed.

The final image cleanup reran the production build, PHP syntax checks and all
18 SATRIA cases (47 assertions). Video files, DemoReel and the required Gemini
application files were checked against their pre-cleanup SHA-256 hashes. No
commit, staging operation or push was performed. `.env` and credentials remain
excluded; the server continues to read Gemini configuration from environment
variables.

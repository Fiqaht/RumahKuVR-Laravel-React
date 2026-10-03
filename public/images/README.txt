Image inventory
===============

Every gameplay, UI and caregiver image on this site is captured from the Unity
6.3 build at C:\UnityProjects\FYP_HomeSafety_Kampung (the earlier source PNGs
are in Captures/web2026), cropped, downscaled to roughly 2x its largest rendered size
and encoded as WebP. Nothing is repainted.

The 2026-09-27 set comes from Controller Mode play as the qp account. Result,
menu and caregiver screens show the three recorded sessions: Mudah 100/100,
Sederhana 100/100 and a timed-out Sukar run at 18/100. In-game frames are from
repeat play-throughs the same day, left unfinished so no extra records were
written. Game View grabs are 3840x2160, taken with the in-game Tunjuk FPS
setting switched off; menu, result and portal panels are straight-on renders
of the UI layer only.

Deliberately not used, because the current build shows contradictory data on
them: caregiver Rekod Sesi and Makluman (stale tier and status labels),
Prestasi Tahap (an empty-state footer under a populated table) and Trend
Prestasi (no stored analysis, so no trend exists to show).

  project/    hero capture
  gameplay/   in-engine hazard and session captures
  ui/         in-headset interface screens
  caregiver/  caregiver portal screens
  platform/   in-app controller guides
  brand/      logo mark, used as a CSS mask so it inherits the theme colour

meta-quest-3-real.webp is the one third-party image on the site.
See DEVICE-CREDITS.md.

No stock photography and no placeholder art is served from this directory.
Logo master files live outside the web root, in resources/brand/.

Tablet Touch Mode
-----------------
No real Tablet Mode capture is present. The platform card uses a labelled text
overview, not a gameplay image. When a genuine Android landscape capture is
available, add platform/tablet-touch.webp and platform/tablet-touch-1400w.webp,
then replace the text overview with an accessible image/zoom trigger. Do not
relabel VR/controller captures or generate substitute gameplay screenshots.

Current mode-selection capture
------------------------------
ui/mode-select.webp (3840x2160) and ui/mode-select-1400w.webp (1400x788) now come
from Captures/website_mode_select_three_modes_2026-10-03.png in the Unity project.
Unity MCP captured the actual Game View in Edit Mode on XR_ModeSelectScene with
Mod VR, Mod Kawalan and Mod Tablet / Skrin Sentuh visibly present. The full frame
was encoded as WebP, with a resized responsive variant; no content was repainted
or added. No scene, source, gameplay, account or video changes were made.

Removed outdated captures
-------------------------
The old caregiver recommendation and both old login images were deleted. The
current login scene still displays the obsolete project title, so the Guest
role is presented through its existing text without a screenshot. SATRIA's
existing text explains caregiver feedback without the old recommendation image.

Result images and the existing trailer remain earlier gameplay evidence, not
proof of a Gemini-generated response. Replace them only with genuine captures.

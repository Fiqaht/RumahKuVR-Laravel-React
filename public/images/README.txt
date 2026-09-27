Image inventory
===============

Every gameplay, UI and caregiver image on this site is captured from the Unity
6.3 build at C:\UnityProjects\FYP_HomeSafety_Kampung (source PNGs in
Captures/web2026), cropped, downscaled to roughly 2x its largest rendered size
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

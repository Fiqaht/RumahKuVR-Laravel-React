# Brand source files

Master logo lockups (2172x724, transparent). These are **not** served — they live
outside `public/` on purpose so they are not deployed.

Everything the site actually uses is derived from `rumahkuvr-logo-white.png`:

| Output                          | Derivation |
|---------------------------------|------------|
| `public/images/brand/mark.png`  | crop 379x386 at (126,168), padded square, scaled to 256px |
| `public/images/favicon-32.png`  | mark at 28px on `#0E2A20` |
| `public/images/favicon-192.png` | mark at 148px on `#0E2A20` |
| `public/images/apple-touch-icon.png` | mark at 138px on `#0E2A20` |

`mark.png` is applied as a CSS mask painted with `var(--text)`, so one file
serves dark theme, light theme and both high-contrast modes.

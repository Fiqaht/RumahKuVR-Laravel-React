<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#08090b">

    <title>RumahKuVR — VR Home-Safety Training for Malaysian Seniors</title>
    <meta name="description" content="RumahKuVR is an AI-assisted virtual reality home-safety application that teaches Malaysian seniors to find and fix household hazards, built in Unity 6.3 for Meta Quest 3 and gamepad.">
    <meta name="author" content="Muhammad Thaqif Fahmi Bin Rafie'e">
    <link rel="canonical" href="https://rumahkuvr.app/">

    <meta property="og:title" content="RumahKuVR — VR Home-Safety Training for Malaysian Seniors">
    <meta property="og:description" content="Eighteen household hazards across three difficulty tiers. Built in Unity 6.3 for Meta Quest 3 and gamepad, with a caregiver reporting portal.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://rumahkuvr.app/">
    <meta property="og:image" content="https://rumahkuvr.app/images/project/hero-hazard-scan.webp">
    <meta property="og:image:width" content="1500">
    <meta property="og:image:height" content="844">
    <meta property="og:site_name" content="RumahKuVR">
    <meta property="og:locale" content="en_MY">
    <meta property="og:image:alt" content="First-person view inside RumahKuVR showing a kampung kitchen with three hazard markers and the session HUD">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="RumahKuVR — VR Home-Safety Training for Malaysian Seniors">
    <meta name="twitter:description" content="Eighteen household hazards across three difficulty tiers. Built in Unity 6.3 for Meta Quest 3 and gamepad.">
    <meta name="twitter:image" content="https://rumahkuvr.app/images/project/hero-hazard-scan.webp">

    {{-- Sized icons rather than one oversized lockup: browsers pick the closest
         match instead of downscaling a 2172px image into a 16px tab slot. --}}
    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32.png">
    <link rel="icon" type="image/png" sizes="192x192" href="/images/favicon-192.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    {{-- Loaded here rather than through @import in app.css. An @import cannot
         start until app.css has been fetched and parsed, which put the font
         request a whole round-trip behind; as a <link> it goes out with the
         rest of the head. --}}
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..700;1,9..40,400..700&family=Manrope:wght@400;500;600;700;800&display=swap">

    {{-- Must mirror the `sizes`/`srcset` on the hero <img> in app.jsx exactly,
         so the preload and the element resolve to the same candidate.

         Deliberately still the first fetch the document starts, ahead of the
         opening sequence. The intro is a gate the visitor opens by hand, so the
         hero capture has the whole length of the opening — and however long the
         visitor spends looking at the house — to arrive. By the time the
         curtain parts it is decoded and painted. --}}
    <link rel="preload" as="image"
          href="/images/project/hero-hazard-scan.webp"
          imagesrcset="/images/project/hero-hazard-scan-800w.webp 800w, /images/project/hero-hazard-scan.webp 1500w"
          imagesizes="(max-width: 720px) calc(100vw - 32px), (max-width: 1024px) 92vw, (min-width: 1400px) 600px, 52vw"
          fetchpriority="high">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    @viteReactRefresh
    <script>
        (function () {
            try {
                var stored = localStorage.getItem('rumahkuvr-theme');
                var theme = stored || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
                var root = document.documentElement;
                root.setAttribute('data-theme', theme);
                document.querySelector('meta[name="theme-color"]')
                    .setAttribute('content', theme === 'light' ? '#f6f7f9' : '#08090b');
                if (localStorage.getItem('rumahkuvr-contrast') === '1') root.classList.add('high-contrast');
                if (localStorage.getItem('rumahkuvr-large') === '1') root.classList.add('large-type');
            } catch (e) {
                document.documentElement.setAttribute('data-theme', 'dark');
            }
        })();
    </script>
    {{-- ======================================================================
         OPENING SEQUENCE — CRITICAL CSS

         Inlined rather than left to app.css so the stage, the brand and the
         house are painted by the very first frame without waiting on a
         stylesheet.

         The sequence is in two acts and the join between them is a person, not
         a timer:

           ACT I  — the brand resolves, parks at the top of the stage, and the
                    RumahKuVR house builds itself in the middle of it: a
                    miniature of House4, the house the VR application actually
                    puts the player inside, rebuilt from the prefab's own module
                    grid. Pure CSS on a delay ladder; it runs whether or not the
                    bundle has arrived. Measured from first paint: the mark
                    resolves by 520ms, the wordmark and its details by 860ms,
                    and the house is standing and clickable at 1100ms (720ms on
                    a phone). Pointing at it thins the walls and brings the plan
                    and its hazards up through them.

           ACT II — the visitor clicks the house. It comes apart for 260ms — the
                    roof lifts clear, the porch slides out, the scan runs the
                    volume — then the curtain parts from the centre outward
                    while the hero begins its own entrance in the same frame;
                    the stage is removed 820ms later. Clicking at the first
                    possible moment puts the whole opening at ~2.2s on a desktop
                    and ~1.4s on a phone, and there is no upper bound — the
                    stage will wait as long as somebody wants to look at the
                    house.

         Nothing here is a loading screen. The page underneath is fully rendered
         and its LCP capture was requested before this stylesheet was even read;
         Act II only uncovers what is already there.
         ====================================================================== --}}
    <style>
        .rkv-intro {
            position: fixed;
            inset: 0;
            z-index: 200;
            --rkv-stage: #08090b;
            --rkv-stage-deep: #030405;
            --rkv-ink: #f4f6f8;
            --rkv-line: rgba(228, 235, 242, 0.62);
            --rkv-line-soft: rgba(228, 235, 242, 0.26);
            --rkv-fill: rgba(228, 235, 242, 0.055);
            --rkv-accent: #dbe2ea;
            --rkv-glow: rgba(214, 224, 235, 0.32);
            /* Glass, and the light behind it. Both stay on the same silver as
               everything else — the stage is graphite end to end. */
            --rkv-win: rgba(232, 239, 246, 0.32);
            --rkv-lit: rgba(226, 236, 246, 0.15);
            /* The window rhythms, kept as properties so a face can pick one up
               with a single declaration. `bay1` is a window every 2.5 m module,
               `bay2` every second one — which is what House4 actually has down
               its flanks. Both put a 12px opening in the middle of the bay. */
            --rkv-bay1: repeating-linear-gradient(90deg, transparent 0 7px, var(--rkv-win) 7px 19px, transparent 19px 26px);
            --rkv-bay2: repeating-linear-gradient(90deg, transparent 0 33px, var(--rkv-win) 33px 45px, transparent 45px 52px);
        }

        /* The dialog takes focus so the sequence is announced and the house is
           the first Tab stop; it must not paint a ring around the viewport. */
        .rkv-intro:focus { outline: none; }

        [data-theme='light'] .rkv-intro {
            --rkv-stage: #f6f7f9;
            --rkv-stage-deep: #e8eaee;
            --rkv-ink: #0e1116;
            --rkv-line: rgba(20, 26, 34, 0.58);
            --rkv-line-soft: rgba(20, 26, 34, 0.22);
            --rkv-fill: rgba(20, 26, 34, 0.05);
            --rkv-accent: #3b4552;
            --rkv-glow: rgba(30, 38, 48, 0.18);
            --rkv-win: rgba(20, 26, 34, 0.22);
            --rkv-lit: rgba(24, 32, 42, 0.11);
        }

        /* The curtain. Tiles are flex: 1 so hiding every other one on a phone
           leaves six that still tile the viewport — and, because the hidden
           ones are the odd indices, the surviving --o values stay symmetric
           about the centre, so the centre-outward ordering survives too. */
        .rkv-intro-tiles {
            position: absolute;
            inset: 0;
            display: flex;
        }

        .rkv-tile {
            flex: 1;
            background: var(--rkv-stage);
            transform: translateY(0);
            /* Paused, and deliberately with no base delay: a paused animation
               pauses its delay countdown too, so the curtain cannot part until
               the visitor asks it to. What stays here is only the
               centre-outward stagger. */
            animation: rkvTileUp 0.58s cubic-bezier(0.72, 0, 0.24, 1) forwards paused;
            animation-delay: calc(var(--o) * 24ms);
        }

        .rkv-intro.is-opening .rkv-tile { animation-play-state: running; }

        @keyframes rkvTileUp {
            to { transform: translateY(-101%); }
        }

        /* A vignette over the tiles, so the stage has a centre. Purely a
           gradient — no blur, nothing for the compositor to rasterise. */
        .rkv-intro-veil {
            position: absolute;
            inset: 0;
            pointer-events: none;
            background:
                radial-gradient(120% 85% at 50% 46%, transparent 24%, var(--rkv-stage-deep) 100%);
            opacity: 0.9;
        }

        .rkv-intro.is-opening .rkv-intro-veil {
            animation: rkvVeilOut 0.34s linear forwards;
        }

        @keyframes rkvVeilOut { to { opacity: 0; } }

        .rkv-intro-inner {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0;
            padding: 24px;
        }

        /* ---------------------------------------------------------------
           BRAND LOCKUP
           Resolves in the centre, then parks above the house rather than
           cross-fading out — the composition rearranges itself instead of
           swapping one screen for another.
           --------------------------------------------------------------- */
        .rkv-intro-brand {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 13px;
            transform: translateY(calc(50% + 8vh));
            animation: rkvBrandPark 0.56s cubic-bezier(0.22, 1, 0.32, 1) 0.56s forwards;
        }

        @keyframes rkvBrandPark {
            to { transform: translateY(0) scale(0.86); }
        }

        /* The mark is revealed by the scan line rather than merely faded in:
           it is clipped to nothing and un-clips downward at exactly the rate
           the line travels. This is the site's signature motif — the Safety
           Scan — stated in the first half-second so everything that reuses it
           later reads as a callback. */
        .rkv-intro-mark {
            position: relative;
            width: 62px;
            height: 62px;
            background-color: var(--rkv-ink);
            -webkit-mask: url('/images/brand/mark-96.png') center / contain no-repeat;
            mask: url('/images/brand/mark-96.png') center / contain no-repeat;
            clip-path: inset(0 0 100% 0);
            animation: rkvMarkScan 0.46s cubic-bezier(0.16, 1, 0.3, 1) 0.06s forwards;
        }

        @keyframes rkvMarkScan {
            from { clip-path: inset(0 0 100% 0); }
            to { clip-path: inset(0 0 0 0); }
        }

        .rkv-intro-mark-wrap {
            position: relative;
            display: grid;
            place-items: center;
        }

        /* The travelling line itself, plus the bloom it leaves behind. */
        .rkv-intro-scan {
            position: absolute;
            left: -12px;
            right: -12px;
            top: 0;
            height: 2px;
            border-radius: 2px;
            background: linear-gradient(90deg, transparent, var(--rkv-accent), transparent);
            box-shadow: 0 0 14px 2px var(--rkv-glow);
            opacity: 0;
            animation: rkvScanTravel 0.46s cubic-bezier(0.16, 1, 0.3, 1) 0.06s forwards;
        }

        @keyframes rkvScanTravel {
            0% { transform: translateY(0); opacity: 0; }
            18% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translateY(62px); opacity: 0; }
        }

        .rkv-intro-bloom {
            position: absolute;
            top: 50%;
            left: 50%;
            margin: -95px 0 0 -95px;
            width: 190px;
            height: 190px;
            border-radius: 50%;
            background: radial-gradient(circle, var(--rkv-glow), transparent 68%);
            opacity: 0;
            animation: rkvBloom 0.78s cubic-bezier(0.4, 0, 0.2, 1) 0.12s forwards;
        }

        @keyframes rkvBloom {
            0% { opacity: 0; transform: scale(0.72); }
            45% { opacity: 1; }
            100% { opacity: 0.3; transform: scale(1); }
        }

        /* Per-character resolve. The characters hold their final layout from
           the first frame — only blur and opacity move — so the wordmark
           sharpens into place instead of shifting into it. */
        .rkv-intro-word {
            display: flex;
            font-family: 'Manrope', system-ui, sans-serif;
            font-weight: 700;
            font-size: 1.45rem;
            letter-spacing: 0.16em;
            text-indent: 0.16em;
            color: var(--rkv-ink);
        }

        .rkv-intro-word i {
            font-style: normal;
            opacity: 0;
            filter: blur(10px);
            transform: translateY(6px);
            animation: rkvCharIn 0.34s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            animation-delay: calc(300ms + var(--i) * 26ms);
        }

        @keyframes rkvCharIn {
            to { opacity: 1; filter: blur(0); transform: none; }
        }

        .rkv-intro-rule {
            width: 132px;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--rkv-line), transparent);
            transform: scaleX(0);
            animation: rkvRule 0.36s cubic-bezier(0.16, 1, 0.3, 1) 0.48s forwards;
        }

        @keyframes rkvRule { to { transform: scaleX(1); } }

        .rkv-intro-sub {
            font-family: 'DM Sans', system-ui, sans-serif;
            font-size: 0.6875rem;
            letter-spacing: 0.24em;
            text-transform: uppercase;
            color: var(--rkv-ink);
            opacity: 0;
            animation: rkvSubIn 0.30s cubic-bezier(0.16, 1, 0.3, 1) 0.56s forwards;
        }

        @keyframes rkvSubIn { to { opacity: 0.55; } }

        /* ---------------------------------------------------------------
           THE HOUSE

           A real volume, not a picture of one: six translucent planes and two
           roof slopes in CSS 3D, standing on a floor plate that carries the
           same plan-and-markers language as Peta Bahaya in the app. The
           hazards glow through the walls, which is the whole product in one
           object — a home, seen through, with the risks in it lit up.

           Built from transforms and gradients only. No canvas, no WebGL, no
           library: the entire scene is a few hundred bytes of markup that the
           compositor animates, so it costs nothing on the main thread and it
           is on screen in the first frame like the rest of this stylesheet.
           --------------------------------------------------------------- */
        .rkv-sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            margin: -1px;
            padding: 0;
            overflow: hidden;
            clip: rect(0 0 0 0);
            clip-path: inset(50%);
            white-space: nowrap;
            border: 0;
        }

        /* WHERE OPACITY IS ALLOWED TO LIVE.

           Every element in the 3D chain below — scene, lean, orbit, house —
           carries transforms and nothing else. Chrome treats an element with a
           running or filling opacity animation as though it had
           `will-change: opacity`, which forces `transform-style` to compute to
           `flat`: the whole volume collapses into a single plane for as long
           as the animation exists, fill included. So all fading, in and out,
           is done here on the button, which sits outside the perspective
           element and cannot flatten anything. */
        .rkv-house-btn {
            appearance: none;
            -webkit-appearance: none;
            background: none;
            border: 0;
            padding: 0;
            margin: 30px 0 0;
            color: inherit;
            font: inherit;
            cursor: pointer;
            /* Not clickable until Act I has finished building it. */
            pointer-events: none;
            display: block;
            position: relative;
            opacity: 0;
            animation: rkvHouseFade 0.52s cubic-bezier(0.18, 1, 0.28, 1) 0.56s forwards;
        }

        @keyframes rkvHouseFade { to { opacity: 1; } }

        .rkv-intro.is-live .rkv-house-btn { pointer-events: auto; }

        .rkv-house-btn:focus { outline: none; }

        .rkv-house-scene {
            display: block;
            width: 340px;
            height: 264px;
            perspective: 860px;
            perspective-origin: 50% 44%;
        }

        /* Two nested transforms so the idle turntable and the pointer lean can
           coexist without either overwriting the other's `transform`. */
        .rkv-house-lean {
            position: relative;
            display: block;
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
            transform: rotateX(calc(-23deg + var(--rkv-py, 0) * 5deg)) rotateY(calc(var(--rkv-px, 0) * 11deg));
            transition: transform 0.5s cubic-bezier(0.22, 1, 0.32, 1);
        }

        /* A slow drift rather than a turntable. The volume never comes fully
           front-on — a house seen square is a rectangle — so the swing stays
           inside a three-quarter view the whole way through.

           It swings negative, which puts the eastern flank toward the viewer
           and keeps the door on the near half of the frontage: the thing you
           are being asked to click should not be the part that is furthest
           away and most foreshortened. */
        .rkv-house-orbit {
            position: absolute;
            inset: 0;
            transform-style: preserve-3d;
            animation: rkvOrbit 30s ease-in-out infinite;
            animation-play-state: paused;
            transform: rotateY(-22deg);
        }

        .rkv-intro.is-live .rkv-house-orbit { animation-play-state: running; }

        @keyframes rkvOrbit {
            from { transform: rotateY(-22deg); }
            50% { transform: rotateY(-44deg); }
            to { transform: rotateY(-22deg); }
        }

        .rkv-house {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 0;
            height: 0;
            transform-style: preserve-3d;
            /* Whole volume rises into place as one object. Transform only —
               see the note on .rkv-house-btn for why the fade cannot be here.

               The resting 26px is not padding: the model's origin is its
               ground plane, and under the stage's -23° tilt the mass sits
               that far above the origin on screen. Dropping it by 35 puts the
               house in the middle of the frame rather than the yard.

               The 1.18 is the model earning its stage: House4's plan is 15 by
               17.5 metres, so at one cell to 26px it projects about 210px
               wide into a 340px scene and reads as a specimen in a large
               case. The scale lives here rather than on .rkv-house-lean
               because the lean's `scale` property is what the ignition
               animates, and a keyframe would overwrite it. */
            transform: translateY(65px) scale(1.062);
            animation: rkvHouseRise 0.54s cubic-bezier(0.18, 1, 0.28, 1) 0.56s forwards;
        }

        @keyframes rkvHouseRise {
            to { transform: translateY(35px) scale(1.18); }
        }

        /* ==================================================================
           THE HOUSE — a miniature of the RumahKuVR house, not a house shape

           This is House4 from the project's ModularHousePack — `Houses/
           House4 (1)` in XR_MainScene, the one the player is actually stood
           inside — rebuilt from the module placements in the prefab rather
           than drawn by eye. Nothing is exported: the pack builds on a 2.5 m
           grid, so the whole thing is re-laid on that grid at 26px a cell and
           the silhouette comes out on its own.

           The plan is six cells across (15 m) by seven deep (17.5 m) and a
           storey is one cell (2.5 m). Every number below is one of these:

             cell x   0     1     2     3     4     5     6
             px     -78   -52   -26     0    26    52    78

             cell z   0     1     2     3     4     5     6     7
             px      91    65    39    13   -13   -39   -65   -91

           +z is toward the viewer, and that is the front — the elevation the
           door is on. Up is negative y; the ground is y = 0.

           What makes this House4 rather than a house in general:

             · a two-storey block standing on rows 1–7, and in front of it a
               single-storey wing one cell deep across the whole frontage —
               the massing you read from the street, a low porch with the
               block rising behind it;
             · a slot cut clean through both at column 2, one cell wide and
               two deep, open to the sky. The prefab leaves that cell out of
               *both* floor decks and puts no roof over it: it is the corridor
               bay, and it is the one feature nobody else's house has;
             · a truncated hip roof — a one-cell slope falling away on all
               four sides from a flat four-by-four deck. RoofA and RoofB
               around the edge, RoofFlat in the middle, and the reason the
               house reads as itself from a distance;
             · a mono-pitch canopy over the front wing, stopping well below
               the block's eaves so a band of the upper storey shows above it;
             · windows every second bay down both long flanks on both floors,
               staggered between them, and a front elevation that is blank
               apart from the door.

           The two vertical faces at x = -26 and x = 0 are not scenery: they
           are the real corridor walls, the ones the plan on the floor plate
           is drawn against.
           ================================================================== */

        /* Two knobs the whole model is lit by, so hover and the opening can
           move every surface at once without touching a single transform.
           `--solid` is how present the walls are; `--plan` is how present
           everything underneath them is. Faces resolve their own opacity
           against them, and transition the *result* — a custom property
           cannot be interpolated, but the opacity computed from one can. */
        .rkv-house { --solid: 1; --plan: 0.62; }

        /* No border by default. A hairline on all six sides of nineteen
           abutting faces is a wire cage, not a house: every shared edge gets
           drawn twice and the model reads as a stack of glass trays. The
           edges are put back below, and only on the surfaces whose outline is
           actually doing work — the two the light is on, and the lid. */
        .rkv-face {
            position: absolute;
            background-color: var(--rkv-fill);
            background-repeat: repeat-x;
            border: 0;
            box-sizing: border-box;
            opacity: calc(var(--f, 1) * var(--solid));
            transition: opacity 0.45s cubic-bezier(0.22, 1, 0.32, 1);
        }

        /* Groups, so the roof can lift and the porch can part without every
           face needing its own copy of the move. Transform only: an opacity
           animation on a preserve-3d node collapses it (see .rkv-house-btn). */
        .rkv-mass, .rkv-porch, .rkv-roof {
            position: absolute;
            transform-style: preserve-3d;
        }

        /* ---- lighting by alpha ----

           There is no light source. The orbit only ever shows the front and
           the east flank, so those two carry the most fill and everything
           the viewer is looking through recedes behind them. Cheap, and it
           reads as a solid with a lit side rather than as a net. */
        .rkv-f-front  { --f: 1;    border: 1px solid var(--rkv-line); }
        .rkv-f-east   { --f: 0.9;  border: 1px solid var(--rkv-line-soft); }
        /* The ceilings are here for the moment the roof comes off, not for the
           resting state: under a translucent roof a lit lid at full strength
           is just a second roof drawn 20px lower. */
        .rkv-f-top    { --f: 0.34; }
        /* The far half of the model: fill only. It is there so the volume has
           a back to be seen through, not so it can be traced. */
        .rkv-f-west   { --f: 0.44; }
        .rkv-f-back   { --f: 0.3; }
        .rkv-f-inner  { --f: 0.26; }
        /* The wall at the back of the entrance slot. It faces the street, but
           from two cells inside it, and lighting it like the rest of the
           frontage turns the recess into a tower. */
        .rkv-f-recess { --f: 0.4; }

        /* ---- windows ----

           Drawn into the faces as background layers rather than as elements:
           twenty-odd more nodes for something the eye reads as a rhythm.
           One bay is 2.5 m, and House4 puts a window in every second bay —
           52px — with the two floors half a bay out of step. */
        .rkv-flank {
            background-image: var(--rkv-bay2), var(--rkv-bay2);
            background-size: 100% 11px;
            background-position: 26px 7px, 0 33px;
        }

        /* The front of the block above the canopy: upper floor only, which is
           what the elevation actually has. */
        .rkv-upperwin {
            background-image: var(--rkv-bay2);
            background-size: 100% 11px;
            background-position: 13px 7px;
        }

        /* The back elevation carries a finer rhythm — three windows a floor
           across a wall that is mostly seen through two others. */
        .rkv-rearwin {
            background-image: var(--rkv-bay1), var(--rkv-bay1);
            background-size: 100% 10px;
            background-position: 0 8px, 13px 34px;
        }

        /* ---- the two-storey block: west of the corridor ----
           cells x 0–2, z 1–7. 52 wide, 156 deep, 52 tall. */
        .rkv-wb-front { width: 52px;  height: 52px;  margin: -26px 0 0 -26px; transform: translate3d(-52px, -26px, 65px); }
        .rkv-wb-back  { width: 52px;  height: 52px;  margin: -26px 0 0 -26px; transform: translate3d(-52px, -26px, -91px) rotateY(180deg); }
        .rkv-wb-west  { width: 156px; height: 52px;  margin: -26px 0 0 -78px; transform: translate3d(-78px, -26px, -13px) rotateY(-90deg); }
        .rkv-wb-inner { width: 156px; height: 52px;  margin: -26px 0 0 -78px; transform: translate3d(-26px, -26px, -13px) rotateY(90deg); }
        .rkv-wb-top   { width: 52px;  height: 156px; margin: -78px 0 0 -26px; transform: translate3d(-52px, -52px, -13px) rotateX(90deg); }

        /* ---- the corridor bay itself ----
           cells x 2–3, z 2–7. Its side walls are the two faces above and
           below it, so it only needs a front, a back and a lid. */
        .rkv-cb-front { width: 26px;  height: 52px;  margin: -26px 0 0 -13px; transform: translate3d(-13px, -26px, 39px); }
        .rkv-cb-back  { width: 26px;  height: 52px;  margin: -26px 0 0 -13px; transform: translate3d(-13px, -26px, -91px) rotateY(180deg); }
        .rkv-cb-top   { width: 26px;  height: 130px; margin: -65px 0 0 -13px; transform: translate3d(-13px, -52px, -26px) rotateX(90deg); }

        /* ---- the two-storey block: east of the corridor ----
           cells x 3–6, z 1–7. The bathroom, the stair and the kitchen. */
        .rkv-eb-front { width: 78px;  height: 52px;  margin: -26px 0 0 -39px; transform: translate3d(39px, -26px, 65px); }
        .rkv-eb-back  { width: 78px;  height: 52px;  margin: -26px 0 0 -39px; transform: translate3d(39px, -26px, -91px) rotateY(180deg); }
        .rkv-eb-inner { width: 156px; height: 52px;  margin: -26px 0 0 -78px; transform: translate3d(0, -26px, -13px) rotateY(-90deg); }
        .rkv-eb-east  { width: 156px; height: 52px;  margin: -26px 0 0 -78px; transform: translate3d(78px, -26px, -13px) rotateY(90deg); }
        .rkv-eb-top   { width: 78px;  height: 156px; margin: -78px 0 0 -39px; transform: translate3d(39px, -52px, -13px) rotateX(90deg); }

        /* ---- the single-storey front wing ----
           cells z 0–1, split either side of the slot. Half the height of the
           block behind it, which is the whole point of it. */
        .rkv-pw-front { width: 52px; height: 26px; margin: -13px 0 0 -26px; transform: translate3d(-52px, -13px, 91px); }
        .rkv-pw-west  { width: 26px; height: 26px; margin: -13px 0 0 -13px; transform: translate3d(-78px, -13px, 78px) rotateY(-90deg); }
        .rkv-pw-inner { width: 26px; height: 26px; margin: -13px 0 0 -13px; transform: translate3d(-26px, -13px, 78px) rotateY(90deg); }

        .rkv-pe-front { width: 78px; height: 26px; margin: -13px 0 0 -39px; transform: translate3d(39px, -13px, 91px); }
        .rkv-pe-inner { width: 26px; height: 26px; margin: -13px 0 0 -13px; transform: translate3d(0, -13px, 78px) rotateY(-90deg); }
        .rkv-pe-east  { width: 26px; height: 26px; margin: -13px 0 0 -13px; transform: translate3d(78px, -13px, 78px) rotateY(90deg); }

        /* ---- the door ----
           House4 puts its entrance on the front wing at cell x 4.5, which is
           dead centre of the eastern half of the frontage. It is drawn inside
           the face rather than beside it, so it cannot drift off the wall. */
        .rkv-door {
            position: absolute;
            left: 50%;
            bottom: 0;
            width: 13px;
            height: 20px;
            margin-left: -6.5px;
            border: 1px solid var(--rkv-accent);
            border-bottom: 0;
            border-radius: 1px 1px 0 0;
            /* Lit from inside and brightest at the threshold. It is the one
               opening on the model that is meant to be read as a way in, so
               it is the only one that glows rather than merely being cut. */
            background: linear-gradient(0deg, var(--rkv-accent), var(--rkv-glow) 46%, transparent);
            box-shadow: 0 0 9px 1px var(--rkv-glow);
            opacity: calc(0.6 + 0.4 * var(--plan));
            transition: opacity 0.45s cubic-bezier(0.22, 1, 0.32, 1);
        }

        /* One window beside the door, and one on the western half — the only
           two openings the front wing has. */
        .rkv-pwin {
            position: absolute;
            top: 7px;
            width: 12px;
            height: 11px;
            background: var(--rkv-win);
        }

        .rkv-pe-front .rkv-pwin { right: 13px; }
        .rkv-pw-front .rkv-pwin { left: 20px; }

        /* ---- the roof ----

           A one-cell slope on all four sides falling from a four-by-four flat
           deck: 14px of rise over 26px of run is a 28.3° pitch, so each slope
           is 29.5px on the slant and sits at 61.7° off the horizontal. The
           clip cuts the hips — 26px, exactly one cell, off each top corner. */
        .rkv-slope {
            position: absolute;
            height: 32.8px;
            margin: -16.4px 0 0 0;
            clip-path: polygon(0 100%, 100% 100%, calc(100% - 26px) 0, 26px 0);
            /* The hips are cut by the clip, so they get no border and the
               silhouette has to come out of the fill itself — hence a good
               deal more of it here than the walls carry. It brightens toward
               the bottom, which is the eave: the edge of a roof is the part
               that catches light, and it is also the line that has to survive
               at 150px wide. The two borders that the clip *does* leave whole
               are the eave and the deck edge, and both are wanted. */
            background: linear-gradient(180deg, rgba(226, 233, 240, 0.075) 0 46%, rgba(226, 233, 240, 0.26));
            border: 1px solid var(--rkv-line-soft);
            border-bottom-color: var(--rkv-line);
        }

        [data-theme='light'] .rkv-slope,
        [data-theme='light'] .rkv-canopy {
            background: linear-gradient(180deg, rgba(20, 26, 34, 0.065) 0 46%, rgba(20, 26, 34, 0.22));
        }

        /* The front slope is in two pieces because the slot runs up through
           it: the prefab has no roof module over that cell at all. */
        .rkv-rf-fw   { width: 52px;  margin-left: -26px; clip-path: polygon(0 100%, 100% 100%, 100% 0, 26px 0);            transform: translate3d(-52px, -62px, 52px) rotateX(52.4deg); --f: 1; }
        .rkv-rf-fe   { width: 78px;  margin-left: -39px; clip-path: polygon(0 100%, 100% 100%, calc(100% - 26px) 0, 0 0);  transform: translate3d(39px, -62px, 52px) rotateX(52.4deg);  --f: 1; }
        .rkv-rf-back { width: 156px; margin-left: -78px; transform: translate3d(0, -62px, -78px) rotateX(-52.4deg); --f: 0.42; }
        .rkv-rf-west { width: 156px; margin-left: -78px; transform: translate3d(-65px, -62px, -13px) rotateY(-90deg) rotateX(52.4deg); --f: 0.5; }
        .rkv-rf-east { width: 156px; margin-left: -78px; transform: translate3d(65px, -62px, -13px) rotateY(90deg) rotateX(52.4deg); --f: 0.88; }

        /* The flat deck. Cells x 1–5 by z 2–6 — a real roof terrace, and the
           reason the silhouette has a shoulder instead of a ridge. */
        .rkv-rf-deck {
            width: 104px;
            height: 104px;
            margin: -52px 0 0 -52px;
            transform: translate3d(0, -72px, -13px) rotateX(90deg);
            background:
                radial-gradient(72% 72% at 50% 44%, rgba(226, 236, 246, 0.11), transparent 76%),
                var(--rkv-fill);
            --f: 0.82;
        }

        [data-theme='light'] .rkv-rf-deck {
            background:
                radial-gradient(72% 72% at 50% 44%, rgba(20, 26, 34, 0.09), transparent 76%),
                var(--rkv-fill);
        }

        /* The canopy over the front wing: a single fall toward the street,
           10px over 26px — 21°, shallower than the block above it, which is
           how the two roofs read as two roofs. */
        .rkv-canopy {
            position: absolute;
            height: 29.1px;
            margin: -14.55px 0 0 0;
            background: linear-gradient(180deg, rgba(226, 233, 240, 0.08) 0 44%, rgba(226, 233, 240, 0.3));
            border: 1px solid var(--rkv-line-soft);
            border-bottom-color: var(--rkv-line);
            --f: 1;
        }

        .rkv-cn-west { width: 52px; margin-left: -26px; clip-path: polygon(0 100%, 100% 100%, 100% 0, 10px 0);           transform: translate3d(-52px, -32.5px, 78px) rotateX(63.4deg); }
        .rkv-cn-east { width: 78px; margin-left: -39px; clip-path: polygon(0 100%, 100% 100%, calc(100% - 10px) 0, 0 0); transform: translate3d(39px, -32.5px, 78px) rotateX(63.4deg); }

        /* ---- soft light inside ----

           The first-floor slab, carrying nothing but a gradient. It is what
           stops the translucent walls from reading as an empty shell: there
           is a lit plane halfway up the volume, so the house has an inside. */
        .rkv-lightpad {
            position: absolute;
            width: 156px;
            height: 156px;
            margin: -78px 0 0 -78px;
            transform: translate3d(0, -26px, -13px) rotateX(90deg);
            background: radial-gradient(66% 66% at 46% 52%, var(--rkv-lit), transparent 78%);
            /* The hairline is not decoration: it is the only thing that says
               there are two floors in here rather than one tall room, and
               House4 is emphatically two floors. */
            border: 1px solid var(--rkv-line-soft);
            box-sizing: border-box;
            opacity: calc(0.55 + 0.45 * var(--plan));
            transition: opacity 0.45s cubic-bezier(0.22, 1, 0.32, 1);
            pointer-events: none;
        }

        /* ---- floor plate: the real plan, and the real hazards on it ---- */
        .rkv-plate {
            position: absolute;
            width: 180px;
            height: 206px;
            margin: -103px 0 0 -90px;
            transform: rotateX(90deg);
            /* Deliberately flat: the grid, the partitions and the hazard pins
               all belong in the plate's own plane, and leaving it flat means
               their fade-ins cannot flatten anything above them. */
            background: radial-gradient(74% 74% at 50% 50%, rgba(226, 233, 240, 0.075), transparent 74%);
            border-radius: 2px;
        }

        [data-theme='light'] .rkv-plate {
            background: radial-gradient(74% 74% at 50% 50%, rgba(20, 26, 34, 0.06), transparent 74%);
        }

        /* 26px squares — one module of the pack, so the plate is the same
           graph paper the house was built on. */
        .rkv-plate-grid {
            position: absolute;
            inset: 0;
            background-image:
                repeating-linear-gradient(90deg, var(--rkv-line-soft) 0 1px, transparent 1px 26px),
                repeating-linear-gradient(0deg, var(--rkv-line-soft) 0 1px, transparent 1px 26px);
            background-position: 12px 12px;
            opacity: calc(0.34 * var(--plan));
            transition: opacity 0.45s cubic-bezier(0.22, 1, 0.32, 1);
            -webkit-mask: radial-gradient(58% 58% at 50% 50%, #000 20%, transparent 76%);
            mask: radial-gradient(58% 58% at 50% 50%, #000 20%, transparent 76%);
        }

        /* The footprint, and inside it the ground-floor partitions — every
           one of them a wall module from the prefab, converted the same way
           the volume above was. Left/top are measured from the plate's own
           corner, which sits one cell outside the house on every side. */
        .rkv-plan i, .rkv-plan b {
            position: absolute;
            background: var(--rkv-line);
            opacity: calc(var(--plan) + 0.2);
            transition: opacity 0.45s cubic-bezier(0.22, 1, 0.32, 1);
        }

        .rkv-plan b {
            left: 12px;
            top: 12px;
            width: 156px;
            height: 182px;
            background: none;
            border: 1px solid var(--rkv-line);
            box-sizing: border-box;
        }

        /* cross wall at z 6.25 — living room / corridor, doors at x 5 and 10 */
        .rkv-plan i:nth-of-type(1) { left: 12px;  top: 142px; width: 104px; height: 1px; }
        /* the corridor's west wall, x 6.25, running z 6.25 → 16.25 */
        .rkv-plan i:nth-of-type(2) { left: 64px;  top: 38px;  width: 1px;   height: 104px; }
        /* x 11.25, front segment — the bathroom's west wall */
        .rkv-plan i:nth-of-type(3) { left: 116px; top: 155px; width: 1px;   height: 26px; }
        /* x 11.25, rear segment */
        .rkv-plan i:nth-of-type(4) { left: 116px; top: 38px;  width: 1px;   height: 39px; }
        /* cross wall at z 11.25 */
        .rkv-plan i:nth-of-type(5) { left: 64px;  top: 90px;  width: 78px;  height: 1px; }
        /* x 13.75, the east rooms */
        .rkv-plan i:nth-of-type(6) { left: 142px; top: 64px;  width: 1px;   height: 52px; }
        /* cross wall at z 16.25 — the kitchen's south wall */
        .rkv-plan i:nth-of-type(7) { left: 64px;  top: 38px;  width: 52px;  height: 1px; }
        /* cross wall at z 13.75, west and east segments */
        .rkv-plan i:nth-of-type(8) { left: 12px;  top: 64px;  width: 26px;  height: 1px; }
        .rkv-plan i:nth-of-type(9) { left: 142px; top: 64px;  width: 26px;  height: 1px; }
        /* z 3.75 — the bathroom's north wall */
        .rkv-plan i:nth-of-type(10){ left: 116px; top: 168px; width: 52px;  height: 1px; }

        /* Hazard markers, straight out of Peta Bahaya — and these are the
           actual ones: the wet bathroom floor, the folded rug in the living
           room, the exposed cable in the corridor, the medicine on the east
           side, the gas ring in the kitchen and the slippers at the door,
           each at its own coordinate in XR_MainScene converted onto the
           plate. They pulse in sequence, so the volume above them reads as a
           home with something wrong in it rather than as geometry. */
        .rkv-pin {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 9px;
            height: 9px;
            margin: -4.5px 0 0 -4.5px;
            border-radius: 50%;
            background: var(--rkv-accent);
            box-shadow: 0 0 10px 2px var(--rkv-glow);
            translate: var(--x) var(--z);
            scale: calc(0.72 + 0.42 * var(--plan));
            opacity: 0;
            transition: scale 0.45s cubic-bezier(0.22, 1, 0.32, 1);
            animation: rkvPinIn 0.42s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            animation-delay: calc(860ms + var(--n) * 80ms);
        }

        @keyframes rkvPinIn { to { opacity: 1; } }

        .rkv-pin::after {
            content: '';
            position: absolute;
            inset: -3px;
            border-radius: 50%;
            border: 1px solid var(--rkv-accent);
            opacity: 0;
            animation: rkvPinPing 3.4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
            animation-delay: calc(1400ms + var(--n) * 420ms);
        }

        @keyframes rkvPinPing {
            0% { transform: scale(1); opacity: 0.85; }
            26% { transform: scale(2.6); opacity: 0; }
            100% { transform: scale(2.6); opacity: 0; }
        }

        /* ---- the Safety Scan, restated on the volume ----

           A horizontal plane, not a line: it rises through the house from the
           apron to the roof deck, and because it is a real plane in the same
           3D space it stays legible from every angle of the turntable instead
           of going edge-on. Same motif as the line that draws the mark, one
           dimension up. */
        .rkv-scanplane {
            position: absolute;
            width: 184px;
            height: 210px;
            margin: -105px 0 0 -92px;
            border: 1px solid var(--rkv-accent);
            border-radius: 2px;
            background: radial-gradient(62% 62% at 50% 50%, var(--rkv-glow), transparent 74%);
            box-shadow: 0 0 22px 1px var(--rkv-glow);
            opacity: 0;
            animation: rkvVolumeScan 1.05s cubic-bezier(0.16, 1, 0.3, 1) 0.62s forwards;
        }

        @keyframes rkvVolumeScan {
            0% { transform: translate3d(0, 8px, 0) rotateX(90deg); opacity: 0; }
            16% { opacity: 0.8; }
            76% { opacity: 0.8; }
            100% { transform: translate3d(0, -96px, 0) rotateX(90deg); opacity: 0; }
        }

        /* Hover / focus: the volume lifts a little, and — the part that
           matters — the walls give way. `--solid` drops, so every face thins
           at once, and `--plan` rises, so the plan, the partitions, the light
           on the first-floor slab and the six hazard pins come forward
           through them. You are not looking at a house that has brightened;
           you are looking into one. Nothing bounces and nothing spins faster.

           Both knobs live on .rkv-house, so this is two declarations for
           forty-odd surfaces and no transform is touched. */
        .rkv-house-btn:hover .rkv-house-lean,
        .rkv-house-btn:focus-visible .rkv-house-lean {
            transform: rotateX(calc(-23deg + var(--rkv-py, 0) * 5deg)) rotateY(calc(var(--rkv-px, 0) * 11deg)) translateY(-8px) scale(1.035);
        }

        .rkv-house-btn:hover .rkv-house,
        .rkv-house-btn:focus-visible .rkv-house {
            --solid: 0.5;
            --plan: 1;
        }

        .rkv-house-btn:hover .rkv-face,
        .rkv-house-btn:focus-visible .rkv-face,
        .rkv-house-btn:hover .rkv-plate,
        .rkv-house-btn:focus-visible .rkv-plate {
            border-color: var(--rkv-accent);
        }

        .rkv-house-btn:focus-visible .rkv-house-scene {
            border-radius: 18px;
            outline: 1px solid var(--rkv-line);
            outline-offset: 6px;
        }

        /* A ground shadow so the house is standing on the stage rather than
           floating over it. Anchored to the button rather than the stage, so
           it tracks the volume at every breakpoint. */
        .rkv-house-shadow {
            position: absolute;
            left: 50%;
            bottom: 80px;
            width: 248px;
            height: 38px;
            margin-left: -124px;
            border-radius: 50%;
            background: radial-gradient(closest-side, var(--rkv-glow), transparent 78%);
            /* The button owns the entrance fade for everything inside it, so
               the shadow only carries its own resting level and hover step. */
            opacity: 0.45;
            transition: opacity 0.5s cubic-bezier(0.22, 1, 0.32, 1);
            pointer-events: none;
        }

        .rkv-house-btn:hover .rkv-house-shadow { opacity: 0.7; }

        /* ---- the invitation ---- */
        .rkv-intro-hint {
            margin: 6px 0 0;
            font-family: 'DM Sans', system-ui, sans-serif;
            font-size: 0.78125rem;
            letter-spacing: 0.02em;
            color: var(--rkv-ink);
            opacity: 0;
            transform: translateY(6px);
            text-align: center;
        }

        .rkv-intro.is-live .rkv-intro-hint {
            animation: rkvHintIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes rkvHintIn { to { opacity: 0.62; transform: none; } }

        .rkv-intro-hint b {
            font-weight: 600;
            color: var(--rkv-ink);
            border-bottom: 1px solid var(--rkv-line);
            padding-bottom: 1px;
        }

        /* Nudged when someone clicks the empty stage instead of the house —
           the answer to "I clicked and nothing happened". */
        .rkv-intro.is-nudging .rkv-intro-hint { animation: rkvNudge 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97); }
        .rkv-intro.is-nudging .rkv-house-lean { animation: rkvNudgeHouse 0.6s cubic-bezier(0.34, 1.3, 0.5, 1); }

        @keyframes rkvNudge {
            0%, 100% { opacity: 0.62; }
            40% { opacity: 1; }
        }

        @keyframes rkvNudgeHouse {
            0%, 100% { scale: 1; }
            36% { scale: 1.05; }
        }

        /* The fallback. Appears only for someone who has not taken the hint,
           and says the same thing in a shape nobody can misread. */
        .rkv-intro-cta {
            appearance: none;
            -webkit-appearance: none;
            margin: 20px 0 0;
            padding: 10px 20px;
            font-family: 'Manrope', system-ui, sans-serif;
            font-size: 0.78125rem;
            font-weight: 600;
            letter-spacing: 0.01em;
            color: var(--rkv-ink);
            background: transparent;
            border: 1px solid var(--rkv-line);
            border-radius: 9999px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transform: translateY(8px);
            transition:
                opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                background-color 0.25s ease,
                border-color 0.25s ease,
                visibility 0s linear 0.6s;
        }

        .rkv-intro.is-patient .rkv-intro-cta {
            opacity: 1;
            visibility: visible;
            transform: none;
            transition-delay: 0s, 0s, 0s, 0s, 0s;
        }

        .rkv-intro-cta:hover {
            background: var(--rkv-fill);
            border-color: var(--rkv-accent);
        }

        /* ---- Act II: ignition and exit ----

           Split across two elements on purpose: the volume swells on the
           preserve-3d node, and the fade that carries it away happens on the
           button outside the 3D chain. Putting both on one element would
           flatten the house at exactly the moment it is most visible. */
        .rkv-intro.is-entering .rkv-house-lean {
            animation: rkvIgnite 0.78s cubic-bezier(0.3, 0, 0.2, 1) forwards;
        }

        /* The swell and the push are separate properties on purpose: `scale`
           magnifies the model, `translate`'s z-component moves it *through*
           the stage's perspective, and the two together read as the camera
           travelling into the volume rather than the volume growing. */
        @keyframes rkvIgnite {
            0% { scale: 1; translate: 0; }
            22% { scale: 1.06; }
            100% { scale: 1.42; translate: 0 0 96px; }
        }

        /* The house comes apart before it goes. The roof lifts clear as one
           piece — the same gesture as pulling the lid off an architectural
           model — the porch slides out toward the street, and the walls thin
           to almost nothing so that what is left standing in the frame at
           the moment the curtain moves is the plan and its six hazards. That
           is the last thing on the stage and the first thing in the site. */
        .rkv-intro.is-entering .rkv-house {
            --solid: 0.14;
            --plan: 1;
        }

        .rkv-intro.is-entering .rkv-roof {
            animation: rkvRoofLift 0.66s cubic-bezier(0.24, 0.9, 0.26, 1) forwards;
            /* The lid keeps its own `--solid`, so it does not dissolve with
               the walls. The whole gesture is a roof being lifted off a model
               — it has to still be a roof while it is in the air. */
            --solid: 0.8;
        }

        @keyframes rkvRoofLift {
            to { transform: translate3d(0, -52px, 0); }
        }

        .rkv-intro.is-entering .rkv-porch {
            animation: rkvPorchPart 0.66s cubic-bezier(0.24, 0.9, 0.26, 1) forwards;
            --solid: 0.46;
        }

        @keyframes rkvPorchPart {
            to { transform: translate3d(0, 0, 40px); }
        }

        /* A second pass of the scan, this time on the way out: it starts at
           the floor the moment the roof leaves and clears the eaves as the
           curtain parts. Its own keyframes rather than the entrance's, so
           replaying it does not depend on restarting an animation. */
        .rkv-intro.is-entering .rkv-scanplane {
            animation: rkvVolumeScanOut 0.66s cubic-bezier(0.3, 0, 0.2, 1) forwards;
        }

        @keyframes rkvVolumeScanOut {
            0% { transform: translate3d(0, 8px, 0) rotateX(90deg); opacity: 0; }
            22% { opacity: 0.9; }
            100% { transform: translate3d(0, -104px, 0) rotateX(90deg); opacity: 0; }
        }

        .rkv-intro.is-entering .rkv-house-btn {
            animation: rkvHouseOut 0.46s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards;
        }

        @keyframes rkvHouseOut { to { opacity: 0; } }

        .rkv-intro.is-entering .rkv-face,
        .rkv-intro.is-entering .rkv-plate,
        .rkv-intro.is-entering .rkv-door {
            border-color: var(--rkv-accent);
            /* The opacity leg has to be restated: this rule replaces the
               transition the faces carry, and without it the walls would
               snap to 0.14 instead of thinning. */
            transition: border-color 0.18s linear, opacity 0.42s cubic-bezier(0.22, 1, 0.32, 1);
        }

        /* One ring off the volume as it opens. It is the only thing on the
           whole page that expands from a click, which is what makes the click
           feel like it did something. */
        .rkv-intro-ring {
            position: absolute;
            left: 50%;
            top: 40%;
            width: 230px;
            height: 230px;
            margin: -115px 0 0 -115px;
            border-radius: 50%;
            border: 1px solid var(--rkv-accent);
            opacity: 0;
            pointer-events: none;
        }

        .rkv-intro.is-entering .rkv-intro-ring {
            animation: rkvRing 0.72s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes rkvRing {
            0% { transform: scale(0.42); opacity: 0.9; }
            100% { transform: scale(2.4); opacity: 0; }
        }

        /* The brand recedes rather than merely fading — it pulls toward the
           viewer and softens as the curtain parts behind it, so the two phases
           read as one camera move instead of two separate cues. */
        .rkv-intro.is-entering .rkv-intro-brand,
        .rkv-intro.is-entering .rkv-intro-hint,
        .rkv-intro.is-entering .rkv-intro-cta {
            animation: rkvBrandRecede 0.44s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes rkvBrandRecede {
            to { opacity: 0; transform: scale(1.07); filter: blur(5px); }
        }

        @media (max-width: 720px) {
            .rkv-intro-mark { width: 52px; height: 52px; animation-delay: 0.04s; animation-duration: 0.32s; }
            .rkv-intro-word { font-size: 1.2rem; }
            .rkv-intro-bloom { width: 150px; height: 150px; margin: -75px 0 0 -75px; }

            @keyframes rkvScanTravel {
                0% { transform: translateY(0); opacity: 0; }
                18% { opacity: 1; }
                80% { opacity: 1; }
                100% { transform: translateY(52px); opacity: 0; }
            }

            /* Shorter, thinner sequence on a phone: six tiles instead of
               twelve, every delay pulled in, and a smaller house so the
               invitation still sits comfortably above the fold. */
            .rkv-tile:nth-child(even) { display: none; }
            .rkv-tile { animation-duration: 0.42s; animation-delay: calc(var(--o) * 16ms); }
            .rkv-intro-scan { animation-delay: 0.04s; animation-duration: 0.32s; }
            .rkv-intro-word i { animation-delay: calc(200ms + var(--i) * 20ms); animation-duration: 0.3s; }
            .rkv-intro-rule { animation-delay: 0.34s; animation-duration: 0.3s; }
            .rkv-intro-sub { animation-delay: 0.38s; animation-duration: 0.28s; }
            .rkv-intro-brand { animation-delay: 0.36s; animation-duration: 0.42s; }

            .rkv-house-scene { width: 268px; height: 208px; }
            .rkv-house-lean { scale: 0.66; }
            .rkv-house { animation-delay: 0.38s; animation-duration: 0.34s; }
            .rkv-house-btn { margin-top: 22px; animation-delay: 0.38s; animation-duration: 0.32s; }
            .rkv-house-shadow { bottom: 68px; width: 166px; height: 26px; margin-left: -83px; }
            .rkv-intro-ring { width: 190px; height: 190px; margin: -95px 0 0 -95px; }
            .rkv-scanplane { animation-delay: 0.42s; animation-duration: 0.85s; }
            .rkv-pin { animation-delay: calc(600ms + var(--n) * 60ms); }
            .rkv-intro-hint { font-size: 0.75rem; }

            /* The turntable is the first thing to go on a phone: it is the one
               continuously running animation in the sequence, and the volume
               reads perfectly well held still at this size. */
            .rkv-house-orbit { animation: none; transform: rotateY(-30deg); }

            /* And the far side of the model goes with it. At this size the
               back and interior faces are three or four pixels of texture
               nobody can resolve, but they are still surfaces the compositor
               has to sort and paint on the device least able to. The
               silhouette is unchanged without them. */
            .rkv-f-back, .rkv-f-inner { display: none; }
        }

        /* The volume is scaled rather than re-laid-out on a short screen, so
           the plan, the pins and the pitch all stay in proportion. */
        @media (max-height: 760px) and (min-width: 721px) {
            .rkv-house-scene { width: 300px; height: 224px; }
            .rkv-house-lean { scale: 0.84; }
            .rkv-house-btn { margin-top: 20px; }
        }

        /* No cinematic opening at all under reduced motion: the stage is never
           painted, so the finished page is what the first frame shows. This
           lives here, not in app.css, so it holds before app.css has loaded. */
        @media (prefers-reduced-motion: reduce) {
            .rkv-intro { display: none !important; }
        }
    </style>

    {{-- ======================================================================
         OPENING SEQUENCE — CONTROLLER

         Inline and synchronous on purpose. The overlay is a gate the visitor
         opens, so the thing that opens it cannot be allowed to arrive late (or
         not at all): if this were part of the bundle, a failed or slow chunk
         would leave someone looking at a house they cannot click. Everything
         the gate needs is here, in the document, running before the first
         paint. The React bundle only subscribes.
         ====================================================================== --}}
    <script>
        window.__RKV_INTRO = (function () {
            /* brand → live → entering → done. `live` is the state the sequence
               parks in and waits: Act I has finished, the house is clickable,
               and nothing else happens until a person acts. */
            var phase = 'brand';
            var listeners = [];
            var reduced = false;

            /* The bundle is a module script, so React mounts *before*
               DOMContentLoaded — which is when boot() runs. `ready()` is
               therefore normally called before there is anything to tell, so
               the flag lives out here and boot() reads whatever it finds. */
            var appReady = false;
            var onReady = null;

            try {
                reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            } catch (e) { /* matchMedia is ancient; if it throws, play the sequence */ }

            function emit(next) {
                if (phase === next) return;
                phase = next;
                for (var i = 0; i < listeners.length; i++) {
                    try { listeners[i](next); } catch (e) { /* a bad subscriber must not stall the gate */ }
                }
            }

            var api = {
                get: function () { return phase; },
                subscribe: function (fn) {
                    listeners.push(fn);
                    return function () {
                        var i = listeners.indexOf(fn);
                        if (i > -1) listeners.splice(i, 1);
                    };
                },
                enter: function () {},
                /* Called from the hero's layout effect. The gate refuses to go
                   live until the page behind it exists — the overlay is
                   presentation, but a curtain that opens onto an unmounted
                   React tree is worse than one that waits a beat. */
                ready: function () {
                    appReady = true;
                    if (onReady) onReady();
                }
            };

            function boot() {
                var node = document.getElementById('rkv-intro');
                var root = document.documentElement;
                var app = document.getElementById('app');

                /* Release the page. `is-hero-in` lets the hero's own entrance
                   ladder run; clearing `inert` hands interaction and the
                   accessibility tree back to the document. */
                function release() {
                    root.classList.add('is-hero-in');
                    if (app) app.removeAttribute('inert');
                }

                if (!node || reduced) {
                    release();
                    if (node && node.parentNode) node.parentNode.removeChild(node);
                    emit('done');
                    return;
                }

                /* The page is rendered underneath and its LCP capture is
                   already in flight — but it is behind a gate, so while the
                   gate is up it is neither focusable nor announced. */
                if (app) app.setAttribute('inert', '');

                var isMobile = false;
                try { isMobile = window.matchMedia('(max-width: 720px)').matches; } catch (e) {}

                /* One number per phase boundary, matched to the CSS ladder
                   above. Change one of these and the matching keyframe delay
                   above has to move with it.

                   LIVE  — the moment the house has finished building and the
                           invitation appears. Nothing is clickable before it.
                   IGNITE— how long the house is allowed to come apart on its
                           own before the curtain starts moving behind it. It
                           buys the roof lift and the outgoing scan a clear
                           beat: the model has to be seen opening, or the
                           click reads as a fade rather than as a way in.
                   PART  — how long after that the curtain takes to clear the
                           viewport, which is the tile animation plus its
                           centre-outward stagger plus a few frames of slack.

                   Earliest possible completion, measured from first paint:
                   desktop 1100 + 260 + 820 = ~2.18s, mobile 720 + 180 + 510 =
                   ~1.41s. Both sit inside the intended window with the whole
                   brand ladder read at a deliberate pace rather than rushed. */
                var LIVE = isMobile ? 720 : 1100;
                var PATIENT = isMobile ? 5200 : 4600;
                var IGNITE = isMobile ? 180 : 260;
                var PART = isMobile ? 510 : 820;

                /* The CSS ladder is timed from first paint, so the wait is
                   measured from the same origin — `__RKV_T0` is stamped in the
                   first rAF after the document parses. If the stamp is missing
                   for any reason, treat now as the origin and run the full
                   ladder rather than skipping ahead. */
                var t0 = window.__RKV_T0;
                var elapsed = typeof t0 === 'number' ? performance.now() - t0 : 0;

                var entered = false;

                function enter() {
                    if (entered || phase === 'brand') return;
                    entered = true;

                    node.classList.remove('is-nudging');
                    node.classList.add('is-entering');
                    emit('entering');

                    /* The ignition reads for a beat on its own, then the
                       curtain and the hero start together — the hero is
                       already in motion in the gaps between the rising tiles
                       rather than waiting for a bare stage to clear. */
                    window.setTimeout(function () {
                        node.classList.add('is-opening');
                        release();

                        window.setTimeout(function () {
                            if (node.parentNode) node.parentNode.removeChild(node);
                            /* Focus was on the house; the house is gone. Reset
                               to the document so the next Tab starts at the
                               skip link rather than nowhere. */
                            if (document.activeElement && document.activeElement.blur) {
                                document.activeElement.blur();
                            }
                            emit('done');
                        }, PART);
                    }, IGNITE);
                }

                api.enter = enter;

                var btn = document.getElementById('rkv-enter');
                var cta = document.getElementById('rkv-cta');
                if (btn) btn.addEventListener('click', enter);
                if (cta) cta.addEventListener('click', enter);

                /* Clicking the empty stage is a real attempt to get in. Rather
                   than ignoring it, point at the thing that works. */
                node.addEventListener('click', function (e) {
                    if (phase !== 'live') return;
                    if (btn && btn.contains(e.target)) return;
                    if (cta && cta.contains(e.target)) return;
                    node.classList.remove('is-nudging');
                    void node.offsetWidth;
                    node.classList.add('is-nudging');
                });

                document.addEventListener('keydown', function (e) {
                    if (phase !== 'live') return;
                    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar' || e.key === 'Escape') {
                        e.preventDefault();
                        enter();
                    }
                });

                /* Pointer lean. One rAF-coalesced handler writing two custom
                   properties — no layout read per move beyond a cached rect,
                   and nothing at all once the gate is open. */
                var frame = 0;
                node.addEventListener('pointermove', function (e) {
                    if (phase !== 'live' || e.pointerType === 'touch' || frame) return;
                    var x = e.clientX;
                    var y = e.clientY;
                    frame = requestAnimationFrame(function () {
                        frame = 0;
                        var w = window.innerWidth || 1;
                        var h = window.innerHeight || 1;
                        node.style.setProperty('--rkv-px', ((x / w) * 2 - 1).toFixed(3));
                        node.style.setProperty('--rkv-py', ((y / h) * 2 - 1).toFixed(3));
                    });
                });

                /* The gate goes live when two things are true: Act I has
                   finished on the clock, and the page behind the curtain has
                   mounted. Whichever is later wins. The cap is the escape
                   hatch — if the bundle never arrives at all, a visitor stuck
                   on an un-openable overlay has no way to recover, while an
                   opened one at least shows them something is wrong. */
                var ladderDone = false;

                function goLive() {
                    if (phase !== 'brand' || !ladderDone || !appReady) return;
                    node.classList.add('is-live');
                    emit('live');
                    /* Focus moves into the dialog, not onto the house.
                       Programmatic focus on a button satisfies :focus-visible
                       in Chrome when nothing has been interacted with yet, so
                       focusing the house directly would paint a focus ring on
                       every mouse visitor's first frame. Focusing the dialog
                       container puts the screen reader in the right place and
                       makes the house the first Tab stop, without drawing a
                       ring nobody asked for. */
                    try { node.focus({ preventScroll: true }); } catch (e2) { node.focus(); }
                }

                onReady = goLive;

                window.setTimeout(function () {
                    ladderDone = true;
                    goLive();
                }, Math.max(0, LIVE - elapsed));

                window.setTimeout(function () {
                    if (phase !== 'brand') return;
                    ladderDone = true;
                    appReady = true;
                    goLive();
                }, 4000);

                window.setTimeout(function () {
                    if (phase === 'live') node.classList.add('is-patient');
                }, Math.max(0, PATIENT - elapsed));
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', boot);
            } else {
                boot();
            }

            return api;
        })();
    </script>

    <script>
        /* The CSS timeline starts at first paint, so the clock JS schedules
           against has to start there too — not at navigation start, which can
           be a long way earlier on a cold load. */
        window.__RKV_T0 = null;
        requestAnimationFrame(function () {
            window.__RKV_T0 = performance.now();
        });
    </script>

    <noscript>
        <style>
            /* Without scripting there is nobody to open the gate, so there is
               no gate — the page is simply the page. */
            .rkv-intro { display: none !important; }
        </style>
    </noscript>

    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body>
    {{-- The opening stage is static markup, not React output: it has to be on
         screen at the first paint, which is long before the bundle has parsed.
         The site renders into #app underneath it at the same time — the intro
         never gates the DOM or the LCP request, only the moment the curtain
         is allowed to part. --}}
    <div id="rkv-intro" class="rkv-intro" role="dialog" aria-modal="true" aria-labelledby="rkv-intro-word" tabindex="-1">
        <div class="rkv-intro-tiles" aria-hidden="true">
            @for ($i = 0; $i < 12; $i++)
                <span class="rkv-tile" style="--o: {{ abs($i - 5.5) }}"></span>
            @endfor
        </div>

        <div class="rkv-intro-veil" aria-hidden="true"></div>

        <div class="rkv-intro-inner">
            <div class="rkv-intro-brand">
                <span class="rkv-intro-mark-wrap" aria-hidden="true">
                    <span class="rkv-intro-bloom"></span>
                    <span class="rkv-intro-mark"></span>
                    <span class="rkv-intro-scan"></span>
                </span>
                <span class="rkv-intro-word" id="rkv-intro-word">
                    @foreach (str_split('RumahKuVR') as $i => $char)
                        <i style="--i: {{ $i }}" aria-hidden="true">{{ $char }}</i>
                    @endforeach
                    <span class="rkv-sr-only">RumahKuVR</span>
                </span>
                <span class="rkv-intro-rule" aria-hidden="true"></span>
                <span class="rkv-intro-sub">VR Home-Safety Training</span>
            </div>

            <button type="button" id="rkv-enter" class="rkv-house-btn" aria-describedby="rkv-intro-hint">
                <span class="rkv-sr-only">Enter the RumahKuVR site</span>
                <span class="rkv-house-shadow" aria-hidden="true"></span>
                <span class="rkv-intro-ring" aria-hidden="true"></span>
                <span class="rkv-house-scene" aria-hidden="true">
                    <span class="rkv-house-lean">
                        <span class="rkv-house-orbit">
                            <span class="rkv-house">
                                {{-- Floor plate first: the plan and its hazards
                                     are what the translucent walls are seen
                                     through.

                                     The ten partitions are House4's own
                                     ground-floor walls and the six pins are
                                     the six hazards XR_MainScene actually
                                     places — wet bathroom floor, folded rug,
                                     exposed cable in the corridor, the
                                     medicine shelf, the gas ring and the
                                     slippers at the door — each converted
                                     from its scene coordinate onto the
                                     plate. See the block comment above. --}}
                                <span class="rkv-plate">
                                    <span class="rkv-plate-grid"></span>
                                    <span class="rkv-plan">
                                        <b></b>
                                        <i></i><i></i><i></i><i></i><i></i>
                                        <i></i><i></i><i></i><i></i><i></i>
                                    </span>
                                    <span class="rkv-pin" style="--x: 37px;  --z: 53px;  --n: 0"></span>
                                    <span class="rkv-pin" style="--x: -28px; --z: 38px;  --n: 1"></span>
                                    <span class="rkv-pin" style="--x: 51px;  --z: 86px;  --n: 2"></span>
                                    <span class="rkv-pin" style="--x: 13px;  --z: -8px;  --n: 3"></span>
                                    <span class="rkv-pin" style="--x: 50px;  --z: -23px; --n: 4"></span>
                                    <span class="rkv-pin" style="--x: 51px;  --z: -65px; --n: 5"></span>
                                </span>

                                {{-- The light on the first-floor slab, between
                                     the plan and the walls, so the volume has
                                     an inside rather than being a shell. --}}
                                <span class="rkv-lightpad"></span>

                                {{-- The two-storey block, in three parts so
                                     the corridor bay can be a slot rather
                                     than a decal. Far surfaces first: with
                                     translucent faces the paint order is what
                                     the depth reads as. --}}
                                <span class="rkv-mass">
                                    <span class="rkv-face rkv-f-back rkv-rearwin rkv-wb-back"></span>
                                    <span class="rkv-face rkv-f-back rkv-rearwin rkv-cb-back"></span>
                                    <span class="rkv-face rkv-f-back rkv-rearwin rkv-eb-back"></span>

                                    <span class="rkv-face rkv-f-west rkv-flank rkv-wb-west"></span>
                                    <span class="rkv-face rkv-f-inner rkv-wb-inner"></span>
                                    <span class="rkv-face rkv-f-inner rkv-eb-inner"></span>

                                    <span class="rkv-face rkv-f-top rkv-wb-top"></span>
                                    <span class="rkv-face rkv-f-top rkv-cb-top"></span>
                                    <span class="rkv-face rkv-f-top rkv-eb-top"></span>

                                    <span class="rkv-face rkv-f-recess rkv-cb-front"></span>
                                    <span class="rkv-face rkv-f-front rkv-upperwin rkv-wb-front"></span>
                                    <span class="rkv-face rkv-f-front rkv-upperwin rkv-eb-front"></span>
                                    <span class="rkv-face rkv-f-east rkv-flank rkv-eb-east"></span>
                                </span>

                                {{-- The single-storey front wing, split by the
                                     same slot. Its own group so it can slide
                                     out of the way when the house opens. --}}
                                <span class="rkv-porch">
                                    <span class="rkv-face rkv-f-west rkv-pw-west"></span>
                                    <span class="rkv-face rkv-f-inner rkv-pw-inner"></span>
                                    <span class="rkv-face rkv-f-inner rkv-pe-inner"></span>
                                    <span class="rkv-face rkv-f-front rkv-pw-front"><i class="rkv-pwin"></i></span>
                                    <span class="rkv-face rkv-f-front rkv-pe-front"><i class="rkv-pwin"></i><i class="rkv-door"></i></span>
                                    <span class="rkv-face rkv-f-east rkv-pe-east"></span>
                                </span>

                                {{-- Truncated hip over the block, mono-pitch
                                     over the wing. Grouped so the whole lid
                                     can come off in one move. --}}
                                <span class="rkv-roof">
                                    <span class="rkv-face rkv-slope rkv-rf-back"></span>
                                    <span class="rkv-face rkv-slope rkv-rf-west"></span>
                                    <span class="rkv-face rkv-rf-deck"></span>
                                    <span class="rkv-face rkv-slope rkv-rf-east"></span>
                                    <span class="rkv-face rkv-slope rkv-rf-fw"></span>
                                    <span class="rkv-face rkv-slope rkv-rf-fe"></span>
                                    <span class="rkv-face rkv-canopy rkv-cn-west"></span>
                                    <span class="rkv-face rkv-canopy rkv-cn-east"></span>
                                </span>

                                <span class="rkv-scanplane"></span>
                            </span>
                        </span>
                    </span>
                </span>
            </button>

            <p class="rkv-intro-hint" id="rkv-intro-hint">
                <b>Click the house</b> to enter
            </p>

            <button type="button" id="rkv-cta" class="rkv-intro-cta">Enter RumahKuVR</button>
        </div>
    </div>

    <div id="app"></div>
</body>
</html>

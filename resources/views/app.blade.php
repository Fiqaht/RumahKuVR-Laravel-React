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

           ACT I  — the brand resolves, parks at the top of the stage, and a
                    RumahKuVR house builds itself in the middle of it. Pure CSS
                    on a delay ladder; it runs whether or not the bundle has
                    arrived. Measured from first paint: the mark resolves by
                    520ms, the wordmark and its details by 860ms, and the house
                    is standing and clickable at 1100ms (720ms on a phone).

           ACT II — the visitor clicks the house. The volume ignites for 150ms,
                    then the curtain parts from the centre outward while the
                    hero begins its own entrance in the same frame; the stage
                    is removed 820ms later. Clicking at the first possible
                    moment puts the whole opening at ~2.1s on a desktop and
                    ~1.36s on a phone, and there is no upper bound — the stage
                    will wait as long as somebody wants to look at the house.

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
           inside a three-quarter view the whole way through. */
        .rkv-house-orbit {
            position: absolute;
            inset: 0;
            transform-style: preserve-3d;
            animation: rkvOrbit 30s ease-in-out infinite;
            animation-play-state: paused;
            transform: rotateY(20deg);
        }

        .rkv-intro.is-live .rkv-house-orbit { animation-play-state: running; }

        @keyframes rkvOrbit {
            from { transform: rotateY(20deg); }
            50% { transform: rotateY(42deg); }
            to { transform: rotateY(20deg); }
        }

        .rkv-house {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 0;
            height: 0;
            transform-style: preserve-3d;
            /* Whole volume rises into place as one object. Transform only —
               see the note on .rkv-house-btn for why the fade cannot be here. */
            transform: translateY(30px) scale(0.9);
            animation: rkvHouseRise 0.54s cubic-bezier(0.18, 1, 0.28, 1) 0.56s forwards;
        }

        @keyframes rkvHouseRise {
            to { transform: translateY(0) scale(1); }
        }

        .rkv-face {
            position: absolute;
            background: var(--rkv-fill);
            border: 1px solid var(--rkv-line-soft);
            box-sizing: border-box;
        }

        /* Faces are lit by alpha rather than by a light source: the two the
           viewer sees most of the time are the brightest, the far ones recede.
           Cheap, and it reads as form rather than as a flat net. */
        .rkv-wall-f, .rkv-wall-b { width: 190px; height: 96px; margin: -48px 0 0 -95px; }
        .rkv-wall-l, .rkv-wall-r { width: 150px; height: 96px; margin: -48px 0 0 -75px; }

        .rkv-wall-f { transform: translateZ(75px); border-color: var(--rkv-line); }
        .rkv-wall-b { transform: translateZ(-75px) rotateY(180deg); opacity: 0.5; }
        .rkv-wall-l { transform: translateX(-95px) rotateY(-90deg); opacity: 0.72; }
        .rkv-wall-r { transform: translateX(95px) rotateY(90deg); opacity: 0.72; }

        /* Gable ends. 150 wide, 58 tall, clipped to the triangle above the
           eave line — the shape that makes the silhouette a house and not a
           box with a lid. */
        .rkv-gable-l, .rkv-gable-r {
            width: 150px;
            height: 58px;
            margin: -29px 0 0 -75px;
            clip-path: polygon(50% 0, 100% 100%, 0 100%);
            border: 0;
            background: linear-gradient(180deg, rgba(228, 235, 242, 0.20), rgba(228, 235, 242, 0.06));
        }

        [data-theme='light'] .rkv-gable-l,
        [data-theme='light'] .rkv-gable-r {
            background: linear-gradient(180deg, rgba(20, 26, 34, 0.17), rgba(20, 26, 34, 0.05));
        }

        .rkv-gable-l { transform: translateX(-95px) translateY(-77px) rotateY(-90deg); }
        .rkv-gable-r { transform: translateX(95px) translateY(-77px) rotateY(90deg); opacity: 0.62; }

        /* 37.7° pitch: 58 of rise over 75 of run, which is 52.3° off vertical. */
        .rkv-roof-f, .rkv-roof-b {
            width: 190px;
            height: 95px;
            margin: -47.5px 0 0 -95px;
            background: linear-gradient(180deg, rgba(226, 233, 240, 0.14), rgba(226, 233, 240, 0.03));
            border: 1px solid var(--rkv-line);
        }

        [data-theme='light'] .rkv-roof-f,
        [data-theme='light'] .rkv-roof-b {
            background: linear-gradient(180deg, rgba(20, 26, 34, 0.12), rgba(20, 26, 34, 0.03));
        }

        .rkv-roof-f { transform: translateY(-77px) translateZ(37.5px) rotateX(52.3deg); }
        .rkv-roof-b { transform: translateY(-77px) translateZ(-37.5px) rotateX(-52.3deg); opacity: 0.55; }

        /* The ridge, drawn as its own hairline so the two slopes meet on a
           bright edge instead of a seam. */
        .rkv-ridge {
            position: absolute;
            width: 192px;
            height: 2px;
            margin: -108px 0 0 -96px;
            border-radius: 2px;
            background: linear-gradient(90deg, transparent, var(--rkv-accent) 22%, var(--rkv-accent) 78%, transparent);
            opacity: 0.75;
        }

        /* ---- floor plate: the plan, and the hazards on it ---- */
        .rkv-plate {
            position: absolute;
            width: 250px;
            height: 205px;
            margin: -102.5px 0 0 -125px;
            transform: translateY(49px) rotateX(90deg);
            /* Deliberately flat: the grid, the partitions and the hazard pins
               all belong in the plate's own plane, and leaving it flat means
               their fade-ins cannot flatten anything above them. */
            background:
                radial-gradient(80% 80% at 50% 50%, rgba(226, 233, 240, 0.07), transparent 72%);
            border: 1px solid var(--rkv-line-soft);
            border-radius: 2px;
        }

        [data-theme='light'] .rkv-plate {
            background: radial-gradient(80% 80% at 50% 50%, rgba(20, 26, 34, 0.06), transparent 72%);
        }

        .rkv-plate-grid {
            position: absolute;
            inset: 0;
            background-image:
                repeating-linear-gradient(90deg, var(--rkv-line-soft) 0 1px, transparent 1px 25px),
                repeating-linear-gradient(0deg, var(--rkv-line-soft) 0 1px, transparent 1px 25px);
            opacity: 0.5;
            -webkit-mask: radial-gradient(70% 70% at 50% 50%, #000 30%, transparent 78%);
            mask: radial-gradient(70% 70% at 50% 50%, #000 30%, transparent 78%);
        }

        /* Four partition lines: enough for the plate to read as a plan of a
           house rather than as graph paper. */
        .rkv-plan i {
            position: absolute;
            background: var(--rkv-line);
            opacity: 0.8;
        }

        .rkv-plan i:nth-child(1) { left: 30px; top: 28px; width: 1px; height: 82px; }
        .rkv-plan i:nth-child(2) { left: 30px; top: 110px; width: 118px; height: 1px; }
        .rkv-plan i:nth-child(3) { left: 148px; top: 46px; width: 1px; height: 132px; }
        .rkv-plan i:nth-child(4) { left: 76px; top: 46px; width: 72px; height: 1px; }

        /* Hazard markers, straight out of Peta Bahaya. They sit in the plan and
           pulse in sequence, so the volume above them reads as a home with
           something wrong in it rather than as a piece of geometry. */
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
            opacity: 0;
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
           floor to the ridge, and because it is a real plane in the same 3D
           space it stays legible from every angle of the turntable instead of
           going edge-on. Same motif as the line that draws the mark, one
           dimension up. */
        .rkv-scanplane {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 252px;
            height: 207px;
            margin: -103.5px 0 0 -126px;
            border: 1px solid var(--rkv-accent);
            border-radius: 2px;
            background: radial-gradient(60% 60% at 50% 50%, var(--rkv-glow), transparent 74%);
            box-shadow: 0 0 22px 1px var(--rkv-glow);
            opacity: 0;
            animation: rkvVolumeScan 1.05s cubic-bezier(0.16, 1, 0.3, 1) 0.62s forwards;
        }

        @keyframes rkvVolumeScan {
            0% { transform: translateY(56px) rotateX(90deg); opacity: 0; }
            16% { opacity: 0.8; }
            76% { opacity: 0.8; }
            100% { transform: translateY(-120px) rotateX(90deg); opacity: 0; }
        }

        /* Hover / focus: the volume brightens and lifts a little. Nothing
           bounces, nothing spins faster — it acknowledges the pointer and
           stops there. */
        .rkv-house-btn:hover .rkv-house-lean,
        .rkv-house-btn:focus-visible .rkv-house-lean {
            transform: rotateX(calc(-23deg + var(--rkv-py, 0) * 5deg)) rotateY(calc(var(--rkv-px, 0) * 11deg)) translateY(-8px) scale(1.035);
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
            bottom: 58px;
            width: 200px;
            height: 24px;
            margin-left: -100px;
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
            animation: rkvIgnite 0.62s cubic-bezier(0.3, 0, 0.2, 1) forwards;
        }

        @keyframes rkvIgnite {
            0% { scale: 1; }
            24% { scale: 1.07; }
            100% { scale: 1.26; }
        }

        .rkv-intro.is-entering .rkv-house-btn {
            animation: rkvHouseOut 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.12s forwards;
        }

        @keyframes rkvHouseOut { to { opacity: 0; } }

        .rkv-intro.is-entering .rkv-face,
        .rkv-intro.is-entering .rkv-plate,
        .rkv-intro.is-entering .rkv-ridge {
            border-color: var(--rkv-accent);
            transition: border-color 0.18s linear;
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
            .rkv-house-lean { scale: 0.76; }
            .rkv-house { animation-delay: 0.38s; animation-duration: 0.34s; }
            .rkv-house-btn { margin-top: 22px; animation-delay: 0.38s; animation-duration: 0.32s; }
            .rkv-house-shadow { bottom: 46px; width: 156px; margin-left: -78px; }
            .rkv-intro-ring { width: 190px; height: 190px; margin: -95px 0 0 -95px; }
            .rkv-scanplane { animation-delay: 0.42s; animation-duration: 0.85s; }
            .rkv-pin { animation-delay: calc(600ms + var(--n) * 60ms); }
            .rkv-intro-hint { font-size: 0.75rem; }

            /* The turntable is the first thing to go on a phone: it is the one
               continuously running animation in the sequence, and the volume
               reads perfectly well held still at this size. */
            .rkv-house-orbit { animation: none; transform: rotateY(26deg); }
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
                   IGNITE— how long the volume is allowed to swell on its own
                           before the curtain starts moving behind it.
                   PART  — how long after that the curtain takes to clear the
                           viewport, which is the tile animation plus its
                           centre-outward stagger plus a few frames of slack.

                   Earliest possible completion, measured from first paint:
                   desktop 1100 + 150 + 820 = ~2.07s, mobile 720 + 100 + 510 =
                   ~1.33s. Both sit inside the intended window with the whole
                   brand ladder read at a deliberate pace rather than rushed. */
                var LIVE = isMobile ? 720 : 1100;
                var PATIENT = isMobile ? 5200 : 4600;
                var IGNITE = isMobile ? 100 : 150;
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
                                     through. --}}
                                <span class="rkv-plate">
                                    <span class="rkv-plate-grid"></span>
                                    <span class="rkv-plan"><i></i><i></i><i></i><i></i></span>
                                    <span class="rkv-pin" style="--x: -62px; --z: -30px; --n: 0"></span>
                                    <span class="rkv-pin" style="--x: 34px; --z: 14px; --n: 1"></span>
                                    <span class="rkv-pin" style="--x: -18px; --z: 52px; --n: 2"></span>
                                    <span class="rkv-pin" style="--x: 70px; --z: -46px; --n: 3"></span>
                                </span>

                                <span class="rkv-face rkv-wall-b"></span>
                                <span class="rkv-face rkv-wall-l"></span>
                                <span class="rkv-face rkv-wall-r"></span>
                                <span class="rkv-face rkv-roof-b"></span>
                                <span class="rkv-face rkv-gable-l"></span>
                                <span class="rkv-face rkv-gable-r"></span>
                                <span class="rkv-face rkv-roof-f"></span>
                                <span class="rkv-face rkv-wall-f"></span>
                                <span class="rkv-ridge"></span>
                            </span>
                            <span class="rkv-scanplane"></span>
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

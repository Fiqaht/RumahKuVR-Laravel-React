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
         so the preload and the element resolve to the same candidate. --}}
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
                    .setAttribute('content', theme === 'light' ? '#f8faf7' : '#08090b');
                if (localStorage.getItem('rumahkuvr-contrast') === '1') root.classList.add('high-contrast');
                if (localStorage.getItem('rumahkuvr-large') === '1') root.classList.add('large-type');
            } catch (e) {
                document.documentElement.setAttribute('data-theme', 'dark');
            }
        })();
    </script>
    {{-- ======================================================================
         OPENING SEQUENCE — CRITICAL CSS

         Inlined rather than left to app.css so the black stage and the mark
         are painted by the very first frame, without waiting on a stylesheet.
         The whole sequence is CSS keyframes on a delay ladder: it runs whether
         or not the React bundle has arrived, and a failsafe keyframe clears the
         overlay at 2.8s if the bundle never does. JS only decides *when* the
         curtain parts (never before the hero has mounted) and removes the node.

         The overlay is presentation only — it is pointer-events: none from the
         first frame, holds no focusable node, and is aria-hidden, so the hero
         underneath is live and reachable the entire time it is on screen.
         ====================================================================== --}}
    <style>
        .rkv-intro {
            position: fixed;
            inset: 0;
            z-index: 200;
            pointer-events: none;
            --rkv-stage: #08090b;
            --rkv-ink: #f3f6f4;
            --rkv-accent: #3eb489;
        }

        [data-theme='light'] .rkv-intro {
            --rkv-stage: #f8faf7;
            --rkv-ink: #14211c;
            --rkv-accent: #17795a;
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
               pauses its delay countdown too, so the wait before the curtain
               parts is scheduled in JS (which alone knows the hero has
               mounted). What stays here is only the centre-outward stagger. */
            animation: rkvTileUp 0.52s cubic-bezier(0.72, 0, 0.24, 1) forwards paused;
            animation-delay: calc(var(--o) * 24ms);
        }

        .rkv-intro.is-opening .rkv-tile { animation-play-state: running; }

        @keyframes rkvTileUp {
            to { transform: translateY(-101%); }
        }

        .rkv-intro-brand {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 14px;
        }

        /* The mark is revealed by the scan line rather than merely faded in:
           it is clipped to nothing and un-clips downward at exactly the rate
           the green line travels. This is the site's signature motif, stated
           in the first 400ms so everything that reuses it later reads as a
           callback. */
        .rkv-intro-mark {
            position: relative;
            width: 62px;
            height: 62px;
            background-color: var(--rkv-ink);
            -webkit-mask: url('/images/brand/mark-96.png') center / contain no-repeat;
            mask: url('/images/brand/mark-96.png') center / contain no-repeat;
            clip-path: inset(0 0 100% 0);
            animation: rkvMarkScan 0.34s cubic-bezier(0.16, 1, 0.3, 1) 0.06s forwards;
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
            box-shadow: 0 0 14px 2px rgba(62, 180, 137, 0.55);
            opacity: 0;
            animation: rkvScanTravel 0.34s cubic-bezier(0.16, 1, 0.3, 1) 0.06s forwards;
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
            background: radial-gradient(circle, rgba(62, 180, 137, 0.34), transparent 68%);
            opacity: 0;
            animation: rkvBloom 0.62s cubic-bezier(0.4, 0, 0.2, 1) 0.12s forwards;
        }

        @keyframes rkvBloom {
            0% { opacity: 0; transform: scale(0.72); }
            45% { opacity: 1; }
            100% { opacity: 0.34; transform: scale(1); }
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
            animation: rkvCharIn 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            animation-delay: calc(240ms + var(--i) * 18ms);
        }

        @keyframes rkvCharIn {
            to { opacity: 1; filter: blur(0); transform: none; }
        }

        .rkv-intro-rule {
            width: 132px;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--rkv-accent), transparent);
            transform: scaleX(0);
            animation: rkvRule 0.42s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
        }

        @keyframes rkvRule { to { transform: scaleX(1); } }

        .rkv-intro-sub {
            font-family: 'DM Sans', system-ui, sans-serif;
            font-size: 0.6875rem;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            color: var(--rkv-accent);
            opacity: 0;
            animation: rkvSubIn 0.36s cubic-bezier(0.16, 1, 0.3, 1) 0.44s forwards;
        }

        @keyframes rkvSubIn {
            to { opacity: 0.9; }
        }

        /* The brand recedes rather than merely fading — it pulls toward the
           viewer and softens as the curtain parts behind it, so the two phases
           read as one camera move instead of two separate cues. */
        .rkv-intro.is-opening .rkv-intro-brand {
            animation: rkvBrandRecede 0.44s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes rkvBrandRecede {
            to { opacity: 0; transform: scale(1.07); filter: blur(5px); }
        }

        /* Dead-man's switch: if the bundle never arrives, nothing above ever
           gets `is-opening`, so this clears the stage on its own. */
        .rkv-intro {
            animation: rkvFailsafe 0.01s linear 2.8s forwards;
        }

        @keyframes rkvFailsafe {
            to { opacity: 0; visibility: hidden; }
        }

        @media (max-width: 720px) {
            .rkv-intro-mark { width: 52px; height: 52px; }
            .rkv-intro-word { font-size: 1.2rem; }
            @keyframes rkvScanTravel {
                0% { transform: translateY(0); opacity: 0; }
                18% { opacity: 1; }
                80% { opacity: 1; }
                100% { transform: translateY(52px); opacity: 0; }
            }

            /* Shorter, thinner sequence on a phone: six tiles instead of
               twelve, and every delay pulled in so the hero is readable
               around a second in. */
            .rkv-tile:nth-child(even) { display: none; }
            .rkv-tile {
                animation-duration: 0.42s;
                animation-delay: calc(var(--o) * 20ms);
            }
            .rkv-intro-mark { animation-delay: 0.04s; animation-duration: 0.3s; }
            .rkv-intro-scan { animation-delay: 0.04s; animation-duration: 0.3s; }
            .rkv-intro-word i { animation-delay: calc(180ms + var(--i) * 14ms); }
            .rkv-intro-rule { animation-delay: 0.3s; }
            .rkv-intro-sub { animation-delay: 0.34s; }
            .rkv-intro-bloom { width: 150px; height: 150px; margin: -75px 0 0 -75px; }
        }

        /* No cinematic opening at all under reduced motion: the stage is never
           painted, so the finished hero is what the first frame shows. This
           lives here, not in app.css, so it holds before app.css has loaded. */
        @media (prefers-reduced-motion: reduce) {
            .rkv-intro { display: none !important; }
        }
    </style>

    <script>
        /* The CSS timeline starts at first paint, so the clock JS schedules
           against has to start there too — not at navigation start, which can
           be a long way earlier on a cold load. */
        window.__RKV_T0 = null;
        requestAnimationFrame(function () {
            window.__RKV_T0 = performance.now();
        });
    </script>

    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body>
    {{-- The opening stage is static markup, not React output: it has to be on
         screen at the first paint, which is long before the bundle has parsed.
         The hero renders into #app underneath it at the same time — the intro
         never gates the hero's DOM, and the LCP capture was already requested
         by the preload hint in <head>. --}}
    <div id="rkv-intro" class="rkv-intro" aria-hidden="true">
        <div class="rkv-intro-tiles">
            @for ($i = 0; $i < 12; $i++)
                <span class="rkv-tile" style="--o: {{ abs($i - 5.5) }}"></span>
            @endfor
        </div>

        <div class="rkv-intro-brand">
            <span class="rkv-intro-mark-wrap">
                <span class="rkv-intro-bloom"></span>
                <span class="rkv-intro-mark"></span>
                <span class="rkv-intro-scan"></span>
            </span>
            <span class="rkv-intro-word">
                @foreach (str_split('RumahKuVR') as $i => $char)
                    <i style="--i: {{ $i }}">{{ $char }}</i>
                @endforeach
            </span>
            <span class="rkv-intro-rule"></span>
            <span class="rkv-intro-sub">VR Home-Safety Training</span>
        </div>
    </div>

    <div id="app"></div>
</body>
</html>

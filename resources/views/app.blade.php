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
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body>
    <div id="app"></div>
</body>
</html>

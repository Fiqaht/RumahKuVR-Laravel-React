<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#090a0c">
    <meta property="og:title" content="RumahKuVR — Safer Homes Through Immersive Learning">
    <meta property="og:description" content="AI-assisted virtual reality home-safety training for seniors using Unity 6.3 and Meta Quest 3.">
    <meta property="og:type" content="website">
    <meta property="og:image" content="/images/vr-gameplay.jpg">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="RumahKuVR — Safer Homes Through Immersive Learning">
    <meta name="twitter:description" content="AI-assisted virtual reality home-safety training for seniors using Unity 6.3 and Meta Quest 3.">
    <meta name="twitter:image" content="/images/vr-gameplay.jpg">
    <link rel="icon" type="image/png" href="/images/rumahkuvr-logo-white.png">
    <meta name="description" content="RumahKuVR — AI-assisted virtual reality home-safety training for seniors.">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>RumahKuVR — Safer Homes Through Immersive Learning</title>
    @viteReactRefresh
    <script>
        (function() {
            var theme = localStorage.getItem('rumahkuvr-theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
            document.documentElement.setAttribute('data-theme', theme);
        })();
    </script>
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body>
    <div id="app"></div>
</body>
</html>

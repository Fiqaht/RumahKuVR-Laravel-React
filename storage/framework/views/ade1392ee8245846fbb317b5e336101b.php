<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#090a0c">
    <meta name="description" content="RumahKuVR — AI-assisted virtual reality home-safety training for seniors.">
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
    <title>RumahKuVR — Safer Homes Through Immersive Learning</title>
    <?php echo app('Illuminate\Foundation\Vite')->reactRefresh(); ?>
    <script>
        (function() {
            var theme = localStorage.getItem('rumahkuvr-theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
            document.documentElement.setAttribute('data-theme', theme);
        })();
    </script>
    <?php echo app('Illuminate\Foundation\Vite')(['resources/css/app.css', 'resources/js/app.jsx']); ?>
</head>
<body>
    <div id="app"></div>
</body>
</html>
<?php /**PATH C:\laragon\www\RumahKuVR-Laravel-React\resources\views/app.blade.php ENDPATH**/ ?>
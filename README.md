# RumahKuVR — Laravel + React + Three.js Portfolio

A full-stack FYP portfolio implementation for RumahKuVR.

## Stack
- Laravel 13
- PHP 8.3+
- MySQL
- React
- Vite
- Three.js via React Three Fiber
- Custom motion/UI inspired by ReactBits interaction patterns
- Lucide icons

## What is implemented
- Editorial, senior-friendly RumahKuVR visual system
- Responsive navigation
- Three.js interactive hero home scene
- React-based section composition
- Scroll reveal motion
- Sticky/stacking difficulty progression
- Tutorial status presentation
- Real-project screenshot gallery + modal
- Senior/Caregiver/Admin role switcher
- Architecture diagram
- Accessibility controls
- Animated metrics
- Laravel JSON project endpoint
- Laravel + MySQL contact form persistence
- Responsive desktop/tablet/mobile design
- Reduced-motion support

## Screenshot files to replace
Put your real Unity captures inside `public/images/`:

- gameplay-wetfloor.jpg
- gameplay-electric.jpg
- gameplay-gas.jpg
- dashboard-caregiver.jpg
- dashboard-senior.jpg
- vr-gameplay.jpg
- result-screen.jpg
- performance-report.jpg

Missing images automatically display a labelled project placeholder.

## Important project truth
The page currently presents Tutorial Easy and Medium as complete.
Tutorial Hard is labelled `planned`, not complete.

## Laragon quick setup
Detailed hand-holding can be done together later. The short version:

1. Put the project in:
   `C:\laragon\www\RumahKuVR-Portfolio`

2. Make sure Laragon is using **PHP 8.3+**.

3. Start Apache/Nginx and MySQL in Laragon.

4. Open Laragon Terminal inside the project:
   ```bash
   composer install
   copy .env.example .env
   php artisan key:generate
   ```

5. Create a MySQL database:
   `rumahkuvr_portfolio`

6. Confirm `.env`:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=rumahkuvr_portfolio
   DB_USERNAME=root
   DB_PASSWORD=
   ```

7. Run:
   ```bash
   php artisan migrate
   npm install
   npm run dev
   ```

8. In another terminal, if Laragon auto virtual hosts are not being used:
   ```bash
   php artisan serve
   ```

9. Visit either:
   `http://rumahkuvr-portfolio.test`
   or the URL shown by `php artisan serve`.

## Production build
```bash
npm run build
php artisan optimize
```

## Notes
- Do not commit `.env`.
- Do not add fake scientific effectiveness statistics.
- Replace placeholder contact/GitHub/institution links before presentation.
- Real Unity screenshots should remain the primary visual evidence.

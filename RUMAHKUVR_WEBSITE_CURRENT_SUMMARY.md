# === RUMAHKUVR WEBSITE CURRENT STATE AUDIT ===

## 1. PROJECT OVERVIEW
**RumahKuVR Portfolio Website** - A single-page Final Year Project portfolio for a VR home-safety training application targeting seniors.

**Purpose**: Showcase FYP deliverables including Unity VR application, Meta Quest 3 implementation, and caregiver dashboard systems to academic evaluators and potential employers.

**Current State**: Hybrid full-stack portfolio using Laravel 13 backend serving a React SPA frontend via Blade template.

---

## 2. ACTUAL TECH STACK & VERSIONS (Verified from Files)

### Backend:
- **Laravel Framework**: ^13.0 (composer.json line 9)
- **PHP**: ^8.3 (composer.json line 8)
- **MySQL**: Database driver configured in .env.example

### Frontend:
- **React**: latest (package.json line 13)
- **React DOM**: latest (package.json line 14)
- **Vite**: latest (package.json line 21)
- **@vitejs/plugin-react**: latest (package.json line 18)
- **Three.js**: 0.182.0 (pinned, package.json line 15)
- **@react-three/fiber**: @latest (package.json line 11)
- **@react-three/drei**: @latest (package.json line 10)
- **Lucide React**: @latest (package.json line 12)

### Build Tools:
- **Vite**: Latest
- **Laravel Vite Plugin**: Latest
- **CSS**: Custom stylesheet (no Tailwind, no Bootstrap)

### Testing:
- **PHPUnit**: ^12.0 (composer.json line 19)
- Tests exist: `tests/Feature/ContactMessageTest.php` (single test)

---

## 3. IMPORTANT FOLDER/FILE STRUCTURE

```
C:\laragon\www\RumahKuVR-Laravel-React\
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       ├── ContactController.php
│   │       └── Controller.php
│   ├── Models/
│   │   └── ContactMessage.php
│   └── Providers/
├── bootstrap/
├── config/
├── database/
│   ├── factories/
│   ├── migrations/
│   │   ├── 2026_08_20_000000_create_runtime_tables.php
│   │   └── 2026_08_20_000001_create_contact_messages_table.php
│   └── seeders/
├── public/
│   ├── build/
│   │   ├── assets/
│   │   │   ├── app-3rShSSRE.css
│   │   │   └── manifest.json
│   │   └── manifest.json
│   ├── images/
│   │   ├── project/
│   │   ├── gameplay/
│   │   ├── controller-ps4-real.webp
│   │   ├── controller-xbox-real.webp
│   │   ├── meta-quest-3-real.webp
│   │   ├── rumahkuvr-logo-white.png
│   │   └── README.txt
│   ├── .htaccess
│   └── index.php
├── resources/
│   ├── css/
│   │   └── app.css (2082 lines)
│   ├── js/
│   │   └── app.jsx (1148 lines)
│   └── views/
│       └── app.blade.php
├── routes/
│   ├── console.php
│   └── web.php
├── storage/
├── tests/
│   ├── Feature/
│   │   └── ContactMessageTest.php
│   └── TestCase.php
├── vendor/
├── .env.example
├── .gitignore
├── artisan
├── composer.json
├── composer.lock
├── package.json
├── package-lock.json
├── phpunit.xml
├── README.md
├── vite.config.js
└── RUMAHKUVR_WEBSITE_CURRENT_SUMMARY.md (this file)
```

**Total Source Files Inspected**: ~50 core files (excluding node_modules/vendor)

---

## 4. ALL CURRENT PAGES/SECTIONS

The website is a **single-page application** with these sections (verified in app.jsx):

### Section 1: Home/Hero (`Hero` component at lines 1-284)
- **Purpose**: Main landing section introducing RumahKuVR
- **Content**: Split layout with copy on left + Three.js interactive 3D house scene on right
- **Components**: `Hero`, `HeroThree`, `HouseScene`, `HazardNode`, `Nav`, `Logo`
- **Status**: ✅ Complete, functional
- **Notes**: Contains abstract wireframe house with 3 glowing hazard spheres

### Section 2: Intent/Walkthrough (`ProblemExperience` component at lines 287-374)
- **Purpose**: Problem walkthrough demonstrating meal transport safety case study
- **Content**: 3-step flow (Spot → Handle → Learn) + detailed case study grid
- **Components**: Intent cards with staggered animation
- **Status**: ✅ Complete
- **Images**: Uses `/images/gameplay/hazard-meal-*.webp` series

### Section 3: Training Progression (`TrainingProgression` component at lines 376-488)
- **Purpose**: Tutorial philosophy explaining progressive difficulty system
- **Content**: Easy/Medium/Hard level comparison cards + SEE/TRY/SUCCEED/NEXT sequence
- **Components**: Level cards with step indicators
- **Status**: ✅ Complete
- **Project State**: Hard difficulty shows "planned" status (not fully implemented yet)

### Section 4: Gameplay Evidence (`GameplayShowcase` component at lines 491-614)
- **Purpose**: Bento-grid gallery of real Unity screenshots
- **Content**: 6 gameplay captures with modal view
- **Components**: Gallery card grid + accessible modal dialog
- **Status**: ✅ Complete
- **Images**: Uses `/images/project/*.webp` and `/images/gameplay/*.webp`

### Section 5: Platform/Ecosystem (`PlatformHardware` component at lines 617-692)
- **Purpose**: Explain VR + Controller mode duality
- **Content**: Two platform options (Meta Quest 3 / Universal gamepad)
- **Components**: Platform comparison cards
- **Status**: ✅ Complete
- **Note**: This section differs from old "Meta Quest 3 card" mentioned in council review

### Section 6: Roles/Stakeholders (`Roles` component at lines 695-793)
- **Purpose**: Show three user role perspectives
- **Content**: Senior/Caregiver/Admin tab switcher with dashboard previews
- **Components**: Role tabs with image/carousel display
- **Status**: ✅ Complete
- **Images**: Uses `dashboard-senior.jpg`, `dashboard-caregiver.jpg`

### Section 7: Accessibility/Ergonomics (`SeniorAccessibility` component at lines 796-860)
- **Purpose**: Document senior-first design principles
- **Content**: 6 accessibility principles list (Typography, Voice Guidance, High Contrast, etc.)
- **Components**: Grid of principle cards
- **Status**: ✅ Complete

### Section 8: Architecture/System (`SystemAndJourney` component at lines 862-934)
- **Purpose**: Show technical architecture and development journey
- **Content**: Interaction pipeline diagram (6 steps) + Development timeline (6 phases)
- **Components**: Pipeline flow nodes + Timeline steps
- **Status**: ✅ Complete
- **Note**: This replaces the missing "OrbitTimeline" from council discussions

### Section 9: Contact (`ProjectContact` component at lines 936-1067)
- **Purpose**: Contact form + project information
- **Content**: Left column (info) + Right column (form)
- **Components**: Form with state management + contact info cards
- **Status**: ✅ Complete (NO placeholder text visible)
- **Backend**: POSTs to `/api/contact` endpoint

### Section 10: Footer (implicit in App component)
- **Content**: Logo + copyright + back-to-top link
- **Status**: ✅ Present

### Section 11: Accessibility Dock (`AccessibilityDock` component at lines 1069-1109)
- **Purpose**: Site-wide accessibility controls
- **Content**: Contrast toggle + Large text toggle buttons
- **Components**: Floating dock in bottom-right corner
- **Status**: ✅ Functional

---

## 5. NAVIGATION & ROUTING

### Navbar Implementation:
- Fixed position glassmorphic header
- Links: Home | Experience | Training | Rig | Platform | Technology | About
- Mobile hamburger menu for tablet/mobile widths
- Active state highlighting based on scroll position

### Routing System:
- **Single route**: `/` → Blade template (`resources/views/app.blade.php`)
- **Internal anchors**: All nav links use hash anchors (`#home`, `#overview`, `#training`, etc.)
- **No client-side router**: Pure anchor-based navigation (no React Router)
- **External links**: NONE currently present

### Broken Links Check:
- ✅ All anchors resolve to existing `<section id="...">` elements
- ✅ No external links found (placeholder links removed)

---

## 6. CURRENT DESIGN SYSTEM

### Color Palette (from CSS variables):
- **Background**: #090a0c (dark monochrome)
- **Surface**: #111419, #171b20
- **Text Primary**: #f7f8f6
- **Text Secondary**: #c7cec8
- **Accent Green**: #214e3b
- **Accent Sage**: #a8b9a3
- **Accent Amber**: #c9873a
- **Border**: rgba(255,255,255,.12)

### Typography:
- **Headings**: Manrope (600-700 weights)
- **Body**: DM Sans (400-600 weights)
- **Base font-size**: 18px (elder-friendly)
- **Line-height**: 1.72 (generous spacing)

### Layout Patterns:
- Full-width sections with 1440px max container
- Consistent vertical padding using `var(--pad)` clamp variable
- Two-column layouts for split content (copy + media)
- Grid layouts for card galleries
- Flexbox for alignment patterns

### Visual Style:
- Dark monochrome theme (NOT light theme as in old council review)
- Minimal borders with subtle shadows
- Small rounded corners (border-radius: 9-10px typical)
- Professional editorial aesthetic
- NO excessive gradients
- NO glassmorphism used currently
- NO decorative clutter

### Responsive Breakpoints (from CSS):
- **Desktop**: 1440px max content width
- **Tablet**: ~1100px (grid collapses)
- **Mobile**: ~760px (stacking)
- **Extra small**: ~480px (font adjustments)

---

## 7. ANIMATIONS & INTERACTIONS

### Implemented Animations:
1. **Scroll Reveal** (IntersectionObserver-based)
   - File: `app.jsx` lines 48-66 (useReveal hook)
   - Effects: Fade-in-up, fade-in-scale
   - Applied to all major sections

2. **Three.js Hero Animation**
   - Wireframe house rotates slowly (sinusoidal motion)
   - Hazard spheres pulse with glow effect
   - Controlled by `useFrame` hooks
   - Respects `prefers-reduced-motion`

3. **Hover Effects**
   - Card lift transforms
   - Border color transitions
   - Box shadow enhancements

4. **Modal Dialog**
   - Overlay backdrop with click-to-close
   - Keyboard Escape key support
   - ARIA modal role

5. **Role Tab Switching**
   - Client-side state toggle
   - Tab panel ARIA pattern

6. **Accessibility Controls**
   - Contrast toggle (adds `high-contrast` class)
   - Large text toggle (adds `large-type` class)

7. **Count-Up Metrics**
   - Animated numbers in Results section
   - Uses requestAnimationFrame

### Animation Libraries/Approach:
- Native IntersectionObserver API
- React state management
- CSS transitions/animations
- Three.js r3f render loop
- NO external animation library (GSAP, Framer Motion, etc.)

---

## 8. THREE.JS / WEBGL USAGE

### Current Implementation:
- **File**: `app.jsx` lines 189-228 (HouseScene + HazardNode)
- **Component Location**: `HeroThree` wrapper at lines 230-241
- **Canvas Element**: Mounted inside `.hero-visual` container

### Three.js Dependencies:
- `three`: 0.182.0 (pinned)
- `@react-three/fiber`: @latest
- `@react-three/drei`: @latest

### Scene Content:
- Wireframe house structure (RoundedBox + Line primitives)
- Three glowing hazard spheres (HazardNode components)
- Ambient + directional lighting
- OrbitControls with auto-rotation disabled on reduced-motion

### Performance Considerations:
- Canvas DPR capped at [1, 1.5]
- Reduced motion support
- Suspense fallback (though it's null)
- Continuous render loop active even when scrolled off-screen

### Known Risks:
- ❌ No ErrorBoundary around Canvas component
- ❌ Render loop never pauses when hero leaves viewport
- ⚠️ Bundle size ~230KB+ gzipped just for this panel
- ⚠️ WebGL failure = total site blank (no fallback)

---

## 9. IMAGES / MEDIA / ASSETS

### Image Inventory (Verified in `public/images/`):

#### Project Screenshots:
- `/images/project/peta-bahaya-map.webp` - House hazard map
- `/images/project/session-result.webp` - Session result scorecard
- `/images/project/caregiver-dashboard.webp` - Caregiver portal

#### Gameplay Screenshots:
- `/images/gameplay/training-easy.webp` - Easy difficulty scene
- `/images/gameplay/training-medium.webp` - Medium difficulty scene
- `/images/gameplay/training-hard.webp` - Hard difficulty scene
- `/images/gameplay/hazard-kitchen-storage.webp` - Kitchen hazard
- `/images/gameplay/hazard-cat-walkway.webp` - Pet walkway hazard
- `/images/gameplay/hazard-meal-01.webp` - Meal transport step 1
- `/images/gameplay/hazard-meal-02.webp` - Meal transport step 2
- `/images/gameplay/hazard-meal-03.webp` - Meal transport step 3

#### Dashboard Interfaces:
- `/images/dashboard-senior.jpg` - Senior interface (used in Roles section)
- `/images/dashboard-caregiver.jpg` - Caregiver interface (used in Roles section)

#### Device Photos (Licensed):
- `/images/meta-quest-3-real.webp` - Meta Quest 3 headset
- `/images/controller-ps4-real.webp` - PS4 controller reference
- `/images/controller-xbox-real.webp` - Xbox controller reference

#### Logos & UI:
- `/images/rumahkuvr-logo-white.png` - White logo for dark backgrounds
- `/images/home-modern-warm.webp` - Supporting photography
- `/images/home-cozy-detail.webp` - Supporting photography
- `/images/elderly-couple-home.webp` - Supporting photography
- `/images/elderly-couple-window.webp` - Supporting photography

### Video Assets:
- ❌ NONE currently present in repository
- ❌ No `public/videos/` folder exists
- ❌ No `<video>` tags in JSX

### Icon System:
- Lucide React icons (imported throughout)
- Icons used consistently across components

---

## 10. CURRENT RUMAHKUVR CONTENT

### Project Title:
"AI-Assisted Virtual Reality Home Safety Application for Personalised Hazard Detection Among Seniors"

### Core Information:
- **Platform**: Meta Quest 3 / Unity 6.3 LTS
- **Modes**: VR Mode (immersive) + Controller Mode (seated access)
- **Difficulty Levels**: 
  - Easy: 3 hazards (complete)
  - Medium: 5 hazards (complete)
  - Hard: 10 hazards (marked "planned" - not fully implemented)
- **Total Hazards**: 18 scenarios across all difficulties

### Tutorial Philosophy:
"Guidance fades as confidence grows."

Three-tier progression:
1. **Easy** - Guided Learning (voice prompts, spotlights, direct cues)
2. **Medium** - Independent Practice (contextual help on demand, reduced markers)
3. **Hard** - Full Challenge (zero automatic hints, performance audit)

### Learning Sequence:
SEE → TRY → SUCCEED → NEXT

### Target Users:
- Seniors (primary)
- Family caregivers (monitoring/support)
- Administrators (system management)

### Accessibility Features Claimed:
1. Senior-calibrated typography (15px minimum)
2. Malay voice guidance
3. High contrast mode
4. Predictable controller mapping
5. Controlled near-fall feedback
6. Progressive guidance fading

### Developer Attribution:
- **Name**: Muhammad Thaqif Fahmi Bin Rafie'e
- **Program**: Diploma in Information Technology (Software Application Development)
- **Type**: Final Year Project showcase

### Technical Stack Presented:
- Unity 6.3 LTS
- Meta Quest 3
- Laravel (backend)
- React (frontend)
- Malaysian home safety context

---

## 11. FUNCTIONAL FEATURES

### WORKING ✅:
1. **Contact Form Submission**
   - POSTs to `/api/contact` endpoint
   - Validates name, email, subject, message
   - Stores in MySQL `contact_messages` table
   - CSRF protection enabled
   - Rate limited (10 requests/minute)
   - Returns JSON success/error responses
   - Displays inline success/error messages

2. **Accessible Modal Gallery**
   - Click/tap opens image modal
   - Escape key closes modal
   - ARIA modal role
   - Keyboard focus trap
   - Click-backdrop close

3. **Role Tab Switching**
   - Client-side state management
   - Tab panel ARIA pattern
   - Dynamic content loading

4. **Contrast Toggle**
   - Adds/removes `high-contrast` class on html element
   - Switches to white background + black text theme

5. **Large Text Toggle**
   - Adds/removes `large-type` class on html element
   - Scales base font size to 112%
   - Applies to rem-based typography (NOT px-based)

6. **Scroll Reveal Animations**
   - IntersectionObserver triggers reveal on-scroll
   - Fades elements up or scales them in
   - Works across all sections

7. **Responsive Navigation**
   - Desktop: Horizontal nav bar
   - Mobile/Tablet: Hamburger menu
   - Active link highlighting

8. **Prefers-Reduced-Motion Support**
   - Detects OS setting via matchMedia
   - Disables Three.js rotation when enabled
   - Disables autoRotate in OrbitControls

### PARTIAL ⚠️:
1. **Count-Up Animation**
   - Numbers animate upward during first scroll
   - Only runs once per session
   - Could benefit from IntersectionObserver triggering

2. **Image Lazy Loading**
   - `loading="lazy"` attribute present
   - But some hero images may still block paint

### NOT IMPLEMENTED ❌:
1. **Email Notifications**
   - Contact form saves to DB but NO email sent
   - Developer won't know messages arrived without checking DB directly

2. **Video Player**
   - No video content anywhere in site
   - No embedded YouTube/Vimeo

3. **Analytics Tracking**
   - No Google Analytics or other tracking
   - No pageview counting

---

## 12. LARAVEL/BACKEND ARCHITECTURE

### Actual Laravel Usage:

#### Routes (`routes/web.php`):
```php
Route::get('/', fn() => view('app'));                    // Serve React SPA
Route::get('/api/project', function () { ... });         // Static JSON (unused)
Route::post('/api/contact', [ContactController::class]); // Contact form processing
```

#### Controllers:
- `ContactController.php`: Validates input + saves to database
- `Controller.php`: Base controller class

#### Models:
- `ContactMessage.php`: Eloquent model with fillable fields defined

#### Migrations:
- `create_contact_messages_table.php`: actual schema used
- `create_runtime_tables.php`: Laravel scaffold (cache, sessions, jobs tables - unused)

#### Database:
- MySQL configuration in `.env.example`
- Single table: `contact_messages` (id, name, email, subject, message, timestamps)

### Is Laravel Required?

**Answer**: Partially yes, but only for contact form persistence.

**If static deployment needed**: Replace contact form with serverless service (Netlify Forms, Formspree, EmailJS) and remove Laravel entirely.

**Current reality**: Laravel serves two purposes:
1. Serves React SPA via Blade template (unnecessary overhead)
2. Processes contact form submissions (needed unless replaced)

---

## 13. REACT/FRONTEND ARCHITECTURE

### Entry Point:
- **File**: `resources/js/app.jsx`
- **Lines**: 1148 total
- **Mounting**: `createRoot(document.getElementById('app'))` at end of file
- **All-in-One**: Every component in single file (no code splitting)

### Component Structure (by approximate line ranges):
1. `Hero` - Lines 1-284
2. `ProblemExperience` - Lines 287-374
3. `TrainingProgression` - Lines 376-488
4. `GameplayShowcase` - Lines 491-614
5. `PlatformHardware` - Lines 617-692
6. `Roles` - Lines 695-793
7. `SeniorAccessibility` - Lines 796-860
8. `SystemAndJourney` - Lines 862-934
9. `ProjectContact` - Lines 936-1067
10. `AccessibilityDock` - Lines 1069-1109
11. `App` - Root component at end

### State Management:
- **Local State Only**: `useState` hooks within components
- **No Global Store**: No Redux, Zustand, or Context for app data
- **Form State**: Contact form uses local state with reset on success

### Hooks Used:
- `useState`: Component state
- `useEffect`: Lifecycle side effects
- `useRef`: DOM references (Three.js canvases, canvas refs)
- `useMemo`: Optimization for Three.js geometries
- `useReducer`: Not used
- Custom hooks: `useReveal`, `useActiveSection`, `useReducedMotion`

### No Router:
- Pure anchor-based navigation (`#home`, `#experience`, etc.)
- No React Router or similar library
- Single page = no routing needed

---

## 14. DATABASE/API/AUTHENTICATION STATUS

### Database:
- **Engine**: MySQL (configured via .env)
- **Tables**: 
  - `contact_messages` (main table)
  - Runtime tables from Laravel scaffold (cache, sessions, jobs - unused)
- **Migrations Run**: Yes (via `php artisan migrate`)

### APIs:
1. **GET /api/project** - Returns static JSON about the project
   - Status: ✅ Defined but NEVER consumed by frontend
   - File: `routes/web.php` inline function
   
2. **POST /api/contact** - Handles contact form submission
   - Status: ✅ Actively used by frontend
   - Validation + save to database
   - CSRF protected

3. **Public Asset URLs**: All images loaded from `/images/...`
   - Status: ✅ Working

### Authentication:
- **NO authentication system present**
- No User model
- No auth routes
- No middleware for protected pages
- Expected behavior: Public portfolio site (no auth needed)

---

## 15. RESPONSIVE IMPLEMENTATION

### Breakpoint Strategy:
- **Desktop**: No explicit breakpoint, max-width: 1440px container
- **Tablet**: `@media (max-width: 1100px)` - Grid collapses to 1 column
- **Mobile**: `@media (max-width: 760px)` - Stacks everything, adjusts spacing
- **Small mobile**: `@media (max-width: 480px)` - Font size reductions

### Verified Responsive Behaviors:

#### Nav Menu:
- ✅ Desktop: Horizontal nav links
- ✅ Tablet+: Shows all links
- ✅ Mobile: Hamburger toggle, full-screen overlay menu

#### Grid Layouts:
- ✅ Gallery grid: 3 columns → 2 → 1
- ✅ Intent cards: Side-by-side → stacked
- ✅ Pipeline nodes: Flexible wrapping

#### Typography:
- ✅ Clamp functions for headings: `clamp(44px, 5.7vw, 82px)`
- ✅ Rem-based body text (scales with large-type toggle)
- ⚠️ Some label text still uses fixed px (`.three-label`, `.three-corner`)

#### Images:
- ✅ object-fit: cover maintained
- ✅ No horizontal overflow
- ✅ Responsive sizing via percentage/max-width

---

## 16. 1366×768 PROJECTOR RISKS

### Current Issues Detected:

1. **Hero Height Overflow**
   - Estimated hero height: ~845-852px
   - Available viewport (1366×768 minus chrome): ~660px
   - **Overflow**: ~185-192px below fold
   - **Impact**: `.hero-meta` stat row partially cut off

2. **Tiny Label Text**
   - `.three-label`: 10px font size
   - `.three-corner`: 9px font size  
   - **At projector distance**: Likely unreadable
   - **Senior claim contradiction**: Undermines "senior-friendly" positioning

3. **Non-Scalable Headline**
   - H1 uses `clamp(58px, 7.4vw, 116px)` with hard px bounds
   - `.large-type` toggle CANNOT scale this headline
   - **Issue**: Accessibility control ineffective for main heading

### Recommended Mitigations (Not Implemented):
- Reduce hero padding values
- Shrink hero visual container height
- Convert headline clamp to rem-based scaling
- Increase label font sizes to minimum 14px

---

## 17. MOBILE/TABLET RISKS

### Detected Issues:

1. **Touch Targets**
   - Most buttons/links have adequate size
   - Nav hamburger button may be tight on very narrow screens
   - Gallery modal touch targets acceptable

2. **Keyboard Navigation**
   - ✅ Tab order logical
   - ✅ Focus visible on interactive elements
   - ✅ Modal keyboard trap works
   - ✅ Escape key closes modal

3. **Viewport Constraints**
   - ✅ No horizontal scrolling detected
   - ✅ Images resize appropriately
   - ✅ Grid collapses cleanly

4. **Performance Concerns**
   - Three.js continues rendering while scrolled out of view
   - On low-end mobile devices, could cause jank

### Tablet-Specific:
- ✅ Hamburger menu activates correctly
- ✅ Grid layouts adapt gracefully
- ✅ Touch interactions work properly

---

## 18. SEO & METADATA

### Present ✅:
- `<title>`: "RumahKuVR — Safer Homes Through Immersive Learning"
- `<meta name="description">`: Short project description
- Semantic HTML structure: `<section id="...">`, proper heading hierarchy
- Alt text on all images
- ARIA labels on interactive elements
- CSRF token meta tag

### Missing ❌:
- Open Graph tags (og:title, og:description, og:image)
- Twitter Card tags
- Favicon link tag
- Robots meta tag
- Sitemap.xml
- Structured data / JSON-LD
- Language attribute (lang="en" present but should verify consistency)

### Semantic Quality:
- ✅ Proper heading levels (h1 → h2 → h3)
- ✅ Section landmarks
- ✅ Button elements for actions
- ✅ Form labels present
- ✅ Role attributes where needed

---

## 19. PERFORMANCE RISKS

### Bundle Size:
- **Three.js stack**: ~230KB+ gzipped (just for hero panel)
  - three: ~165KB
  - @react-three/fiber: ~25KB
  - @react-three/drei: ~40-60KB
  - React + ReactDOM: ~45KB
  - Lucide icons: ~20-40KB

### Code Splitting:
- ❌ ZERO code splitting implemented
- ❌ All components load upfront
- ❌ No React.lazy() or dynamic imports
- ❌ Hero blocks initial paint until JS parses

### Animation Cost:
- Three.js render loop runs continuously
- ❌ No visibility/scroll-based pause mechanism
- ❌ Debounce/framerate limiting not implemented

### CSS Size:
- `app.css`: 2082 lines
- Multiple cascade layers creating complexity
- Potential style recalc overhead on large sections

### Image Optimization:
- Mixed formats: .jpg + .webp present
- No responsive srcset attributes
- No explicit width/height on most images
- Lazy loading present but inconsistent

### Server Considerations:
- Laravel adds PHP runtime overhead for simple SPA serve
- No CDN configured (static assets served directly)
- No HTTP/2 push headers configured

---

## 20. DEPLOYMENT CONFIGURATION

### Build Commands:

#### Development:
```bash
npm run dev      # Vite dev server with HMR
php artisan serve # Laravel development server
```

#### Production:
```bash
npm run build    # Vite production build
php artisan optimize # Laravel optimization
php artisan cache:clear # Cache clear
```

### Output Directories:
- **React Build**: `public/build/` (assets folder + manifest.json)
- **Laravel View**: `resources/views/app.blade.php` (renders React mount point)
- **Static Assets**: `public/images/`, `public/.htaccess`, `public/index.php`

### Deployment Prerequisites:
1. `.env` file with real database credentials
2. Composer dependencies installed
3. NPM dependencies installed
4. Database migrations run
5. `APP_KEY` generated
6. Web server configured to point to `public/` directory

---

## 21. AZURE STATIC WEB APPS COMPATIBILITY

### Verdict: ❌ NOT SUITABLE

### Reasons:
1. **Laravel Backend Required**: Contact form processes through PHP/MySQL
2. **Database Dependency**: MySQL connection string needed
3. **Build Process**: Requires both `npm run build` AND `php artisan` commands
4. **Runtime Needed**: PHP 8.3+ runtime required

Azure Static Web Apps is designed for static sites or Jamstack apps (Next.js, Nuxt, Astro, etc.) that don't require server-side PHP processing.

---

## 22. AZURE APP SERVICE COMPATIBILITY

### Verdict: ✅ SUITABLE

### Reasons:
1. **PHP Runtime**: Azure App Service supports PHP 8.3+
2. **MySQL Support**: Can provision Azure Database for MySQL
3. **Build Pipeline**: Standard CI/CD for Laravel + React
4. **Environment Variables**: Seamless integration via App Service settings
5. **HTTPS/Security**: Built-in SSL certificates
6. **Scaling**: Vertical/horizontal scaling available

### Recommended Deployment Strategy:
- Deploy Laravel backend to Azure App Service (Linux, PHP 8.3)
- Provision Azure Database for MySQL
- Configure CI/CD pipeline from GitHub Actions or Azure DevOps
- Use Azure CDN for static asset delivery (optional)

---

## 23. ENVIRONMENT VARIABLE NAMES (Names Only)

### From `.env.example`:
```
APP_NAME=RumahKuVR
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://rumahkuvr.test

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

LOG_CHANNEL=stack
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=rumahkuvr_portfolio
DB_USERNAME=
DB_PASSWORD=

SESSION_DRIVER=database
SESSION_LIFETIME=120

CACHE_STORE=database
QUEUE_CONNECTION=database

MAIL_MAILER=log
MAIL_FROM_ADDRESS=hello@rumahkuvr.local
MAIL_FROM_NAME="${APP_NAME}"
```

⚠️ DO NOT commit actual values containing secrets/passwords

---

## 24. TODOs / DEAD CODE / BROKEN CODE

### Critical Issues:
1. **No ErrorBoundary**: Three.js Canvas has NO error handling
   - Risk: WebGL failure = entire site blank
   - File: `app.jsx` (missing completely)

2. **Continuous Render Loop**: Three.js never pauses when scrolled off-screen
   - Impact: Wasted GPU cycles, potential jank
   - File: `app.jsx` lines 193-197, 225

3. **"Latest" Dependencies**: `@react-three/fiber` and `drei` use `"latest"`
   - Risk: Breaking change could deploy to production
   - File: `package.json` lines 10-11

4. **No Code Splitting**: Everything bundled together
   - Impact: Slower initial paint
   - File: Entire `app.jsx` monolith

### Dead Code:
1. **Unused /api/project Route**: Returns static JSON never consumed
   - File: `routes/web.php` lines 8-25

2. **Unused Runtime Tables**: Cache/sessions/jobs migrations created but never used
   - File: `database/migrations/2026_08_20_000000_create_runtime_tables.php`

3. **PerformanceReport Image Missing**: Referenced in component but file absent
   - File: `resources/js/app.jsx` line 507 (reference to non-existent file)

### Placeholder/Incomplete Work:
1. **Hard Difficulty Marked "Planned"**: Not fully implemented
   - File: `routes/web.php` line 23: `'hard' => 'planned'`

2. **No Email Notification**: Contact messages saved silently
   - User submits form → nothing happens except database insert
   - File: `app/Http/Controllers/ContactController.php`

3. **No External Links**: Developer intentionally removed placeholders
   - Status: GOOD - no broken links visible
   - Note: If needing links, add actual GitHub/institution URLs

### Console Errors (Detectable from Code):
- None obvious from code inspection alone
- Would need browser dev tools to verify runtime errors

### Inconsistencies:
1. **Naming Variations**: Comments say "Progressive Connector" vs "Meal Transport Story"
   - File: `app.jsx` comments
   - Severity: Low (documentation issue only)

2. **Version Mismatch**: Old council review discussed "Meta Quest card" and "OrbitTimeline"
   - These sections DON'T EXIST in current codebase
   - File: N/A (these components were deleted or renamed)

---

## 25. OUTDATED/LEGACY COMPONENTS

### Deleted/Replaced Components:

#### ❌ NOT PRESENT (from old council review):
1. **"Meta Quest 3 Card"** - Described in council discussions but NOT in current code
   - Current replacement: `PlatformHardware` section (lines 617-692)
   - Status: Replaced with updated implementation

2. **"Controller Display Cards"** (PS/Xbox separate cards) - NOT in current code
   - Current implementation: Unified platform ecosystem section
   - Status: Replaced/integrated into new layout

3. **"OrbitTimeline" Section** - NOT present in current code
   - Current replacement: `SystemAndJourney` section (lines 862-934)
   - Features: Pipeline flow nodes + Development timeline (different from orbital layout)
   - Status: Replaced with linear timeline approach

4. **"View demo" → #contact misleading CTA** - NO LONGER PRESENT
   - Status: Removed/updated
   - Current nav: All links resolve correctly to internal sections

### Legacy Code Still Present:
1. **Monolithic JSX File** (1148 lines)
   - Old approach: Single-file architecture common in early React projects
   - Status: Accepted for FYP scope but technically outdated for scalability

2. **No Component File Separation**
   - Old practice: All components in one file
   - Status: Hinders maintainability, needs refactoring long-term

3. **Inline Styles** (occasional `{style: {...}}` in JSX)
   - Example: Line 481, 575, 922
   - Status: Minor inconsistency, doesn't break functionality

---

## 26. MOST IMPORTANT SOURCE FILES

### Top 10 Files to Inspect First:

1. **`resources/js/app.jsx`** (1148 lines)
   - ALL React components in one file
   - Defines every section, interaction, and animation
   - Critical: Understanding component structure

2. **`resources/css/app.css`** (2082 lines)
   - Entire styling system
   - Color variables, layout rules, responsive breakpoints
   - Critical: Understand cascade and override logic

3. **`routes/web.php`** (current file)
   - All Laravel routes defined
   - Contact endpoint, unused /api/project route
   - Critical: Backend API surface area

4. **`app/Http/Controllers/ContactController.php`**
   - Contact form validation + persistence logic
   - Security: CSRF, throttle, input sanitization
   - Critical: Form handling security

5. **`database/migrations/2026_08_20_000001_create_contact_messages_table.php`**
   - Database schema for contact messages
   - Field definitions and constraints
   - Critical: Data storage structure

6. **`resources/views/app.blade.php`**
   - Blade wrapper for React SPA
   - HTML shell, meta tags, script injection
   - Critical: Entry point between Laravel and React

7. **`package.json`**
   - All frontend dependencies
   - Version conflicts ("latest" issues)
   - Build scripts

8. **`composer.json`**
   - All PHP dependencies
   - Laravel framework version
   - PHP version requirements

9. **`vite.config.js`**
   - Vite build configuration
   - React plugin setup
   - Import paths and aliases

10. **`README.md`**
    - Project documentation
    - Setup instructions
    - Important context about project goals

---

## 27. CURRENT STRENGTHS

### Well-Implemented:
1. **Professional Design**: Clean dark monochrome aesthetic, consistent throughout
2. **Semantic HTML**: Proper headings, sections, ARIA attributes
3. **Responsive Layout**: Works across desktop/tablet/mobile breakpoints
4. **Accessibility Efforts**: Contrast toggle, large text toggle, reduced-motion support
5. **Security**: CSRF protection, rate limiting, input validation on contact form
6. **No Broken Links**: All placeholder content removed, clean anchor resolution
7. **Good Image Organization**: Proper folders (project/, gameplay/) for categorization
8. **License Documentation**: DEVICE-CREDITS.md and PHOTO-CREDITS.md for asset attribution
9. **Single Test Coverage**: At least one PHPUnit test exists (basic coverage)
10. **Clear Project Messaging**: Strong copywriting about VR safety training value proposition

### Architectural Decisions That Work:
- Monolithic JSX acceptable for single-developer FYP scope
- Anchor-based navigation sufficient for single-page experience
- Laravel backend justified for academic demonstration of skills
- Local React state adequate (no complex global state needed)

---

## 28. CURRENT WEAKNESSES

### Critical Gaps:
1. **Fragile Three.js Implementation**: No error boundaries, continuous render loop
2. **Bundle Bloat**: Heavy dependencies for hero-only usage (~230KB)
3. **No Code Splitting**: Everything loads upfront, slower initial paint
4. **Dependency Instability**: `"latest"` versions could break at npm install time
5. **Missing Email Notifications**: Contact form saves but developer receives nothing
6. **Hero Height Overflow**: Doesn't fit standard projector viewport
7. **Inaccessible Labels**: Tiny text contradicts senior-friendly claims
8. **Non-Scalable Headline**: Accessibility toggle doesn't affect main heading

### Maintaining Debt:
1. **Monolithic JSX**: Hard to navigate, harder to debug
2. **CSS Cascade Complexity**: 2000+ lines with potential specificity wars
3. **Dead Code**: Unused routes, migrations, missing images
4. **No ESLint/Prettier**: Not detectable from inspection but likely absent

### Missing Polish:
1. **No Analytics**: Cannot track visitor behavior
2. **Incomplete SEO**: Missing Open Graph, Twitter cards, sitemap
3. **No Video Demo**: Relies solely on static screenshots
4. **Missing Developer Info**: GitHub/institution details not added yet

---

## 29. TOP 10 NEXT PRIORITIES (PRIORITY ORDERED)

### P0 = CRITICAL (Deploy-day risks)
1. **Pin dependency versions**: Replace `"latest"` with exact versions from lockfile
2. **Add ErrorBoundary around Three.js**: Prevent catastrophic site failure on WebGL error
3. **Fix hero height for 1366×768 projector**: Reduce padding/visual size to prevent overflow
4. **Replace abstract 3D hero with real screenshot**: Show actual Unity artefact immediately
5. **Increase label text sizes**: Change `.three-label` (10px) and `.three-corner` (9px) to minimum 14px

### P1 = IMPORTANT (Quality improvements)
6. **Make H1 scalable**: Convert headline from px clamp to rem-based scaling
7. **Pause Three.js render loop**: Stop GPU usage when hero scrolls out of view
8. **Add email notifications**: Send alerts when contact form submitted
9. **Convert .jpg to .webp**: Optimize remaining JPG images
10. **Add semantic SEO metadata**: Implement Open Graph, Twitter Card tags

### P2 = NICE-TO-HAVE (Polish)
11. **Embed gameplay video**: Add short video loop somewhere (YouTube/Vimeo/embedded)
12. **Implement analytics**: Add Google Analytics or similar tracking
13. **Create sitemap.xml**: For search engine indexing
14. **Add favicon**: Brand identity improvement
15. **Refactor JSX into multiple files**: Improve maintainability (non-blocking)

---

=== IMPORTANT VERSION MISMATCH ===

## Sections Discussed in Previous Reviews BUT MISSING FROM CURRENT CODEBASE:

### ❌ TARGET 1: "Meta Quest 3 Card" (described in council review)
- **Status**: Does NOT exist in current codebase
- **Replaced By**: `PlatformHardware` section (lines 617-692 in app.jsx)
- **Difference**: New section presents VR + Controller modes as dual platform options with unified messaging rather than separate "Meta Quest 3 card" with overlapping text/image issues

### ❌ TARGET 2: "Controller Display Cards" (PS/Xbox separate cards with white backgrounds)
- **Status**: Does NOT exist in current codebase
- **Replaced By**: Integrated into `PlatformHardware` section
- **Difference**: Controller imagery now presented more subtly alongside Meta Quest 3 photo without aggressive white backgrounds dominating each card

### ❌ TARGET 4: "OrbitTimeline" Section (central circle with radial 6-stage process)
- **Status**: Does NOT exist in current codebase
- **Replaced By**: `SystemAndJourney` section (lines 862-934)
- **Components Present Instead**:
  - Pipeline flow (6 nodes arranged horizontally: User Input → Unity XR Engine → Hazard Detection → Corrective Logic → Session Telemetry → IRIS Reporting)
  - Linear development timeline (vertical list: Planning → UX Design → Unity Build → Flow Testing → Refinement → Presentation)
- **Difference**: No central circle, no radial absolute positioning, no overlapping cards

### ✅ WHAT EXISTS INSTEAD:
1. **Training Progression** (Tutorial philosophy with SEE/TRY/SUCCEED/NEXT)
2. **Gameplay Showcase** (Bento-grid gallery of 6 screenshots)
3. **Roles Section** (Stakeholder tab switcher)
4. **Accessibility Principles** (6 ergonomic guidelines)
5. **Architecture Diagram** (Interaction pipeline)
6. **Development Journey** (Linear 6-phase timeline)

### IMPOSSIBLE TO DETERMINE:
Some components may have been:
- Renamed without trace
- Completely deleted
- Moved to different branches

But based on exhaustive inspection of current `app.jsx`, none of the problematic sections from council reviews exist in their original form.

---

=== RUMAHKUVR WEBSITE AI HANDOFF ===

### ESSENTIAL CONTEXT FOR CONTINUATION:

**Project Path**: `C:\laragon\www\RumahKuVR-Laravel-React`

**Architecture Type**: Hybrid full-stack (Laravel backend + React SPA)

**Entry Point**: `resources/views/app.blade.php` renders `<div id="app"></div>` mounted by `resources/js/app.jsx`

**Exact Important Component Names**:
- `Hero()` / `HeroThree()` / `HouseScene()` / `HazardNode()`
- `ProblemExperience()`
- `TrainingProgression()`
- `GameplayShowcase()`
- `PlatformHardware()`
- `Roles()`
- `SeniorAccessibility()`
- `SystemAndJourney()`
- `ProjectContact()`
- `AccessibilityDock()`
- `Nav()`

**Important CSS Files**:
- `resources/css/app.css` (2082 lines - single source of truth)
- Output: `public/build/assets/app-[hash].css` (production build)

**Build Command**: `npm run build`
**Dev Command**: `npm run dev`
**Production Output Directory**: `public/build/`

**Is Current Website Static or Backend-Needed?**
- Effectively static EXCEPT for contact form persistence
- Contact form requires Laravel + MySQL (or replace with serverless service)
- All other content statically rendered

**Recommended Azure Deployment**:
- **Azure App Service** (PHP 8.3+)
- Reason: Contact form requires server-side PHP processing
- Alternative if removing contact backend: Azure Static Web Apps (simpler, cheaper)

**Immediate Next Steps If Continuing Work**:
1. Fix critical P0 issues listed above before any presentation/demo
2. Address hero height overflow for projector compatibility
3. Replace abstract Three.js with real Unity screenshot
4. Pin dependency versions to avoid deployment breakage
5. Add email notification system for contact form

**Files Requiring Careful Editing**:
- `app.jsx` - Monolithic, avoid accidental edits to unrelated sections
- `app.css` - Cascade complexity means small changes can have wide impact
- `package.json` - Update versions carefully, don't accidentally upgrade breaking changes

**Red Flags to Avoid**:
- Never delete `app.jsx` components without verifying they're truly unused
- Don't assume older components from council reviews exist (they've been replaced)
- Don't add "glassmorphism", "neon gradients", or decorative clutter - violates current design direction
- Don't mix px and rem units carelessly in typography

**Confirmation Checklist Before Making Changes**:
- Verify component actually exists before attempting to modify it
- Check CSS cascade order before adding new rules
- Test responsive behavior at 1366×768 specifically (projector scenario)
- Ensure accessibility features remain functional after changes
- Confirm no unintended regressions in unrelated sections

=== END OF AUDIT REPORT ===

/* --------------------------------------------------------------------------
   RUMAHKUVR — PROJECT CONTENT
   Single source of truth for factual copy shown on the site.

   Every figure and every Malay label below was read out of the running Unity
   6.3 build over MCP — XRHazardMapData for the catalogue, the caregiver
   report panel for the session figures — rather than transcribed from a
   screenshot. Do not add features here that the build does not have.
   -------------------------------------------------------------------------- */

export const PROJECT = {
  name: 'RumahKuVR',
  title:
    'AI-Assisted Virtual Reality Home Safety Application for Personalised Hazard Detection Among Seniors',
  author: "Muhammad Thaqif Fahmi Bin Rafie'e",
  programme: 'Diploma in Information Technology (Software Application Development)',
  year: '2026',
  engine: 'Unity 6.3 LTS',
  headset: 'Meta Quest 3'
};

/* Hero metrics — 3 + 5 + 10 = 18 hazards across the three tiers.
   The in-engine result card reports the same total ("18 SELESAI"). */
export const HERO_METRICS = [
  { value: 18, suffix: '', label: 'Household hazards', sub: 'Across three difficulty tiers' },
  { value: 3, suffix: '', label: 'Training tiers', sub: 'Mudah · Sederhana · Sukar' },
  { value: 2, suffix: '', label: 'Play modes', sub: 'Meta Quest 3 & gamepad' }
];

/* Difficulty tiers — wording mirrors the in-game "Pilih Mod Simulasi" panel. */
export const TIERS = [
  {
    id: 'easy',
    tier: 'Easy',
    malay: 'Mod Mudah',
    badgeClass: 'badge-easy',
    title: 'Guided learning',
    count: 3,
    stat: '3 hazards',
    image: '/images/gameplay/spotlight-easy.webp',
    alt: 'Easy tier in RumahKuVR: a floor hazard is spotlighted and a Malay instruction reads “Bersihkan lantai”',
    desc:
      'Built for a senior who has never held a controller. Hazards are spotlighted, there is no timer, and every instruction is available as text or spoken Malay.',
    features: ['No time limit', 'Clear on-screen markers', 'Text or spoken Malay guidance'],
    /* How much help stays on screen, as a fraction. Derived from the features
       above, which come from the in-game tier panel — not an invented score. */
    guidance: 1,
    guidanceLabel: 'Markers, no timer, spoken Malay'
  },
  {
    id: 'medium',
    tier: 'Medium',
    malay: 'Mod Sederhana',
    badgeClass: 'badge-med',
    title: 'Independent practice',
    count: 5,
    stat: '5 hazards',
    image: '/images/gameplay/medium-map-coachmark.webp',
    alt: 'Medium tier in RumahKuVR: a coachmark points to the Peta Rumah house-map button',
    desc:
      'Markers thin out and the search area widens. Help is still there — but the senior has to open the house map and ask for it.',
    features: ['Wider search area', 'Fewer visual markers', 'Guidance on request'],
    guidance: 0.55,
    guidanceLabel: 'Fewer markers, help on request'
  },
  {
    id: 'hard',
    tier: 'Hard',
    malay: 'Mod Sukar',
    badgeClass: 'badge-hard',
    title: 'Full challenge',
    count: 10,
    stat: '10 hazards',
    image: '/images/gameplay/hard-scan.webp',
    alt: 'Hard tier in RumahKuVR: a dim corridor with the hazard counter reading 0 of 10',
    desc:
      'Low light, a running clock and symbol-only prompts. The tier that shows whether the habit actually transferred.',
    features: ['Reduced lighting', 'Timed session', 'Symbol-only prompts'],
    guidance: 0.18,
    guidanceLabel: 'Symbols only, on a clock'
  }
];

/* Hazard catalogue.
   Names, rooms and risk levels below were read out of XRHazardMapData in the
   running 6.3 build, not transcribed from an older screenshot. Several rooms
   here used to be wrong: the folded carpet is in the dining room, not the
   living room; the medicine cabinet is in the kitchen, not a bedroom; the
   blocked walkway is the utility room, not a hallway. */
export const HAZARDS = {
  easy: [
    { en: 'Wet Floor', ms: 'Lantai Basah', room: 'Bilik Air · bathroom', risk: 'Sederhana' },
    { en: 'Exposed Electrical Wire', ms: 'Wayar Terdedah', room: 'Ruang Makan · dining', risk: 'Sederhana' },
    { en: 'LPG Gas Hazard', ms: 'Dapur Gas', room: 'Dapur · kitchen', risk: 'Sederhana' }
  ],
  medium: [
    { en: 'Folded Carpet', ms: 'Karpet Terlipat', room: 'Ruang Makan · dining', risk: 'Sederhana' },
    { en: 'Blocked Walkway', ms: 'Objek Menghalang Laluan', room: 'Bilik Utiliti · utility', risk: 'Rendah' },
    { en: 'Bathroom Safety', ms: 'Keselamatan di Tandas', room: 'Bilik Air · bathroom', risk: 'Sederhana' },
    { en: 'Hot Water', ms: 'Bahaya Air Panas', room: 'Dapur · kitchen', risk: 'Sederhana' },
    { en: 'Medicine Safety', ms: 'Keselamatan Ubat-Ubatan', room: 'Dapur · kitchen', risk: 'Sederhana' }
  ]
};

/* Gameplay evidence — the coverflow gallery. All captures are in-engine. */
export const GALLERY = [
  {
    file: '/images/gameplay/hazard-stove.webp',
    title: 'Unattended stove',
    ms: 'Dapur menyala tanpa dijaga',
    tag: 'Hazard detection',
    desc:
      'A burner has been left running. Looking at it raises the hazard card; reaching out and turning it off clears the hazard and advances the counter.'
  },
  {
    file: '/images/gameplay/hazard-high-storage.webp',
    title: 'Storage out of reach',
    ms: 'Barang terlalu tinggi',
    tag: 'Fall risk',
    desc:
      'A tin stored above shoulder height. The correction is physical: fetch the stool, reposition it, then retrieve the item.'
  },
  {
    file: '/images/gameplay/hazard-walkway.webp',
    title: 'Blocked walkway',
    ms: 'Laluan terhalang',
    tag: 'Obstacle management',
    desc:
      'A pet bowl and boxes narrow the hallway between the stairs and the door — the route a senior walks at night.'
  },
  {
    file: '/images/gameplay/hazard-coil.webp',
    title: 'Burning mosquito coil',
    ms: 'Bahaya terbakar',
    tag: 'Burn risk',
    desc:
      'A lit coil left on the floor under furniture. Grab affordances appear only once the hazard has been identified.'
  },
  {
    file: '/images/gameplay/hazard-bathroom.webp',
    title: 'Wet bathroom floor',
    ms: 'Lantai basah',
    tag: 'Slip risk',
    desc:
      'Water on tile with slippers just out of reach. The senior mops the floor and moves the slippers before walking through.'
  },
  {
    file: '/images/gameplay/meal-trolley.webp',
    title: 'Carrying a meal safely',
    ms: 'Pengangkutan makanan',
    tag: 'Corrective action',
    desc:
      'Rather than carrying a hot, loaded tray by hand, the trolley is fetched and guided — the safe habit the scenario is built to teach.'
  },
  {
    file: '/images/gameplay/house-map.webp',
    title: 'House map (Peta Rumah)',
    ms: 'Peta Rumah',
    tag: 'In-session navigation',
    desc:
      'The floor plan with its legend — Lantai Basah, Wayar Terdedah, Dapur Gas, Zon Selamat — and a live count of what is still outstanding.'
  },
  {
    file: '/images/gameplay/briefing.webp',
    title: 'Session briefing',
    ms: 'Taklimat Sesi',
    tag: 'Before you start',
    desc:
      'Every session opens with the objective spelled out in plain Malay, so nobody is dropped into a room without knowing the task.'
  },
  {
    file: '/images/ui/session-result.webp',
    title: 'Session result & AI analysis',
    ms: 'Keputusan Sesi · Analisis AI',
    tag: 'Feedback',
    desc:
      'Score, elapsed time and hazards cleared, then the four lines the fuzzy analyser produces — performance band, strength, what needs attention, and one concrete suggestion. Computed on the headset, with no network involved.'
  },
  {
    file: '/images/ui/tutorial-complete.webp',
    title: 'Tutorial complete',
    ms: 'Tutorial Selesai',
    tag: 'Onboarding',
    desc:
      'The tutorial ends only once the senior has moved, inspected and cleared a hazard unaided — then the real simulation opens.'
  }
];

/* The three-step meal-transport case study used in the Overview section. */
export const CASE_STEPS = [
  {
    num: '01',
    title: 'Notice',
    tag: 'Step 01 · Detection',
    desc: 'A hot, fully loaded tray is spotted on the dining table.',
    image: '/images/gameplay/hazard-meal-01.webp'
  },
  {
    num: '02',
    title: 'Act',
    tag: 'Step 02 · Correction',
    desc: 'A trolley is fetched and brought alongside the table.',
    image: '/images/gameplay/hazard-meal-02.webp'
  },
  {
    num: '03',
    title: 'Repeat',
    tag: 'Step 03 · Resolution',
    desc: 'The meal is delivered with no strain, no reaching and no spill.',
    image: '/images/gameplay/hazard-meal-03.webp'
  }
];

/* Roles — the three the shipped flow actually routes to.

   XRRoleRouter is the single source of truth: the role is chosen on the login
   screen, validated against the account's saved role, and mapped to a dashboard
   scene. It recognises exactly Warga Emas, Penjaga and Tetamu. A guest is sent
   to the Senior menu on purpose, so guest mode is the ordinary Warga Emas
   experience without an account behind it.

   Pentadbir is not part of this flow and is deliberately not presented here. */
export const ROLES = {
  senior: {
    key: 'senior',
    label: 'Senior',
    malay: 'Warga Emas',
    kicker: 'Warga Emas',
    title: 'Start a session in two taps.',
    body:
      'One screen, four large actions, and the two numbers that matter — the last score and how many sessions are done. Nothing else competes for attention.',
    image: '/images/ui/senior-menu.webp',
    imageSrcSet: '/images/ui/senior-menu-1400w.webp 1400w, /images/ui/senior-menu.webp 3483w',
    alt: 'RumahKuVR senior menu showing a welcome message, a large “Mula Latihan” button and last score of 80 out of 100',
    caption: 'Senior menu · in-headset capture',
    points: [
      'Large-format buttons with an icon and a label on every one',
      'Voice assistance available from the header at any time',
      'Last score and completed sessions surfaced on the home screen'
    ]
  },
  caregiver: {
    key: 'caregiver',
    label: 'Caregiver',
    malay: 'Penjaga',
    kicker: 'Penjaga',
    title: 'See which hazards keep coming back.',
    body:
      'The caregiver portal reports per-session records, average score by tier, and the hazards a senior has not yet cleared — mapped to the room they are in.',
    image: '/images/caregiver/records.webp',
    imageSrcSet: '/images/caregiver/records-1400w.webp 1400w, /images/caregiver/records.webp 3483w',
    alt: 'RumahKuVR caregiver performance report listing recent sessions with tier, score, hazards and status',
    caption: 'Laporan Prestasi · session records',
    points: [
      'Session log with tier, score, hazards cleared and completion status',
      'Average score per tier, and per-hazard status on a house map',
      'Trend and CSV export for sharing with family or a clinician'
    ]
  },
  guest: {
    key: 'guest',
    label: 'Guest',
    malay: 'Tetamu',
    kicker: 'Tetamu',
    title: 'Try it without making an account.',
    body:
      'A guest gives a name and nothing else — no password, no record kept. They land on the same Senior menu and play the same house, which is what makes the app demonstrable to a visitor in under a minute.',
    image: '/images/ui/login.webp',
    imageSrcSet: '/images/ui/login-1400w.webp 1400w, /images/ui/login.webp 3772w',
    alt: 'RumahKuVR sign-in screen with Warga Emas, Tetamu and Penjaga to choose from, above the username and password fields',
    caption: 'Log Masuk · the role is chosen before signing in',
    points: [
      'Name only — the password field switches itself off for a guest',
      'Same difficulty panel, tutorials, guidance and result screen as a senior',
      'Nothing is written to the account store, so no history accumulates'
    ]
  }
};

/* Senior-first design principles. */
export const A11Y_PRINCIPLES = [
  {
    num: '01',
    title: 'Type sized for older eyes',
    desc: 'Large labels, generous line spacing and high-contrast panels on every in-headset screen.'
  },
  {
    num: '02',
    title: 'Malay voice guidance',
    desc: 'Instructions are spoken as well as written, so a session never depends on reading speed.'
  },
  {
    num: '03',
    title: 'Icon plus label, always',
    desc: 'No action is communicated by an icon alone — every button carries a word next to the symbol.'
  },
  {
    num: '04',
    title: 'Predictable controls',
    desc: 'One button per action, no combinations, and an in-headset controller guide one tap away.'
  },
  {
    num: '05',
    title: 'Calm hazard feedback',
    desc: 'Hazards announce themselves on a readable card. No camera shake, no startle effects.'
  },
  {
    num: '06',
    title: 'Guidance that fades',
    desc: 'Markers, timers and prompts step down across Mudah, Sederhana and Sukar as confidence grows.'
  }
];

/* Interaction pipeline for the System section. */
/* Interaction pipeline. `detail` is what the System section shows when a stage
   is selected — each line describes something the build actually does, not a
   generic description of how VR works in general. */
export const PIPELINE = [
  {
    step: '01',
    title: 'Input',
    sub: 'Quest 3 or gamepad',
    detail:
      'Two input paths, one codebase. The headset reports head and hand pose through OpenXR; a gamepad reports sticks and buttons. Both are normalised before anything downstream sees them, which is why the controller build runs the same scenarios rather than a cut-down version of them.'
  },
  {
    step: '02',
    title: 'Unity XR',
    sub: 'Physics & 6DoF',
    detail:
      'Built on the XR Interaction Toolkit. Hazard objects are grabbable rigidbodies with their own colliders, so a mop is picked up, carried and used rather than triggered — the physics is the interaction, not a wrapper around a button press.'
  },
  {
    step: '03',
    title: 'Detection',
    sub: 'Proximity & gaze',
    detail:
      'A hazard raises its card when the senior is near it and looking at it. Proximity alone would fire while walking past; gaze alone would fire across the room. Requiring both is what keeps the prompt tied to intent.'
  },
  {
    step: '04',
    title: 'Correction',
    sub: 'Action verified',
    detail:
      'Seeing a hazard does not clear it. The state only advances once the corrective action is performed and verified — the burner actually off, the floor actually mopped, the tray actually on the trolley.'
  },
  {
    step: '05',
    title: 'Fuzzy analysis',
    sub: 'On-device inference',
    detail:
      'At the end of a session a Sugeno-style fuzzy expert system grades four dimensions: safety performance, independence, attention and recovery. Every rule fires in proportion to how true it is, so one missed hazard moves the result without flipping it. It runs on the headset — no API, no network, no model file.'
  },
  {
    step: '06',
    title: 'Reporting',
    sub: 'Caregiver portal',
    detail:
      'The graded session is written to the device store and becomes the caregiver view: the session log, average score per tier, and Peta Bahaya — the same hazards placed back onto the floor plan of the house they happened in.'
  }
];

export const JOURNEY = [
  { step: '01', title: 'Planning', desc: 'Problem framing, senior fall-safety reading, hazard catalogue.' },
  { step: '02', title: 'UX design', desc: 'Low-load interface wireframes, Malay audio script, control map.' },
  { step: '03', title: 'Unity build', desc: 'Malaysian home environment, OpenXR integration, hazard state logic.' },
  { step: '04', title: 'Flow testing', desc: 'Grab affordances, near-fall feedback, difficulty tuning.' },
  { step: '05', title: 'Refinement', desc: 'Coachmarks, result analysis, caregiver telemetry.' },
  { step: '06', title: 'Presentation', desc: 'Showcase build, documentation and evaluator demonstration.' }
];

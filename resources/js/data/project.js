/* --------------------------------------------------------------------------
   RUMAHKUVR — PROJECT CONTENT
   Single source of truth for factual copy shown on the site.

   Gameplay figures and capture labels below were read out of the running Unity
   6.3 build over MCP — XRHazardMapData for the catalogue, the caregiver
   report panel for the session figures — rather than transcribed from a
   screenshot. Three-mode content follows the current system brief; SATRIA
   feedback content follows the existing Laravel service. Do not invent captures.
   -------------------------------------------------------------------------- */

export const PROJECT = {
  name: 'RumahKuVR',
  title:
    'AI-Driven Virtual Reality Home Safety Application for Personalised Performance Analysis Among Seniors',
  author: "Muhammad Thaqif Fahmi Bin Rafie'e, Muhammad Hakimi bin Shah Buddin, Muhammad Faiq Azim Bin Mohamad Zin ",
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
  { value: 3, suffix: '', label: 'Play modes', sub: 'Meta Quest 3 · gamepad · Android tablet' }
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
    image: '/images/gameplay/tier-easy.webp',
    alt: 'Easy tier in RumahKuVR: the wet bathroom floor has just been found, the slipper mat is ringed and the instruction reads “Pakai selipar.”, with the counter at 0 of 3',
    desc:
      'Built for a senior who has never held a controller. Hazards are spotlighted, there is no timer, and every instruction is available as text or spoken Malay.',
    features: ['No time limit', 'Clear on-screen markers', 'Text or spoken Malay guidance'],
    /* How much help stays on screen. Three named steps of one ladder, read
       straight off the features above.

       These were printed as 100 / 55 / 18 per cent, which claimed a
       measurement nothing in the build produces — the tier panel offers no
       guidance figure and no instrument reports one. `guidanceStep` sizes the
       legend bar and nothing else; the words are what the reader is given. */
    guidanceLevel: 'Full guidance',
    guidanceStep: 3,
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
    image: '/images/gameplay/tier-medium.webp',
    alt: 'Medium tier in RumahKuVR: the medicine station with three labelled boxes, one bottle ringed for inspection, and the counter at 3 of 5',
    desc:
      'Markers thin out and the search area widens. Text or spoken Malay guidance is still there, and the house map is one press away in the Tetapan menu.',
    features: ['Wider search area', 'Fewer visual markers', 'Text or spoken guidance'],
    guidanceLevel: 'Reduced guidance',
    guidanceStep: 2,
    guidanceLabel: 'Fewer markers, text or spoken help'
  },
  {
    id: 'hard',
    tier: 'Hard',
    malay: 'Mod Sukar',
    badgeClass: 'badge-hard',
    title: 'Full challenge',
    count: 10,
    stat: '10 hazards',
    image: '/images/gameplay/tier-hard.webp',
    alt: 'Hard tier in RumahKuVR: a clothes rack blocking the back path, prompted only by symbols (a B button chip and a garment icon), with the counter at 2 of 10 and the countdown running',
    desc:
      'Low light, a running clock and symbol-only prompts. The tier that shows whether the habit actually transferred.',
    features: ['Reduced lighting', 'Timed session', 'Symbol-only prompts'],
    guidanceLevel: 'Minimal prompts',
    guidanceStep: 1,
    guidanceLabel: 'Symbols only, on a clock'
  }
];

/* Hazard catalogue.

   SCOPE: eighteen hazards are modelled across the house — 3 in Mudah, 5 in
   Sederhana, 10 in Sukar. The two groups below are the Mudah and Sederhana
   sets, eight in total. The ten Sukar hazards are deliberately not listed:
   that tier is the one that tests whether the habit transferred, and printing
   its answer sheet on a public page would give it away.

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

/* Gameplay evidence — the coverflow gallery. Every capture is from 2026-09-27
   Controller Mode play as the qp account in the running Unity 6.3 build, with
   the in-game FPS readout switched off. The result card is from the recorded
   Sederhana session; the tutorial card is practice mode and never recorded. */
export const GALLERY = [
  {
    file: '/images/gameplay/wetfloor-cleared.webp',
    title: 'Wet floor, mopped dry',
    ms: 'Lantai basah',
    tag: 'Hazard correction',
    desc:
      'The puddle is gone and Bahaya reads 1/3. Before leaving the bathroom the senior is asked to put the slippers back on their mat: “Tanggalkan selipar dan letakkan semula di tempat asal.”'
  },
  {
    file: '/images/gameplay/gas-stove.webp',
    title: 'Gas stove left on',
    ms: 'Dapur gas',
    tag: 'Hazard recognition',
    desc:
      'Inspecting the stove rings every knob and gives the first step in Malay: “Tutup semua tombol dapur.” The regulator and the window come after, in that order.'
  },
  {
    file: '/images/gameplay/walkway-blocked.webp',
    title: 'Blocked walkway',
    ms: 'Objek menghalang laluan',
    tag: 'Obstacle management',
    desc:
      'A box, a basket and a stool across the corridor in Mod Sederhana. Each one is picked up and set down in the marked storage area beside the bench.'
  },
  {
    file: '/images/gameplay/carpet-grip.webp',
    title: 'Folded carpet',
    ms: 'Karpet terlipat',
    tag: 'Corrective action',
    desc:
      'The hand takes the lifted edge, and holding RT while stepping back pulls the rug flat. Walking over the fold instead sets off a near-stumble.'
  },
  {
    file: '/images/gameplay/kettle.webp',
    title: 'Hot kettle',
    ms: 'Bahaya air panas',
    tag: 'Burn risk',
    desc:
      'A steaming kettle on the worktop. The panel says what comes first: “Matikan suis cerek.” Then the cloth, then carrying it to the heat-safe mat.'
  },
  {
    file: '/images/gameplay/medicine-sorted.webp',
    title: 'Medicines sorted',
    ms: 'Keselamatan ubat-ubatan',
    tag: 'Hazard correction',
    desc:
      'Each bottle is inspected, then placed in the right box: still in use, expired for return, or unlabelled for the caregiver to check. “Semua ubat telah disimpan dengan selamat.”'
  },
  {
    file: '/images/gameplay/all-cleared.webp',
    title: 'All five cleared',
    ms: 'Semua bahaya selesai',
    tag: 'Session progress',
    desc:
      'Bahaya 5/5, progress at 100% and the save unlocked. The last step is walking to Zon Selamat, which ends the session and writes the record.'
  },
  {
    file: '/images/gameplay/house-map.webp',
    title: 'House map (Peta Rumah)',
    ms: 'Peta Rumah',
    tag: 'In-session navigation',
    desc:
      'Opened from the Tetapan menu mid-session. In Mod Sukar a hazard only appears on the plan once it has been found: here 3 of 10 found and 2 of 10 done.'
  },
  {
    file: '/images/ui/session-result.webp',
    title: 'Session Result & SATRIA Performance Analysis',
    ms: 'Keputusan Sesi · Analisis Prestasi',
    tag: 'Feedback',
    desc:
      'A finished Sederhana run: 100/100 in 12:39 with 5 of 5 cleared, followed by Prestasi, Kekuatan, Perlu Diperbaiki and Cadangan. This earlier capture shows local rule-based feedback; SATRIA AI 2.0 can personalise the structured results through Gemini after analysis.'
  },
  {
    file: '/images/ui/tutorial-controls.webp',
    title: 'Tutorial controls card',
    ms: 'Panduan Kawalan',
    tag: 'Onboarding',
    desc:
      'The tutorial opens by naming every button for the pad the player chose, and says up front that it is practice: “markah anda tidak direkodkan”.'
  }
];

/* The three-step exposed-wire case study used in the Overview section, from
   the same Mudah session as the gallery. */
export const CASE_STEPS = [
  {
    num: '01',
    title: 'Notice',
    tag: 'Step 01 · Recognition',
    desc: 'A live wire by the dining-room socket. Inspecting it gives one instruction: take the wooden stick.',
    image: '/images/gameplay/case-wire-01.webp'
  },
  {
    num: '02',
    title: 'Act',
    tag: 'Step 02 · Correction',
    desc: 'The switch is turned off with the stick, never by hand: “Matikan suis menggunakan kayu.”',
    image: '/images/gameplay/case-wire-02.webp'
  },
  {
    num: '03',
    title: 'Repeat',
    tag: 'Step 03 · Resolution',
    desc: 'Power off and the safety cover fitted. The counter moves to 2 of 3 and the next hazard is named.',
    image: '/images/gameplay/case-wire-03.webp'
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
      'One screen, four large actions, and the two numbers that matter: the last score and how many sessions are done. Nothing else competes for attention.',
    image: '/images/ui/senior-menu.webp',
    imageSrcSet: '/images/ui/senior-menu-1400w.webp 1400w, /images/ui/senior-menu.webp 3483w',
    alt: 'RumahKuVR senior menu showing a welcome message, a large “Mula Latihan” button, a last score of 18 out of 100 and 4 sessions completed',
    caption: 'Senior menu · in-headset capture',
    /* These used to be the three accessibility claims — big buttons, voice
       help, surfaced score — which the Senior-first section immediately below
       now makes with the same capture and its labels pointed at. Repeating
       them here said the same thing twice about one picture. They are about
       the role now: what signing in as Warga Emas actually gets you. */
    points: [
      'Signs in as Warga Emas and lands straight on this menu, with no dashboard in between',
      'Mula Latihan, then a difficulty: a session is two taps from here',
      'Score and session count are read from the device store, so they survive a restart'
    ]
  },
  caregiver: {
    key: 'caregiver',
    label: 'Caregiver',
    malay: 'Penjaga',
    kicker: 'Penjaga',
    title: 'See which hazards keep coming back.',
    body:
      'Laporan Prestasi is the caregiver view: saved session scores, averages per difficulty, a room-by-room hazard map and SATRIA AI 2.0 personalised performance feedback based on gameplay results.',
    image: '/images/caregiver/progress-graph.webp',
    imageSrcSet:
      '/images/caregiver/progress-graph-1400w.webp 1400w, /images/caregiver/progress-graph.webp 3483w',
    alt:
      'Graf Kemajuan Markah in the RumahKuVR caregiver portal: a line chart of four saved sessions, three at 100 and the last, a timed-out Sukar run, at 18',
    caption: 'Graf Kemajuan Markah · four saved sessions',
    points: [
      'Every saved session plotted, so a bad run is visible rather than averaged away',
      'Average score per tier, and each hazard pinned to the room it was found in',
      'Eksport CSV for sharing with family or a clinician'
    ]
  },
  guest: {
    key: 'guest',
    label: 'Guest',
    malay: 'Tetamu',
    kicker: 'Tetamu',
    title: 'Try it without making an account.',
    body:
      'A guest gives only a name. No password is required and no record is kept. They land on the same Senior menu and play the same house, which is what makes the app demonstrable to a visitor in under a minute.',
    points: [
      'Name only: the password field switches itself off for a guest',
      'Same difficulty panel, tutorials, guidance and result screen as a senior',
      'Nothing is written to the account store, so no history accumulates'
    ]
  }
};

/* Senior-first design, annotated on the screen that shows it.

   These were six written principles sitting beside a picture. Each one is now
   pinned to something a reader can point at in the Warga Emas menu capture
   (/images/ui/senior-menu.webp) — `find` is the on-screen Malay label, so the
   claim and the evidence are the same object. Nothing is listed here that is
   not visible in that single frame. */
export const SENIOR_DESIGN_NOTES = [
  {
    num: '01',
    find: 'Mula Latihan',
    title: 'One action is obviously the main one',
    desc:
      'The button that starts a session is the largest element on the screen and carries its own instruction: “Tekan untuk memulakan”. Nothing else competes for it.'
  },
  {
    num: '02',
    find: '[ A ] Buka MULA LATIHAN',
    title: 'The buttons are written on the screen',
    desc:
      'A line under the menu names the controls that work here: the left stick or d-pad to move, A to open Mula Latihan, B to go back. Nobody has to remember the mapping.'
  },
  {
    num: '03',
    find: 'Icon + word',
    title: 'No action is an icon on its own',
    desc:
      'Lihat Kemajuan, Bantuan, Panduan Alat, Log Keluar and Keluar each pair a symbol with the word for it. A senior never has to decode a glyph.'
  },
  {
    num: '04',
    find: 'Panduan Alat',
    title: 'The controller guide is one tap away',
    desc:
      'The button mapping is reachable from the menu rather than buried in settings. It is the same guide the Platform section shows for both pad layouts.'
  },
  {
    num: '05',
    find: 'Skor Terakhir · Sesi Selesai',
    title: 'Two numbers, and no more',
    desc:
      'Last score and sessions completed are surfaced on the home screen. Everything else a caregiver might want lives in the portal, not here.'
  }
];

/* Performance pipeline. Core scoring and fuzzy analysis belong to the game;
   Gemini feedback uses the existing Laravel SATRIA endpoint after analysis.
   `detail` appears when the corresponding stage is selected. */
export const PIPELINE = [
  {
    step: '01',
    title: 'Gameplay Session',
    sub: 'VR · controller · tablet',
    detail:
      'Three input methods access the same training: Meta Quest 3, a gamepad or an Android touchscreen. The player recognises hazards and performs the corrective actions. The system records these actions for performance analysis.'
  },
  {
    step: '02',
    title: 'Gameplay Metrics',
    sub: 'Recorded session results',
    detail:
      'Session data includes completed and unfinished hazards, mistakes, retries, completion time and difficulty. These structured results describe what the player did; hazard recognition remains the player’s task.'
  },
  {
    step: '03',
    title: 'Deterministic Scoring',
    sub: 'Fixed gameplay rules',
    detail:
      'The game calculates the score and verifies hazard completion using its existing rules. Mudah, Sederhana and Sukar retain the same hazards, timers and completion requirements across all three modes. The score is calculated before generative feedback.'
  },
  {
    step: '04',
    title: 'Fuzzy Logic Analysis',
    sub: 'Four performance dimensions',
    detail:
      'The local Sugeno-style fuzzy expert system evaluates Safety Performance, Independence, Attention and Recovery using the existing weighted rules. It produces structured performance results and rule-based feedback for SATRIA. Session pace has a small influence on Attention.'
  },
  {
    step: '05',
    title: 'Gemini Generative AI',
    sub: 'Optional online feedback',
    detail:
      'After scoring and fuzzy analysis, the Laravel service can send validated session metrics and fuzzy summaries to Gemini for concise personalised Bahasa Melayu feedback. Gemini describes the supplied results; player recognition, gameplay control and scoring stay with the game.'
  },
  {
    step: '06',
    title: 'SATRIA Personalised Feedback',
    sub: 'Maklum Balas Peribadi',
    detail:
      'SATRIA AI 2.0 presents performance feedback for the player and caregiver. When Gemini is unavailable or times out, the game retains its existing fuzzy/rule-based feedback. Core gameplay, scoring and local analysis continue independently of the online feedback service.'
  }
];

/* Development journey.

   These were six generic phase names — Planning, UX design, Unity build — that
   would fit any project. Each one is a decision this build actually made and
   that something in the repository still shows: the hazard asset, an older
   caregiver record, a capture in the gallery, or a screen in the portal. */
export const JOURNEY = [
  {
    step: '01',
    title: 'One house, not a lab',
    desc:
      'The environment was built as a single kampung home with named rooms (Ruang Tamu, Ruang Makan, Bilik Air, Bilik Utiliti, Dapur), so a hazard could be described by where it lives rather than by a level number.'
  },
  {
    step: '02',
    title: 'Three input paths, one scenario set',
    desc:
      'Mod VR, Mod Kawalan and Mod Tablet / Skrin Sentuh offer alternative input methods for the same house, hazards, difficulty tiers, scoring and gameplay objectives.'
  },
  {
    step: '03',
    title: 'Hard grew from eight hazards to ten',
    desc:
      'Older saved sessions still show Sukar scored out of 8. The tier was extended to ten, including the bedside lamp, the indoor stairs, the heater by the curtain and the unstable chair. XRHazardMapData now holds 3 + 5 + 10.'
  },
  {
    step: '04',
    title: 'Correction had to be physical',
    desc:
      'Looking at a hazard stopped being enough to clear it. The state only advances once the action is performed and verified, which is why the meal scenario ends with a trolley being fetched rather than a button labelled “fix”.'
  },
  {
    step: '05',
    title: 'Hazard rooms were re-read from the asset',
    desc:
      'Several locations were wrong in earlier documentation. The folded carpet is in the dining room, the medicine cabinet is in the kitchen, the blocked walkway is the utility room. The catalogue on this page is generated from XRHazardMapData, not from a screenshot.'
  },
  {
    step: '06',
    title: 'The report had to answer “which room”',
    desc:
      'A score alone did not tell a family anything actionable. Peta Bahaya pins every hazard to the floor plan, and selecting one opens its room, risk level, status and recommendation.'
  }
];

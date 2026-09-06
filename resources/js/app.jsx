import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Accessibility, ArrowRight, ArrowUpRight, Boxes, Check, ClipboardList, Cpu,
  Gamepad2, GraduationCap, Hand, Layers, Menu, MonitorPlay, Moon, Pause, Play,
  Radar, ScanEye, ShieldAlert, ShieldCheck, Sun, Timer, Volume2, X
} from 'lucide-react';

import {
  CASE_STEPS, GALLERY, HAZARDS, HERO_METRICS, JOURNEY, PIPELINE,
  PROJECT, ROLES, SENIOR_DESIGN_NOTES, TIERS
} from './data/project';

import {
  useActiveSection, useCanHover, useInView, useMagnetic, useParallax, usePrefersReducedMotion,
  useScrollProgress, useScrollReveal, useTilt
} from './lib/motion';

import { markReady as markIntroReady } from './lib/intro';

import { Counter, Figure, SectionHead, SplitText, TiltCard, ZoomTrigger } from './components/primitives';
import Coverflow from './components/Coverflow';
import DemoReel from './components/DemoReel';
import Lightbox from './components/Lightbox';

/* Reading order, and the order the page renders in.

   The walkthrough used to sit fifth, four screens down, which meant the one
   piece of evidence that answers "what is this actually like" was reached
   only by visitors who had already decided to keep reading. It is second now:
   the hero makes the claim, the clip shows the house, and every section after
   it is read by somebody who has already seen the thing being described. */
const NAV_LINKS = [
  ['home', 'Home'],
  ['demo', 'Demo'],
  ['overview', 'Overview'],
  ['training', 'Training'],
  ['gameplay', 'Gameplay'],
  ['platform', 'Platform'],
  ['roles', 'Roles'],
  ['system', 'System'],
  ['contact', 'Contact']
];

const NAV_IDS = NAV_LINKS.map(([id]) => id);

/* --------------------------------------------------------------------------
   THEME
   -------------------------------------------------------------------------- */
function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('rumahkuvr-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('rumahkuvr-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f6f7f9' : '#08090b');
  }, [theme]);

  return { theme, toggleTheme: () => setTheme(t => (t === 'dark' ? 'light' : 'dark')) };
}

/* --------------------------------------------------------------------------
   NAVIGATION

   The active pill is a single element that slides between links. Its position
   is measured from the live DOM rather than assumed, so it stays correct after
   a font swap, a resize or a language change.
   -------------------------------------------------------------------------- */
function Nav({ theme, toggleTheme }) {
  const active = useActiveSection(NAV_IDS);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const progressRef = useRef(null);
  const menuRef = useRef(null);
  const linkRefs = useRef({});
  useScrollProgress(progressRef);

  const moveIndicator = useCallback(() => {
    const menu = menuRef.current;
    const link = linkRefs.current[active];
    if (!menu || !link) return;
    menu.style.setProperty('--pill-x', `${link.offsetLeft}px`);
    menu.style.setProperty('--pill-w', `${link.offsetWidth}px`);
    menu.classList.add('has-pill');
  }, [active]);

  useLayoutEffect(moveIndicator, [moveIndicator]);

  useEffect(() => {
    const onResize = () => {
      moveIndicator();
      setOpen(false);
    };
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    document.fonts?.ready.then(moveIndicator).catch(() => {});
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, [moveIndicator]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = e => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <div
        ref={progressRef}
        className="scroll-progress-bar"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
      />

      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-shell">
          <a href="#home" className="brand-link" aria-label={`${PROJECT.name} — back to top`}>
            <span className="brand-mark" aria-hidden="true" />
            <span className="brand-word">RumahKuVR</span>
          </a>

          <nav
            ref={menuRef}
            className={`nav-menu ${open ? 'open' : ''}`}
            aria-label="Sections"
            id="primary-navigation"
          >
            {NAV_LINKS.map(([id, labelText]) => (
              <a
                key={id}
                href={`#${id}`}
                ref={el => {
                  linkRefs.current[id] = el;
                }}
                className={`nav-link ${active === id ? 'active' : ''}`}
                aria-current={active === id ? 'true' : undefined}
                onClick={() => setOpen(false)}
              >
                {labelText}
              </a>
            ))}
            <span className="nav-pill" aria-hidden="true" />
          </nav>

          <div className="nav-actions">
            <button
              type="button"
              className="btn-icon theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} appearance`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} appearance`}
            >
              <span className="theme-toggle-inner">
                <Sun size={18} strokeWidth={1.9} />
                <Moon size={18} strokeWidth={1.9} />
              </span>
            </button>

            <a href="#gameplay" className="btn btn-primary btn-sm nav-cta">
              <span>View gameplay</span>
              <ArrowRight size={14} strokeWidth={2.2} />
            </a>

            <button
              type="button"
              className="btn-icon nav-toggle"
              onClick={() => setOpen(v => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="primary-navigation"
            >
              {open ? <X size={18} strokeWidth={2} /> : <Menu size={18} strokeWidth={2} />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

/* --------------------------------------------------------------------------
   01 HERO
   -------------------------------------------------------------------------- */
function Hero() {
  const canHover = useCanHover();
  const reduced = usePrefersReducedMotion();
  const tilt = useTilt({ max: 4.5, scale: 1.012, enabled: canHover && !reduced });
  const parallaxRef = useParallax(22, canHover && !reduced);

  /* Magnetic lean on the two hero calls to action, and nowhere else on the
     page. Same gate as the tilt: fine pointer, wide viewport, motion allowed. */
  const magneticPrimary = useMagnetic({ enabled: canHover && !reduced });
  const magneticSecondary = useMagnetic({ enabled: canHover && !reduced });

  /* The opening sequence is told the page exists from here, in a layout
     effect, because this is the first moment the hero's DOM is committed. The
     gate will not offer itself to be opened before this call lands — it is
     presentation, but it should never uncover an empty stage. Nothing about
     the hero's own rendering waits on it. */
  useLayoutEffect(() => {
    markIntroReady();
  }, []);

  return (
    <section id="home" className="hero-section">
      <div className="hero-glow" aria-hidden="true" />
      <div className="container">
        <div className="hero-grid">
          <div className="hero-copy">
            {/* `--d` carries the hero's own entrance ladder. The delays are
                relative to the curtain parting, not to scrolling into view,
                and they are tighter than the page-wide stagger — the whole
                composition has to land inside about a second. */}
            <p className="hero-badge" data-reveal="up" style={{ '--d': '80ms' }}>
              <span className="pulse-dot" aria-hidden="true" />
              Final Year Project · {PROJECT.year} · {PROJECT.engine}
            </p>

            {/* The one headline on the site that resolves out of blur rather
                than rising out of a mask: it is the first line anyone reads
                after the curtain, and it reads as focus being found.

                Seven words, down from eleven. It says what the app is rather
                than what it is not — the old line spent its second half
                arguing with a pamphlet nobody had mentioned yet. */}
            <SplitText
              as="h1"
              variant="resolve"
              text="Practise home safety inside a Malaysian home."
              delay={130}
              step={30}
            />

            <p className="lede" data-reveal="up" style={{ '--d': '290ms' }}>
              Seniors walk a familiar kampung home, find the hazards themselves — a wet floor, a live
              wire, a burner left running — and fix each one by hand, on {PROJECT.headset} or a gamepad.
            </p>

            {/* "See it running" pointed at the gallery of stills, which is not
                it running. It goes to the clip now, and it leads — the
                walkthrough is the next section, so the primary call to action
                and the reading order agree. */}
            <div className="hero-actions" data-reveal="up" style={{ '--d': '350ms' }}>
              <a href="#demo" className="btn btn-primary btn-magnetic" {...magneticPrimary}>
                <MonitorPlay size={16} strokeWidth={2} />
                <span>Watch the walkthrough</span>
              </a>
              <a href="#training" className="btn btn-secondary btn-magnetic" {...magneticSecondary}>
                <span>Explore the training</span>
                <ArrowRight size={16} strokeWidth={2.2} />
              </a>
            </div>

            <dl className="hero-metrics" data-reveal="up" style={{ '--d': '410ms' }}>
              {HERO_METRICS.map(metric => (
                <div className="hero-metric" key={metric.label}>
                  <dt>
                    <Counter value={metric.value} suffix={metric.suffix} />
                    <span>{metric.label}</span>
                  </dt>
                  <dd>{metric.sub}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Two layers on one stage: the capture, and a stat card overhanging
              its lower left. The card sits in the bottom band of the frame,
              which is floor in this capture — the in-headset HUD across the
              top of the screenshot is never covered.

              A third layer used to overhang the lower right: an inset of the
              Pilih Mod Simulasi panel. It was the same screenshot the Training
              section already shows at full size with a caption, and here it
              competed with the capture it was sitting on. Dropping it also
              takes an eager image request off the opening. */}
          <div className="hero-visual-wrap" ref={parallaxRef}>
            <div className="hero-stage">
              <div className="hero-visual tilt" {...tilt} data-reveal="clip" style={{ '--d': '60ms' }}>
                {/* The LCP element. A phone renders this about 358px wide, so
                    the 1500px master is roughly four times more pixels than it
                    can show — the 800w variant covers small viewports at 36KB
                    instead of 132KB. `sizes` must stay in step with the
                    preload hint in app.blade.php, or the browser fetches one
                    candidate and then the other. */}
                {/* sizes and srcSet are listed before src on purpose. React
                    sets attributes in the order they appear, and an <img> that
                    receives src first starts downloading that URL immediately —
                    the full 132KB master — before the candidate list arrives. */}
                <img
                  sizes="(max-width: 720px) calc(100vw - 32px), (max-width: 1024px) 92vw, (min-width: 1400px) 600px, 52vw"
                  srcSet="/images/project/hero-hazard-scan-800w.webp 800w, /images/project/hero-hazard-scan.webp 1500w"
                  src="/images/project/hero-hazard-scan.webp"
                  alt="First-person view inside RumahKuVR: a kampung kitchen with three hazard markers, the senior's hands in frame, and the session HUD showing hazards cleared and time remaining"
                  width={1500}
                  height={844}
                  loading="eager"
                  decoding="sync"
                  fetchPriority="high"
                />
                <span className="hero-visual-sheen" aria-hidden="true" />
              </div>

              {/* Reads the capture it sits on rather than repeating the stat
                  row below it: this frame is a Mod Sukar session, and its HUD
                  shows the 0/10 counter for exactly these ten hazards. */}
              <div className="hero-float" data-reveal="up" style={{ '--d': '480ms' }}>
                <span className="hero-float-num">
                  <Counter value={10} pad={false} />
                </span>
                <span className="hero-float-copy">
                  <strong>Hazards in Mod Sukar</strong>
                  <span>In-engine capture · {PROJECT.engine}</span>
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   02 OVERVIEW — intent and the meal-transport case study
   -------------------------------------------------------------------------- */
function Overview() {
  /* The three moves a session is built around. They used to be three identical
     icon cards; they are a rail now, because they are a sequence, not a menu —
     and the columns are deliberately unequal, sized to the text each one
     actually carries rather than to a grid. */
  const loop = [
    { num: '01', title: 'Spot it', desc: 'Find the risk where it lives — on the floor, the worktop, the wall.' },
    { num: '02', title: 'Fix it', desc: 'Do the correction by hand: move it, mop it, switch it off, put it away.' },
    { num: '03', title: 'Repeat it', desc: 'Read the graded breakdown the headset works out on its own, then go again until the safe choice stops needing thought.' }
  ];

  return (
    <section id="overview" className="section section-alt" data-reveal="edge">
      <div className="container">
        <SectionHead
          variant="statement"
          kicker="The problem"
          title="Safety advice tells you what not to do. It rarely changes what you do."
        >
          A pamphlet is read once and filed away. RumahKuVR asks a senior to walk their own house, notice
          what is wrong, and put it right.
        </SectionHead>

        <ol className="loop-rail">
          {loop.map((item, i) => (
            <li className="loop-step" key={item.num} data-reveal="up" style={{ '--i': i }}>
              <span className="loop-step-num" aria-hidden="true">
                {item.num}
              </span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </li>
          ))}
        </ol>

        {/* A filmstrip, not three cards. The middle frame is the correction —
            the moment the whole scenario exists to teach — so it is given the
            wider column and the other two read as before and after. */}
        <div className="case-strip" data-reveal="up">
          <div className="case-strip-head">
            <span className="kicker">One hazard, end to end</span>
            <h3>Carrying a meal without carrying the tray</h3>
          </div>

          <ol className="case-steps">
            {CASE_STEPS.map((step, i) => (
              <li className={`case-step${i === 1 ? ' case-step-lead' : ''}`} key={step.num} data-reveal="up" style={{ '--i': i }}>
                <div className="case-step-media">
                  <ZoomTrigger
                    label={`${step.tag} — ${step.title}`}
                    item={{ file: step.image, alt: `${step.title}: ${step.desc}`,
                            title: `Meal transport — ${step.title}`, tag: step.tag, desc: step.desc }}
                  >
                    <img src={step.image} alt={`${step.title}: ${step.desc}`} loading="lazy" decoding="async" />
                  </ZoomTrigger>
                </div>
                <div className="case-step-copy">
                  <span className="case-step-num" aria-hidden="true">{step.num}</span>
                  <strong>{step.title}</strong>
                  <p>{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   03 TRAINING — tiers, hazard catalogue, tutorial philosophy
   -------------------------------------------------------------------------- */
function Training() {
  const [step, setStep] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  /* Which tier the sticky rail should highlight. One observer over three
     panels, with a thin band across the middle of the viewport as the trigger
     line — the same scroll-spy the nav already uses, so no new machinery and
     no scroll listener. */
  const [activeTier, setActiveTier] = useState(0);
  const panelRefs = useRef([]);

  /* The rail reads the stack, and now also drives it. Scrolling the panel to
     the middle of the viewport is what the observer is watching for, so the
     highlight follows on its own rather than being set twice. */
  const goToTier = i => {
    panelRefs.current[i]?.scrollIntoView({
      block: 'center',
      behavior: reducedMotion ? 'auto' : 'smooth'
    });
  };

  useEffect(() => {
    const nodes = panelRefs.current.filter(Boolean);
    if (!nodes.length) return undefined;
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveTier(Number(entry.target.dataset.tier));
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    nodes.forEach(n => io.observe(n));
    return () => io.disconnect();
  }, []);

  const tutorialSteps = [
    { num: '01', title: 'See', label: 'A hazard announces itself on a readable card.' },
    { num: '02', title: 'Try', label: 'A coachmark points at the one control that matters.' },
    { num: '03', title: 'Succeed', label: 'The correction registers and the counter moves.' },
    { num: '04', title: 'Next', label: 'The prompt clears and the next hazard is on you.' }
  ];

  return (
    <section id="training" className="section" data-reveal="edge">
      <div className="container">
        {/* The tier progression. A sticky rail states the idea once and tracks
            which mode you are looking at; the three real captures scroll past
            it. Each capture opens from a letterbox to full bleed on a
            scroll-driven timeline, so the guidance visibly falls away as the
            difficulty climbs — the section performs its own argument. */}
        <div className="tier-progression">
          <div className="tier-rail">
            <div className="tier-rail-inner">
              <span className="kicker" data-reveal="up">Difficulty</span>
              <SplitText as="h2" text="Guidance fades as confidence grows." delay={90} />
              <p className="lede" data-reveal="up" style={{ transitionDelay: '160ms' }}>
                Difficulty here is not speed. It is how much help stays on screen.
              </p>

              {/* The claim, drawn. All three tiers show their own guidance bar
                  at once, so the fade is a shape you read in a glance — and
                  the row you are looking at opens to say, in words, what is
                  left on screen.

                  The bar used to be a percentage: 100 / 55 / 18, announced to
                  screen readers through role="meter" as if something in the
                  build had measured it. Nothing does. It is three named steps
                  of one ladder now — full, reduced, minimal — with the words
                  carrying the meaning and the bar reduced to what it always
                  honestly was, a picture of them. The meter role goes with the
                  number; the level is plain text, so it is read out either way.

                  The rows are buttons as well as a legend: the rail tracks the
                  stack, and the stack can be driven from the rail. */}
              <ol className="tier-legend" data-reveal="up" style={{ transitionDelay: '240ms' }}>
                {TIERS.map((tier, i) => (
                  <li
                    key={tier.id}
                    className={`tier-legend-item ${i === activeTier ? 'is-active' : ''}`}
                    aria-current={i === activeTier ? 'true' : undefined}
                  >
                    <button type="button" className="tier-legend-btn" onClick={() => goToTier(i)}>
                      <span className="tier-legend-row">
                        <span className={`tier-legend-dot ${tier.badgeClass}`} aria-hidden="true" />
                        <span className="tier-legend-name">{tier.malay}</span>
                        <span className="tier-legend-count">{tier.count} hazards</span>
                      </span>

                      <span className="tier-legend-meter" aria-hidden="true">
                        <i className={tier.badgeClass} style={{ '--g': tier.guidanceStep / 3 }} />
                      </span>

                      <span className="tier-legend-level">{tier.guidanceLevel}</span>

                      <span className="tier-legend-note">
                        <span>{tier.guidanceLabel}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>

              <p className="tier-legend-caption">
                Each step is how much help stays on screen. Sukar has the most hazards and the least of it.
              </p>
            </div>
          </div>

          {/* THE SELECTED STATE IS AN ATTRIBUTE, NOT A CLASS.

              Each panel below carries `data-reveal`, and the scroll-reveal
              observer marks it by adding `is-visible` to its class list. React
              does not know about that class: the moment anything makes React
              rewrite `className` on the same element — which a selected-state
              class would, on every scroll — the observer's mark is wiped, and
              because the observer unobserves after the first intersection it
              never comes back. The panel would sit at opacity 0 for the rest
              of the visit.

              A data attribute is written independently of `class`, so the two
              systems stop fighting over one property. Same reason the demo
              reel's player state is an attribute. */}
          <div className="tier-stack">
            {TIERS.map((tier, i) => (
              <article
                className="tier-panel"
                key={tier.id}
                data-tier={i}
                data-current={i === activeTier ? 'true' : undefined}
                ref={el => {
                  panelRefs.current[i] = el;
                }}
                data-reveal="up"
              >
                <div className="tier-panel-media">
                  <ZoomTrigger
                    label={`${tier.tier} mode — ${tier.malay}`}
                    item={{ file: tier.image, alt: tier.alt, title: `${tier.title} — ${tier.malay}`,
                            tag: `${tier.tier} · ${tier.stat}`, desc: tier.desc }}
                  >
                    <img src={tier.image} alt={tier.alt} loading="lazy" decoding="async" width={900} height={506} />
                  </ZoomTrigger>
                </div>

                <div className="tier-panel-body">
                  <div className="tier-panel-head">
                    <span className="tier-panel-index" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3>{tier.title}</h3>
                    <span className={`training-badge ${tier.badgeClass}`}>{tier.malay}</span>
                  </div>
                  <p>{tier.desc}</p>

                  {/* What is left on screen in this tier, as chips rather than
                      a tick list — they are conditions the tier is played
                      under, not features it offers. */}
                  <ul className="tier-conditions" aria-label={`What stays on screen in ${tier.malay}`}>
                    {tier.features.map(f => (
                      <li key={f} className="chip">
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="hazard-block">
          <div className="hazard-copy" data-reveal="left">
            <span className="kicker">Hazard catalogue</span>
            <h3>Eighteen hazards. Here are eight of them.</h3>
            <p>
              Eighteen hazards are modelled across the house: three in Mudah, five in Sederhana, ten in
              Sukar. The eight listed below are the Mudah and Sederhana sets. Each is modelled where it
              belongs and named in Malay on screen, so the label a senior reads in the headset is the
              label they would use at home.
            </p>

            <div className="hazard-groups">
              <div className="hazard-group">
                <h4>
                  <span className="dot dot-easy" aria-hidden="true" /> Easy · Mod Mudah
                  <span className="hazard-group-count">3 hazards</span>
                </h4>
                <ul>
                  {HAZARDS.easy.map(h => (
                    <li key={h.en}>
                      <strong>{h.en}</strong>
                      <span>{h.ms}</span>
                      <em>{h.room}</em>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="hazard-group">
                <h4>
                  <span className="dot dot-med" aria-hidden="true" /> Medium · Mod Sederhana
                  <span className="hazard-group-count">5 hazards</span>
                </h4>
                <ul>
                  {HAZARDS.medium.map(h => (
                    <li key={h.en}>
                      <strong>{h.en}</strong>
                      <span>{h.ms}</span>
                      <em>{h.room}</em>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="footnote">
              <span className="dot dot-hard" aria-hidden="true" /> The remaining ten are Mod Sukar. They are
              drawn from across the whole house, under reduced lighting and a running clock, and they are
              not listed here on purpose — that tier is the test of whether the habit transferred.
            </p>
          </div>

          <Figure
            className="hazard-figure"
            reveal="right"
            zoomable
            zoomTag="Difficulty selection"
            src="/images/ui/difficulty-select.webp"
            srcSet="/images/ui/difficulty-select-1400w.webp 1400w, /images/ui/difficulty-select.webp 3483w"
            sizes="(max-width: 720px) calc(100vw - 32px), (max-width: 1024px) 92vw, 40vw"
            alt="RumahKuVR difficulty panel offering Mod Mudah with 3 hazards, Mod Sederhana with 5, and Mod Sukar with 10"
            caption="Pilih Mod Simulasi — the tier panel as it appears in the headset"
            width={3483}
            height={2085}
          />
        </div>

        <div className="tutorial-banner" data-reveal="up">
          <div className="tutorial-copy">
            <span className="kicker">Tutorial</span>
            <h3>See. Try. Succeed. Next.</h3>
            <p>
              Nothing is taught with a wall of text. A coachmark highlights one control, the senior performs
              the action once, and the prompt gets out of the way.
            </p>
          </div>

          <div className="tutorial-steps">
            <div className="tutorial-step-row" role="group" aria-label="Tutorial loop">
              {tutorialSteps.map((s, idx) => (
                <button
                  type="button"
                  key={s.num}
                  aria-pressed={step === idx}
                  className={`tutorial-step ${step === idx ? 'active' : ''}`}
                  onClick={() => setStep(idx)}
                  onMouseEnter={() => setStep(idx)}
                  onFocus={() => setStep(idx)}
                >
                  <small>{s.num}</small>
                  <strong>{s.title}</strong>
                </button>
              ))}
            </div>
            <p className="tutorial-step-caption" aria-live="polite" key={step}>
              {tutorialSteps[step].label}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   04 GAMEPLAY — coverflow evidence gallery
   -------------------------------------------------------------------------- */
function Gameplay() {
  const [openIndex, setOpenIndex] = useState(null);
  const item = openIndex === null ? null : GALLERY[openIndex];

  const move = dir => setOpenIndex(i => (i === null ? null : (i + dir + GALLERY.length) % GALLERY.length));

  return (
    <section id="gameplay" className="section section-alt" data-reveal="edge">
      <div className="container">
        <SectionHead variant="centered" kicker="In-engine captures" title="Inside RumahKuVR.">
          Ten captures taken from the running Unity build — hazard cards, corrective actions, the house map
          and the session breakdown. No mock-ups, no renders.
        </SectionHead>

        <div data-reveal="up">
          <Coverflow items={GALLERY} onOpen={(_, i) => setOpenIndex(i)} label="RumahKuVR in-engine captures" />
        </div>
      </div>

      <Lightbox
        item={item}
        position={openIndex === null ? null : `${openIndex + 1} / ${GALLERY.length}`}
        onClose={() => setOpenIndex(null)}
        onPrev={() => move(-1)}
        onNext={() => move(1)}
      />
    </section>
  );
}

/* --------------------------------------------------------------------------
   05 PLATFORM — headset and gamepad
   -------------------------------------------------------------------------- */
function Platform() {
  const [pad, setPad] = useState('ps');

  const pads = {
    ps: {
      src: '/images/platform/controller-ps.webp',
      srcSet: '/images/platform/controller-ps-1400w.webp 1400w, /images/platform/controller-ps.webp 3462w',
      alt: 'RumahKuVR in-headset controller guide for a PlayStation-style pad, mapping the left stick to movement, the right stick to looking around, and O, X, triangle and the d-pad to interact, cancel, pause and navigate',
      label: 'PlayStation layout',
      note: 'Symmetrical sticks · O to interact, X to go back'
    },
    xbox: {
      src: '/images/platform/controller-xbox.webp',
      srcSet: '/images/platform/controller-xbox-1400w.webp 1400w, /images/platform/controller-xbox.webp 3462w',
      alt: 'RumahKuVR in-headset controller guide for an Xbox-style pad, mapping the left stick to movement, the right stick to looking around, and A, B, Y and the d-pad to interact, cancel, pause and navigate',
      label: 'Xbox layout',
      note: 'Offset sticks · A to interact, B to go back'
    }
  };

  const current = pads[pad];

  return (
    <section id="platform" className="section" data-reveal="edge">
      <div className="container">
        <SectionHead variant="split" kicker="Hardware" title="Two ways into the same house.">
          Not every senior can stand for twenty minutes. The controller build runs the identical scenarios
          seated, with the same hazards and the same scoring.
        </SectionHead>

        <div className="platform-choice" data-reveal="up">
          <div className="platform-choice-media">
            <ZoomTrigger
              label="Pilih Mod Permainan"
              item={{
                file: '/images/ui/mode-select.webp',
                alt: 'RumahKuVR mode select screen offering Mod VR, recommended for Meta Quest 3, and Mod Kawalan for an Xbox or PlayStation controller',
                title: 'Pilih Mod Permainan — mode selection',
                tag: 'In-headset UI',
                desc: 'The first screen of the app: Mod VR for Meta Quest 3, or Mod Kawalan for an Xbox or PlayStation controller.'
              }}
            >
              <img
                sizes="(max-width: 720px) calc(100vw - 32px), (max-width: 1024px) 92vw, 46vw"
                srcSet="/images/ui/mode-select-1400w.webp 1400w, /images/ui/mode-select.webp 3508w"
                src="/images/ui/mode-select.webp"
                alt="RumahKuVR mode select screen offering Mod VR, recommended for Meta Quest 3, and Mod Kawalan for an Xbox or PlayStation controller"
                width={3508}
                height={2008}
                loading="lazy"
                decoding="async"
              />
            </ZoomTrigger>
          </div>
          <div className="platform-choice-copy">
            <span className="kicker">Pilih Mod Permainan</span>
            <h3>Mod VR or Mod Kawalan is the first screen the app shows.</h3>
            <p>
              Before anything else the app asks how the senior wants to play. Both routes lead to the same
              scenarios, the same hazard list and the same session record.
            </p>
          </div>
        </div>

        <div className="platform-grid">
          <TiltCard as="article" className="platform-card" data-reveal="left" max={3}>
            <header className="platform-card-head">
              <span className="kicker">VR Mode · Mod VR</span>
              <h3>{PROJECT.headset}</h3>
              <p>
                Room-scale training with two-handed interaction and real depth — the senior reaches for the
                stool, the mop and the burner dial rather than pressing a button labelled “fix”.
              </p>
            </header>

            <div className="platform-media platform-media-device">
              <img
                src="/images/meta-quest-3-real.webp"
                alt="A Meta Quest 3 headset with its two Touch Plus controllers"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="chip-row">
              <span className="chip">6DoF room scale</span>
              <span className="chip">Senior eye-level HUD</span>
              <span className="chip">Direct grab physics</span>
            </div>

            <p className="platform-note">
              Device photograph by Roy.wonder.cohen, Wikimedia Commons, CC BY-SA 4.0. Meta Quest is a
              trademark of its owner and is referenced here for identification only.
            </p>
          </TiltCard>

          <TiltCard as="article" className="platform-card" data-reveal="right" max={3}>
            <header className="platform-card-head">
              <span className="kicker">Controller Mode · Mod Kawalan</span>
              <h3>Gamepad mode</h3>
              <p>
                The in-headset control guide is built into the app: pick your pad, and every button is
                labelled in Malay with the action it performs.
              </p>
            </header>

            <div className="pad-switch" role="group" aria-label="Controller layout">
              {Object.entries(pads).map(([key, value]) => (
                <button
                  type="button"
                  key={key}
                  aria-pressed={pad === key}
                  className={`pad-switch-btn ${pad === key ? 'active' : ''}`}
                  onClick={() => setPad(key)}
                >
                  {value.label}
                </button>
              ))}
            </div>

            <div className="platform-media platform-media-pad">
              <ZoomTrigger
                label={`${current.label} controller guide`}
                item={{ file: current.src, alt: current.alt,
                        title: `Panduan Alat Kawalan — ${current.label}`, tag: 'Controller guide',
                        desc: current.note }}
              >
                <img
                  key={pad}
                  sizes="(max-width: 720px) calc(100vw - 32px), (max-width: 1024px) 46vw, 30vw"
                  srcSet={current.srcSet}
                  src={current.src}
                  alt={current.alt}
                  width={3462}
                  height={2072}
                  loading="lazy"
                  decoding="async"
                />
              </ZoomTrigger>
            </div>

            <p className="platform-note">
              {current.note} — RumahKuVR accepts generic Bluetooth gamepads using the same mapping.
            </p>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   06 ROLES
   -------------------------------------------------------------------------- */
function Roles() {
  const keys = ['senior', 'caregiver', 'guest'];
  const [role, setRole] = useState('senior');
  const current = ROLES[role];

  const tabsRef = useRef(null);
  const btnRefs = useRef({});

  useLayoutEffect(() => {
    const wrap = tabsRef.current;
    const btn = btnRefs.current[role];
    if (!wrap || !btn) return;
    wrap.style.setProperty('--pill-x', `${btn.offsetLeft}px`);
    wrap.style.setProperty('--pill-w', `${btn.offsetWidth}px`);
  }, [role]);

  const onTabKeyDown = e => {
    const i = keys.indexOf(role);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setRole(keys[(i + 1) % keys.length]);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setRole(keys[(i - 1 + keys.length) % keys.length]);
    }
  };

  return (
    <section id="roles" className="section section-alt" data-reveal="edge">
      <div className="container">
        <SectionHead kicker="Who signs in" title="One system, three ways in.">
          The role is picked on the sign-in screen and checked against the account behind it. A senior trains,
          a caregiver watches for the hazards that keep recurring, and a guest can try the whole thing without
          creating an account at all.
        </SectionHead>

        <div className="roles-wrapper" data-reveal="scale">
          <div className="roles-copy">
            <div className="role-tabs" ref={tabsRef} role="tablist" aria-label="User roles" onKeyDown={onTabKeyDown}>
              {keys.map(key => (
                <button
                  type="button"
                  key={key}
                  role="tab"
                  ref={el => {
                    btnRefs.current[key] = el;
                  }}
                  id={`role-tab-${key}`}
                  aria-selected={role === key}
                  aria-controls="role-panel"
                  tabIndex={role === key ? 0 : -1}
                  className={`role-tab ${role === key ? 'active' : ''}`}
                  onClick={() => setRole(key)}
                >
                  {ROLES[key].label}
                  <small>{ROLES[key].malay}</small>
                </button>
              ))}
              <span className="role-tab-pill" aria-hidden="true" />
            </div>

            <div
              className="role-detail"
              key={role}
              id="role-panel"
              role="tabpanel"
              aria-labelledby={`role-tab-${role}`}
              tabIndex={-1}
            >
              <span className="kicker">{current.kicker}</span>
              <h3>{current.title}</h3>
              <p>{current.body}</p>

              <ul className="feature-list feature-list-lg">
                {current.points.map((point, i) => (
                  <li key={point} style={{ '--i': i }}>
                    <Check size={16} strokeWidth={2.4} aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              {current.note ? (
                <p className="role-note">
                  <ShieldAlert size={16} strokeWidth={2} aria-hidden="true" />
                  <span>{current.note}</span>
                </p>
              ) : null}
            </div>
          </div>

          <div className="roles-media" key={`media-${role}`}>
            <ZoomTrigger
              label={current.caption}
              item={{ file: current.image, alt: current.alt, title: current.caption,
                      tag: `${current.label} · ${current.malay}`, desc: current.body }}
            >
              <img
                sizes="(max-width: 720px) calc(100vw - 32px), (max-width: 1024px) 92vw, 48vw"
                srcSet={current.imageSrcSet}
                src={current.image}
                alt={current.alt}
                loading="lazy"
                decoding="async"
              />
            </ZoomTrigger>
            <span className="roles-media-caption">{current.caption}</span>
          </div>
        </div>

        {/* The three captures below used to arrive with no introduction at
            all: a reader who had just been reading about sign-in roles met a
            floor plan covered in Malay labels and had to work out for
            themselves what it was, when it was produced, and who reads it.
            This says all three before the images, in the order the reader
            needs them — what happens when a session ends, what the map is,
            and what the two panels beside it answer. */}
        <div className="roles-evidence-intro" data-reveal="up">
          <span className="kicker">After a session</span>
          <h3>What the caregiver sees once the headset comes off.</h3>
          <p>
            The headset grades the session as it ends and writes the result to its own store; the portal
            reads it from there. <strong>Peta Bahaya</strong> is the screen that answers the question a
            family actually asks — not what the score was, but <em>which room keeps causing trouble</em>.
          </p>
          <p>
            Below, marker 01 is selected: Karpet Terlipat, Ruang Makan, a trip risk, cleared — and the
            recommendation that goes with it. The two panels beside it hold the history.
          </p>
        </div>

        {/* One dominant capture with two supporting cards beside it, rather
            than three equal thumbnails. Peta Bahaya is the screen with the most
            to read — a house plan, five numbered markers and three panels of
            small Malay labels — so it gets roughly twice the width it had in
            the old three-up row, at its own aspect ratio and uncropped. */}
        <div className="roles-extra">
          <Figure
            className="roles-extra-figure roles-extra-feature"
            src="/images/caregiver/hazard-map.webp"
            srcSet="/images/caregiver/hazard-map-1400w.webp 1400w, /images/caregiver/hazard-map.webp 3382w"
            sizes="(max-width: 720px) calc(100vw - 32px), (max-width: 1024px) 92vw, 52vw"
            alt="Peta Bahaya in the caregiver portal: the Sederhana tab of a completed session scoring 100 out of 100, with markers 01 to 05 on a labelled floor plan — Ruang Tamu, Ruang Makan, Bilik Tidur, Bilik Utiliti, Bilik Air — the five-hazard Senarai Bahaya beside it all marked Selesai, and marker 01 selected so the Butiran Bahaya Terpilih panel shows Karpet Terlipat, Ruang Makan, Tersandung, Risiko Sederhana, Selesai, with the recommendation to flatten the carpet and secure it with tape or an anti-slip pad"
            caption="Peta Bahaya — marker 01 selected, with its detail panel open"
            reveal="up"
            zoomable
            zoomTag="Caregiver portal"
            zoomDesc="Five hazards from one Sederhana session, each pinned to the room it was found in. Marker 01 is selected here, so Butiran Bahaya Terpilih is showing Karpet Terlipat — Ruang Makan, a trip risk, rated Risiko Sederhana and marked Selesai — beside the recommendation for it. Zoom in to read the Malay labels."
            width={3382}
            height={2085}
          />

          <div className="roles-extra-support">
            {[
              {
                key: 'alerts',
                alt: 'Makluman in the caregiver portal: fourteen stored sessions listed with status, tier, score, date and a one-line summary — "Sesi selesai dengan jayanya" for a finished run, "Sesi tidak lengkap — perlu perhatian" for an abandoned one',
                caption: 'Makluman — every saved session, newest first'
              },
              {
                key: 'tier-performance',
                alt: 'Prestasi Ikut Tahap in the caregiver portal: average score and session count per tier — Mudah 66 out of 100 over 9 sessions, Sederhana 98 over 4, Sukar 100 over 1, and 77 out of 100 across all 14',
                caption: 'Prestasi Ikut Tahap — average score per tier'
              }
            ].map(shot => (
              <Figure
                key={shot.key}
                className="roles-extra-figure"
                src={`/images/caregiver/${shot.key}.webp`}
                srcSet={`/images/caregiver/${shot.key}-1400w.webp 1400w, /images/caregiver/${shot.key}.webp 3483w`}
                sizes="(max-width: 720px) calc(100vw - 32px), (max-width: 1024px) 46vw, 25vw"
                alt={shot.alt}
                caption={shot.caption}
                reveal="up"
                zoomable
                zoomTag="Caregiver portal"
                width={3483}
                height={2085}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   07 SENIOR-FIRST DESIGN
   -------------------------------------------------------------------------- */
function SeniorDesign() {
  return (
    <section id="accessibility" className="section" data-reveal="edge">
      <div className="container">
        <SectionHead variant="split" kicker="Designed for older users" title="Built to be understood on the first try.">
          One question decided every screen: could someone who has never worn a headset finish a session
          without being told what to do? This is the first screen a senior sees — every claim below is
          something on it.
        </SectionHead>

        {/* This was six written principles in cards beside no evidence at all,
            which is the weakest way to make an accessibility claim: the reader
            has only the assertion. It is one capture of the Warga Emas menu
            now, at a size where the Malay labels are readable, with each note
            naming the element on it that carries the point. Nothing is claimed
            here that is not visible in that frame. */}
        <div className="senior-evidence">
          <Figure
            className="senior-evidence-figure"
            reveal="left"
            zoomable
            zoomTag="Warga Emas menu"
            src="/images/ui/senior-menu.webp"
            srcSet="/images/ui/senior-menu-1400w.webp 1400w, /images/ui/senior-menu.webp 3483w"
            sizes="(max-width: 720px) calc(100vw - 32px), (max-width: 1024px) 92vw, 54vw"
            alt="The RumahKuVR Warga Emas menu: a Bantuan Suara voice-help button in the header, a welcome line, a large Mula Latihan button reading “Tekan untuk memulakan”, a Tutorial button, cards showing Skor Terakhir 100 out of 100 and Sesi Selesai 6, and a row of five buttons that each pair an icon with a word — Lihat Kemajuan, Bantuan, Panduan Alat, Log Keluar and Keluar"
            caption="Menu Warga Emas — the whole home screen, uncropped"
            zoomDesc="The senior home screen in full. One dominant action, spoken-Malay help in the header, and every button carrying a word beside its icon."
            width={3483}
            height={2085}
          />

          <ol className="senior-notes">
            {SENIOR_DESIGN_NOTES.map((item, i) => (
              <li key={item.num} data-reveal="up" style={{ '--i': i }}>
                <span className="senior-note-num" aria-hidden="true">{item.num}</span>
                <div className="senior-note-body">
                  <strong>{item.title}</strong>
                  <span className="senior-note-find">On screen: {item.find}</span>
                  <p>{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   08 SYSTEM
   -------------------------------------------------------------------------- */
/* One icon per pipeline stage, keyed by step so the data file stays free of
   presentation. Six identical text boxes read as a diagram of a system; six
   distinguishable ones read as a way into it. */
const PIPELINE_ICONS = {
  '01': Gamepad2,
  '02': Boxes,
  '03': ScanEye,
  '04': Hand,
  '05': Cpu,
  '06': ClipboardList
};

function System() {
  const [railRef, railIn] = useInView({ threshold: 0.3 });

  /* Selected pipeline stage. Arrow keys move the selection and take focus with
     them, which is the expected tablist behaviour — Home/End jump to the ends. */
  const [activeStage, setActiveStage] = useState(0);
  const stageRefs = useRef([]);

  const focusStage = i => {
    setActiveStage(i);
    stageRefs.current[i]?.focus();
  };

  /* Cursor-tracked glow behind the stage row. One rAF-coalesced handler that
     writes two custom properties — no state, so pointer movement never causes
     a React render, and nothing runs at all under reduced motion. */
  const reducedMotion = usePrefersReducedMotion();
  const glowFrame = useRef(0);

  useEffect(
    () => () => {
      if (glowFrame.current) cancelAnimationFrame(glowFrame.current);
    },
    []
  );

  const onPipelinePointerMove = e => {
    if (reducedMotion || e.pointerType === 'touch') return;
    const el = e.currentTarget;
    const { clientX, clientY } = e;
    if (glowFrame.current) return;
    glowFrame.current = requestAnimationFrame(() => {
      glowFrame.current = 0;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${(((clientX - r.left) / r.width) * 100).toFixed(2)}%`);
      el.style.setProperty('--my', `${(((clientY - r.top) / r.height) * 100).toFixed(2)}%`);
    });
  };

  const onPipelineKeyDown = e => {
    const last = PIPELINE.length - 1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      focusStage(activeStage === last ? 0 : activeStage + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      focusStage(activeStage === 0 ? last : activeStage - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusStage(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      focusStage(last);
    }
  };

  return (
    <section id="system" className="section section-alt" data-reveal="edge">
      <div className="container">
        <SectionHead variant="statement" kicker="How it works" title="From the senior's hands to the caregiver's report.">
          Input, physics, hazard state, verification and telemetry are one chain. What a senior does with
          their hands is what ends up in the caregiver's report.
        </SectionHead>

        {/* A flow, drawn as a flow: one continuous line the nodes sit on, with
            the on-device analysis stage carrying the weight — it is the step
            that makes this more than a scoring screen. */}
        <div className="architecture" data-reveal="scale">
          <div className="architecture-head">
            <span className="kicker">Interaction pipeline</span>
            <p className="architecture-hint">
              Pick a stage — or use <kbd>←</kbd> <kbd>→</kbd>
            </p>
          </div>

          {/* A real tablist. Each stage is a button, arrow keys move between
              them, and the panel below explains what that stage actually does
              in this build. The stages were static text before, which made the
              row look like a diagram of a system rather than a way into it. */}
          <div
            ref={railRef}
            className={`pipeline ${railIn ? 'is-live' : ''}`}
            role="tablist"
            aria-label="Interaction pipeline stages"
            onKeyDown={onPipelineKeyDown}
            onPointerMove={onPipelinePointerMove}
          >
            <span className="pipeline-glow" aria-hidden="true" />
            <span className="pipeline-rail" aria-hidden="true" />
            {/* Width is resolved here rather than in calc(): the rail spans 4%
                to 96%, so the travelled part is that 92% scaled by progress. */}
            <span
              className="pipeline-rail-fill"
              aria-hidden="true"
              style={{ width: `${(activeStage / (PIPELINE.length - 1)) * 92}%` }}
            />
            {PIPELINE.map((node, i) => {
              const Icon = PIPELINE_ICONS[node.step];
              return (
                <button
                  type="button"
                  role="tab"
                  id={`pipeline-tab-${node.step}`}
                  aria-selected={i === activeStage}
                  aria-controls="pipeline-panel"
                  tabIndex={i === activeStage ? 0 : -1}
                  ref={el => {
                    stageRefs.current[i] = el;
                  }}
                  className={`pipeline-node${i === activeStage ? ' is-active' : ''}${i < activeStage ? ' is-passed' : ''}`}
                  key={node.step}
                  style={{ '--i': i }}
                  onClick={() => setActiveStage(i)}
                >
                  <span className="pipeline-node-top">
                    <span className="pipeline-node-icon" aria-hidden="true">
                      {Icon ? <Icon size={15} strokeWidth={1.9} /> : null}
                    </span>
                    <small>{node.step}</small>
                  </span>
                  <strong>{node.title}</strong>
                  <span className="pipeline-node-sub">{node.sub}</span>
                </button>
              );
            })}
          </div>

          {/* The panel is keyed on the stage, so React remounts it and the
              entrance replays without a listener. It also reserves its own
              height: switching stages must not move the row of buttons the
              reader is clicking. */}
          <div
            className="pipeline-panel"
            id="pipeline-panel"
            role="tabpanel"
            aria-labelledby={`pipeline-tab-${PIPELINE[activeStage].step}`}
            key={activeStage}
          >
            <p className="pipeline-panel-step" aria-hidden="true">
              <span className="pipeline-panel-num">{PIPELINE[activeStage].step}</span>
              {PIPELINE[activeStage].title}
              <span className="pipeline-panel-of">
                {activeStage + 1} of {PIPELINE.length}
              </span>
            </p>
            <p className="pipeline-panel-body">{PIPELINE[activeStage].detail}</p>
          </div>
        </div>

        <div className="system-split">
          {/* Two captures rather than one. The result card is the analyser's
              actual output — the four lines the copy used to describe from
              memory — and the trend panel is what those same records become
              across sessions. With both on the page the prose beside them can
              be about a third of what it was. */}
          <div className="system-evidence" data-reveal="left">
            <Figure
              className="system-figure"
              zoomable
              zoomTag="In-headset result"
              src="/images/ui/session-result.webp"
              alt="Keputusan Sesi in RumahKuVR: a session scored 80 out of 100 beside an Analisis AI panel with four headed lines — Tahap Prestasi, Kekuatan, Perlu Diberi Perhatian and Cadangan — over a footer reading 08:24 elapsed, 4 hazards and 18 selesai"
              caption="Keputusan Sesi — the four lines the analyser writes, on the headset"
            />
            <Figure
              className="system-figure"
              zoomable
              zoomTag="Caregiver portal"
              src="/images/caregiver/iris-trend.webp"
              alt="Caregiver trend panel reading “Trend Prestasi — Meningkat”, based on the three most recent Mudah sessions, noting that safety and attention improved"
              caption="Trend Prestasi — the same records read across sessions"
            />
          </div>

          <div className="system-copy" data-reveal="right">
            <span className="kicker">Offline behaviour analysis</span>
            <h3>Four graded dimensions, worked out on the headset.</h3>
            <p>
              A Sugeno-style fuzzy expert system grades safety performance, independence, attention and
              recovery. Every rule fires in proportion to how true it is, so one missed hazard nudges the
              result rather than flipping it.
            </p>
            <p>
              The trend reads the same stored records across sessions, and compares like with like — one
              difficulty at a time, named on screen.
            </p>
            <ul className="feature-list">
              <li>
                <Cpu size={14} strokeWidth={2.4} aria-hidden="true" />
                Entirely on-device — no API, no network, no model file
              </li>
              <li>
                <Radar size={14} strokeWidth={2.4} aria-hidden="true" />
                Four graded dimensions rather than one pass or fail
              </li>
              <li>
                <Timer size={14} strokeWidth={2.4} aria-hidden="true" />
                Slow sessions are never penalised
              </li>
              <li>
                <Volume2 size={14} strokeWidth={2.4} aria-hidden="true" />
                Four plain-Malay lines: band, strength, attention, suggestion
              </li>
            </ul>
          </div>
        </div>

        {/* An actual timeline: one spine, six stops, read top to bottom. It was
            a six-box grid, which is the one shape a chronology should never
            be — a grid has no direction. */}
        <div className="journey">
          <div className="journey-head" data-reveal="up">
            <span className="kicker">Development journey</span>
            <h3>How it was built</h3>
          </div>

          <ol className="timeline">
            {/* The light at the front of the spine. Purely decorative, and
                only drawn at all where the scroll-driven draw it belongs to
                can actually run. */}
            <span className="timeline-head" aria-hidden="true" />

            {JOURNEY.map((item, i) => (
              <li className="timeline-item" key={item.step} data-reveal="left" style={{ '--i': i }}>
                <span className="timeline-marker" aria-hidden="true">{item.step}</span>
                <div className="timeline-body">
                  <strong>{item.title}</strong>
                  <p>{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className="honesty-note" data-reveal="up">
          <ShieldAlert size={20} strokeWidth={2} aria-hidden="true" />
          <span>
            <strong>Evaluation note:</strong> every screen on this page is a capture from the working Unity
            build. Session figures shown in those captures come from demonstration accounts recorded during
            development, not from a deployed study.
          </span>
        </p>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   09 CONTACT
   -------------------------------------------------------------------------- */
function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [state, setState] = useState({ status: 'idle', message: '' });

  // Disabling the button is not enough on its own: requestSubmit(), and Enter
  // pressed twice quickly, both fire the form's submit event without touching
  // the button, and React has not re-rendered the disabled state yet. A ref
  // flips synchronously, so the second submit is dropped before it can POST.
  const inFlight = useRef(false);
  const subjectRef = useRef(null);

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  /* The demo reel's closing call to action drops a subject in here rather than
     sending the visitor to a blank form. An event rather than lifted state:
     the form is the only thing that owns these fields, and nothing between it
     and the reel has any reason to know they exist. A subject the visitor has
     already started writing is never overwritten. */
  useEffect(() => {
    const onPrefill = e => {
      const subject = e.detail?.subject;
      if (!subject) return;
      setForm(f => (f.subject.trim() ? f : { ...f, subject }));
      window.setTimeout(() => subjectRef.current?.focus({ preventScroll: true }), 700);
    };
    window.addEventListener('rkv:contact-prefill', onPrefill);
    return () => window.removeEventListener('rkv:contact-prefill', onPrefill);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setState({ status: 'loading', message: 'Sending…' });

    try {
      const token = document.querySelector('meta[name="csrf-token"]')?.content;
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-CSRF-TOKEN': token
        },
        body: JSON.stringify(form)
      });

      // An expired session or a proxy error can answer with HTML, so never
      // assume the body parses — a thrown SyntaxError would read as a bug.
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const fieldErrors = data?.errors ? Object.values(data.errors).flat() : [];
        throw new Error(
          fieldErrors[0] ||
            data?.message ||
            (res.status === 429
              ? 'Too many messages just now. Please try again in a minute.'
              : res.status === 419
                ? 'This page has been open a while. Please refresh and try again.'
                : `Unable to send this message (error ${res.status}).`)
        );
      }

      setState({ status: 'success', message: data?.message || 'Message sent. Thank you!' });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setState({
        status: 'error',
        message: err?.message || 'Something went wrong. Please check your connection and try again.'
      });
    } finally {
      inFlight.current = false;
    }
  }

  return (
    <section id="contact" className="section" data-reveal="edge">
      <div className="container">
        <div className="contact-grid">
          <div className="contact-info" data-reveal="left">
            <span className="kicker">Get in touch</span>
            <SplitText as="h2" text="One student, one house, eighteen hazards." />
            <p className="lede">
              RumahKuVR is a Final Year Project by <strong>{PROJECT.author}</strong>, {PROJECT.programme}.
            </p>

            {/* The form used to open onto four unlabelled fields under a
                heading about the project, so a visitor had to guess what this
                box was for. These are the three things people actually write
                about, named, so the subject line writes itself. */}
            <ul className="contact-reasons">
              <li>
                <strong>Book a demo</strong>
                <span>
                  A live session on {PROJECT.headset}, or on a gamepad if a headset is not practical.
                  Around fifteen minutes.
                </span>
              </li>
              <li>
                <strong>Ask about the project</strong>
                <span>
                  The Unity build, the hazard model, the fuzzy analyser, the caregiver portal — for
                  evaluators, supervisors and anyone building something similar.
                </span>
              </li>
              <li>
                <strong>Send feedback</strong>
                <span>
                  What worked, what did not, and what a senior you know would need before they would use it.
                </span>
              </li>
            </ul>

            <div className="contact-meta">
              <div className="contact-meta-row">
                <GraduationCap size={18} strokeWidth={1.9} aria-hidden="true" />
                <span>Final Year Project · Software Application Development</span>
              </div>
              <div className="contact-meta-row">
                <Layers size={18} strokeWidth={1.9} aria-hidden="true" />
                <span>
                  {PROJECT.engine} · {PROJECT.headset} · Laravel · React
                </span>
              </div>
              <div className="contact-meta-row">
                <ShieldCheck size={18} strokeWidth={1.9} aria-hidden="true" />
                <span>Malaysian home safety &amp; senior fall prevention</span>
              </div>
            </div>
          </div>

          <div className="contact-form-card" data-reveal="right">
            <form className="contact-form" onSubmit={handleSubmit} aria-busy={state.status === 'loading'}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input id="name" name="name" type="text" required maxLength={100} autoComplete="name" value={form.name} onChange={set('name')} />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" required maxLength={160} autoComplete="email" value={form.email} onChange={set('email')} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input id="subject" name="subject" type="text" required maxLength={160} ref={subjectRef} value={form.subject} onChange={set('subject')} />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={4} required maxLength={3000} value={form.message} onChange={set('message')} />
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={state.status === 'loading'}>
                <span>{state.status === 'loading' ? 'Sending…' : 'Send message'}</span>
                <ArrowRight size={16} strokeWidth={2.2} />
              </button>

              {state.message ? (
                <p className={`form-status ${state.status}`} role="status">
                  {state.message}
                </p>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   ACCESSIBILITY DOCK
   -------------------------------------------------------------------------- */
function AccessibilityDock() {
  const [contrast, setContrast] = useState(() => localStorage.getItem('rumahkuvr-contrast') === '1');
  const [large, setLarge] = useState(() => localStorage.getItem('rumahkuvr-large') === '1');

  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', contrast);
    localStorage.setItem('rumahkuvr-contrast', contrast ? '1' : '0');
  }, [contrast]);

  useEffect(() => {
    document.documentElement.classList.toggle('large-type', large);
    localStorage.setItem('rumahkuvr-large', large ? '1' : '0');
  }, [large]);

  return (
    <div className="a11y-dock" role="group" aria-label="Display options">
      <button
        type="button"
        className="a11y-dock-btn"
        onClick={() => setContrast(v => !v)}
        aria-pressed={contrast}
        title="Toggle high contrast"
      >
        <Accessibility size={16} strokeWidth={2} aria-hidden="true" />
        <span>Contrast</span>
      </button>

      <button
        type="button"
        className="a11y-dock-btn"
        onClick={() => setLarge(v => !v)}
        aria-pressed={large}
        title="Toggle larger text"
      >
        <span className="a11y-aa" aria-hidden="true">
          Aa
        </span>
        <span>Text</span>
      </button>
    </div>
  );
}

/* --------------------------------------------------------------------------
   ROOT
   -------------------------------------------------------------------------- */
function App() {
  const { theme, toggleTheme } = useTheme();
  useScrollReveal('#app');

  useEffect(() => {
    document.documentElement.classList.add('is-ready');
  }, []);

  return (
    <>
      <a className="skip-link" href="#demo">
        Skip to content
      </a>

      <Nav theme={theme} toggleTheme={toggleTheme} />

      <main>
        <Hero />
        <DemoReel />
        <Overview />
        <Training />
        <Gameplay />
        <Platform />
        <Roles />
        <SeniorDesign />
        <System />
        <Contact />
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <span className="footer-brand">
            <span className="brand-mark brand-mark-sm" aria-hidden="true" />
            RumahKuVR · Final Year Project · {PROJECT.year}
          </span>
          <a href="#home" className="footer-top">
            <span>Back to top</span>
            <ArrowUpRight size={14} strokeWidth={2.2} aria-hidden="true" />
          </a>
        </div>
      </footer>

      <AccessibilityDock />
    </>
  );
}

const appElement = document.getElementById('app');
window.__RUMAHKUVR_REACT_ROOT__ ??= createRoot(appElement);
window.__RUMAHKUVR_REACT_ROOT__.render(<App />);

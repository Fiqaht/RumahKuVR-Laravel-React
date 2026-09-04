import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Accessibility, ArrowRight, ArrowUpRight, Check, Cpu, Gamepad2, GraduationCap,
  Layers, ListChecks, Menu, MonitorPlay, Moon, Radar, ShieldAlert, ShieldCheck,
  Sun, Timer, Volume2, X
} from 'lucide-react';

import {
  A11Y_PRINCIPLES, CASE_STEPS, GALLERY, HAZARDS, HERO_METRICS,
  JOURNEY, PIPELINE, PROJECT, ROLES, TIERS
} from './data/project';

import {
  useActiveSection, useCanHover, useInView, useParallax, usePrefersReducedMotion,
  useScrollProgress, useScrollReveal, useTilt
} from './lib/motion';

import { Counter, Figure, SectionHead, SplitText, TiltCard } from './components/primitives';
import Coverflow from './components/Coverflow';
import Lightbox from './components/Lightbox';

const NAV_LINKS = [
  ['home', 'Home'],
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
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f8faf7' : '#090b0d');
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

  return (
    <section id="home" className="hero-section">
      <div className="hero-glow" aria-hidden="true" />
      <div className="container">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="hero-badge" data-reveal="up">
              <span className="pulse-dot" aria-hidden="true" />
              Final Year Project · {PROJECT.year} · {PROJECT.engine}
            </p>

            <SplitText
              as="h1"
              text="A safer Malaysian home begins with practice, not a pamphlet."
              delay={120}
              step={38}
            />

            <p className="lede" data-reveal="up" style={{ transitionDelay: '520ms' }}>
              RumahKuVR puts seniors inside a familiar kampung home and asks them to find the hazards
              themselves — a wet floor, a live wire, a burner left running — then fix each one with their
              own hands, on {PROJECT.headset} or an ordinary gamepad.
            </p>

            <div className="hero-actions" data-reveal="up" style={{ transitionDelay: '600ms' }}>
              <a href="#training" className="btn btn-primary">
                <span>Explore the training</span>
                <ArrowRight size={16} strokeWidth={2.2} />
              </a>
              <a href="#gameplay" className="btn btn-secondary">
                <MonitorPlay size={16} strokeWidth={2} />
                <span>See it running</span>
              </a>
            </div>

            <dl className="hero-metrics" data-reveal="up" style={{ transitionDelay: '680ms' }}>
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

          <div className="hero-visual-wrap" ref={parallaxRef}>
            <div className="hero-visual tilt" {...tilt} data-reveal="clip">
              <img
                src="/images/project/hero-hazard-scan.webp"
                alt="First-person view inside RumahKuVR: a kampung kitchen with three hazard markers, the senior's hands in frame, and the session HUD showing hazards cleared and time remaining"
                width={1920}
                height={1080}
                loading="eager"
                decoding="sync"
                fetchPriority="high"
              />
              <span className="hero-visual-sheen" aria-hidden="true" />
              <div className="hero-visual-badge">
                <span>In-engine capture · senior eye level</span>
                <small>{PROJECT.engine}</small>
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
  const loop = [
    { num: '01', label: 'Spot', title: 'Identify', icon: Radar, desc: 'Recognise a fall or burn risk where it actually lives — in the room, not on a poster.' },
    { num: '02', label: 'Act', title: 'Handle', icon: Gamepad2, desc: 'Perform the correction physically: move it, mop it, switch it off, put it away.' },
    { num: '03', label: 'Learn', title: 'Reinforce', icon: ListChecks, desc: 'Read the graded breakdown the headset works out on its own, then repeat until the safe choice is automatic.' }
  ];

  return (
    <section id="overview" className="section section-alt">
      <div className="container">
        <div className="intent-grid">
          <SectionHead kicker="01 · Intent" title="Safety advice tells you what not to do. It rarely changes what you do.">
            A pamphlet is read once and filed away. RumahKuVR asks a senior to walk their own house, notice
            what is wrong, and put it right — the loop that turns knowledge into habit.
          </SectionHead>

          <div className="intent-loop">
            {loop.map((item, i) => {
              const Icon = item.icon;
              return (
                <TiltCard className="intent-card" key={item.num} data-reveal="up" style={{ '--i': i }}>
                  <span className="intent-card-icon" aria-hidden="true">
                    <Icon size={18} strokeWidth={1.9} />
                  </span>
                  <span className="intent-card-num">
                    {item.num} · {item.label}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </TiltCard>
              );
            })}
          </div>
        </div>

        <div className="case-walkthrough" data-reveal="up">
          <div className="case-head">
            <div>
              <span className="kicker">Case study</span>
              <h3>Carrying a meal, the safe way</h3>
              <p>One hazard, followed end to end — from noticing the loaded tray to delivering it without strain.</p>
            </div>
            <span className="chip">In-engine walkthrough</span>
          </div>

          <ol className="case-steps">
            {CASE_STEPS.map((step, i) => (
              <li className="case-step" key={step.num} data-reveal="up" style={{ '--i': i }}>
                <div className="case-step-media">
                  <img src={step.image} alt={`${step.title}: ${step.desc}`} loading="lazy" decoding="async" />
                </div>
                <div className="case-step-copy">
                  <span className="case-step-tag">{step.tag}</span>
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
  const tutorialSteps = [
    { num: '01', title: 'See', label: 'A hazard announces itself on a readable card.' },
    { num: '02', title: 'Try', label: 'A coachmark points at the one control that matters.' },
    { num: '03', title: 'Succeed', label: 'The correction registers and the counter moves.' },
    { num: '04', title: 'Next', label: 'The prompt clears and the next hazard is on you.' }
  ];

  return (
    <section id="training" className="section">
      <div className="container">
        <SectionHead centered kicker="02 · Training" title="Guidance fades as confidence grows.">
          Difficulty is not speed. It is how much help remains on screen — spelled out in the game's own
          tier panel, and stepped down deliberately across three modes.
        </SectionHead>

        <div className="training-grid">
          {TIERS.map((tier, i) => (
            <TiltCard as="article" className="training-card" key={tier.id} data-reveal="up" style={{ '--i': i }}>
              <div className="training-card-media">
                <img src={tier.image} alt={tier.alt} loading="lazy" decoding="async" />
                <span className={`training-badge ${tier.badgeClass}`}>
                  {tier.tier} · {tier.malay}
                </span>
              </div>
              <div className="training-card-body">
                <div className="training-card-head">
                  <h3>{tier.title}</h3>
                  <span className="training-count">
                    <Counter value={tier.count} pad={false} /> hazards
                  </span>
                </div>
                <p>{tier.desc}</p>
                <ul className="feature-list">
                  {tier.features.map(f => (
                    <li key={f}>
                      <Check size={14} strokeWidth={2.4} aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </TiltCard>
          ))}
        </div>

        <div className="hazard-block">
          <div className="hazard-copy" data-reveal="left">
            <span className="kicker">Hazard catalogue</span>
            <h3>Eight hazards a Malaysian home actually has.</h3>
            <p>
              Each one is modelled where it belongs and named in Malay on screen, so the label a senior reads
              in the headset is the label they would use at home.
            </p>

            <div className="hazard-groups">
              <div className="hazard-group">
                <h4>
                  <span className="dot dot-easy" aria-hidden="true" /> Easy · Mod Mudah
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
              Hard mode draws ten hazards from across the house, under reduced lighting and a running clock.
            </p>
          </div>

          <Figure
            className="hazard-figure"
            reveal="right"
            src="/images/ui/difficulty-select.webp"
            alt="RumahKuVR difficulty panel offering Mod Mudah with 3 hazards, Mod Sederhana with 5, and Mod Sukar with 10"
            caption="Pilih Mod Simulasi — the tier panel as it appears in the headset"
            width={1100}
            height={619}
          />
        </div>

        <div className="tutorial-banner" data-reveal="up">
          <div className="tutorial-copy">
            <span className="kicker">Tutorial philosophy</span>
            <h3>See. Try. Succeed. Next.</h3>
            <p>
              Nothing is taught with a wall of text. A coachmark highlights one control, the senior performs
              the action once, and the prompt gets out of the way.
            </p>
            <div className="chip-row">
              <span className="chip">In-engine coachmarks</span>
              <span className="chip">Non-blocking guidance</span>
            </div>
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
    <section id="gameplay" className="section section-alt">
      <div className="container">
        <SectionHead centered kicker="03 · Evidence" title="Inside RumahKuVR.">
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
      alt: 'RumahKuVR in-headset controller guide for a PlayStation-style pad, mapping the left stick to movement, the right stick to looking around, and O, X, triangle and the d-pad to interact, cancel, pause and navigate',
      label: 'PlayStation layout',
      note: 'Symmetrical sticks · O to interact, X to go back'
    },
    xbox: {
      src: '/images/platform/controller-xbox.webp',
      alt: 'RumahKuVR in-headset controller guide for an Xbox-style pad, mapping the left stick to movement, the right stick to looking around, and A, B, Y and the d-pad to interact, cancel, pause and navigate',
      label: 'Xbox layout',
      note: 'Offset sticks · A to interact, B to go back'
    }
  };

  const current = pads[pad];

  return (
    <section id="platform" className="section">
      <div className="container">
        <SectionHead centered kicker="04 · Platform" title="Two ways into the same house.">
          Not every senior can stand for twenty minutes. The controller build runs the identical scenarios
          seated, with the same hazards and the same scoring.
        </SectionHead>

        <div className="platform-choice" data-reveal="up">
          <div className="platform-choice-media">
            <img
              src="/images/ui/mode-select.webp"
              alt="RumahKuVR mode select screen offering Mod VR, recommended for Meta Quest 3, and Mod Kawalan for an Xbox or PlayStation controller"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="platform-choice-copy">
            <span className="kicker">Pilih Mod Permainan</span>
            <h3>The choice is the first screen, not a settings menu.</h3>
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
              <img key={pad} src={current.src} alt={current.alt} loading="lazy" decoding="async" />
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
    <section id="roles" className="section section-alt">
      <div className="container">
        <SectionHead centered kicker="05 · Stakeholders" title="One system, three ways in.">
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
            <img src={current.image} alt={current.alt} loading="lazy" decoding="async" />
            <span className="roles-media-caption">{current.caption}</span>
          </div>
        </div>

        <div className="roles-extra">
          {[
            {
              src: '/images/caregiver/alerts.webp',
              alt: 'RumahKuVR caregiver alerts table listing recent sessions with tier, score, date and a one-line summary',
              caption: 'Makluman — recent session alerts'
            },
            {
              src: '/images/caregiver/tier-performance.webp',
              alt: 'Average score per tier in the caregiver portal: 66 out of 100 for Mudah, 98 for Sederhana and 100 for Sukar',
              caption: 'Prestasi Ikut Tahap — average score per tier'
            },
            {
              src: '/images/caregiver/hazard-map.webp',
              alt: 'The caregiver Peta Bahaya screen listing folded carpet, blocked walkway, bathroom safety and hot water hazards against a house plan',
              caption: 'Peta Bahaya — hazard status by room'
            }
          ].map(shot => (
            <Figure
              key={shot.src}
              className="roles-extra-figure"
              src={shot.src}
              alt={shot.alt}
              caption={shot.caption}
              reveal="up"
            />
          ))}
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
    <section id="accessibility" className="section">
      <div className="container">
        <SectionHead centered kicker="06 · Ergonomics" title="Built to be understood, not decoded.">
          Every screen, prompt and interaction was tuned around one question: could someone who has never
          worn a headset finish a session without being told what to do?
        </SectionHead>

        <div className="principles-grid">
          {A11Y_PRINCIPLES.map((item, i) => (
            <TiltCard className="principle-card" key={item.num} data-reveal="up" style={{ '--i': i }} max={3}>
              <div className="principle-head">
                <strong>{item.num}</strong>
                <Accessibility size={16} strokeWidth={2} aria-hidden="true" />
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   08 SYSTEM
   -------------------------------------------------------------------------- */
function System() {
  const [railRef, railIn] = useInView({ threshold: 0.3 });

  return (
    <section id="system" className="section section-alt">
      <div className="container">
        <SectionHead centered kicker="07 · Architecture" title="An interaction system, not a slideshow.">
          Input, physics, hazard state, verification and telemetry are one chain. What a senior does with
          their hands is what ends up in the caregiver's report.
        </SectionHead>

        <div className="architecture" data-reveal="scale">
          <span className="kicker">Interaction pipeline</span>
          <div ref={railRef} className={`pipeline ${railIn ? 'is-live' : ''}`}>
            <span className="pipeline-rail" aria-hidden="true" />
            {PIPELINE.map((node, i) => (
              <div className="pipeline-node" key={node.step} style={{ '--i': i }}>
                <small>{node.step}</small>
                <strong>{node.title}</strong>
                <span>{node.sub}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="system-split">
          <Figure
            className="system-figure"
            reveal="left"
            src="/images/caregiver/iris-trend.webp"
            alt="Caregiver trend panel reading “Trend Prestasi — Meningkat”, noting that safety and attention improved across the last three sessions"
            caption="Trend Prestasi — computed from the last three saved sessions"
          />

          <div className="system-copy" data-reveal="right">
            <span className="kicker">Offline behaviour analysis</span>
            <h3>The feedback is reasoned, not thresholded.</h3>
            <p>
              When a session ends, a Sugeno-style fuzzy expert system runs on the headset and grades four
              dimensions — safety performance, independence, attention and recovery. Each input is mapped onto
              overlapping low, medium and high sets, every rule fires in proportion to how true it is, and the
              score is the weighted average of what fired. One missed hazard nudges the result; it never flips it.
            </p>
            <p>
              Across sessions the same stored records drive the caregiver trend, which only ever compares like
              with like — one difficulty at a time, and it says on screen which one it chose.
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

        <div className="section-head journey-head" data-reveal="up">
          <span className="kicker">Development journey</span>
          <h3>How it was built</h3>
        </div>

        <ol className="timeline">
          {JOURNEY.map((item, i) => (
            <li className="timeline-item" key={item.step} data-reveal="up" style={{ '--i': i }}>
              <small>{item.step} · Phase</small>
              <strong>{item.title}</strong>
              <p>{item.desc}</p>
            </li>
          ))}
        </ol>

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

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

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
    <section id="contact" className="section">
      <div className="container">
        <div className="contact-grid">
          <div className="contact-info" data-reveal="left">
            <span className="kicker">08 · Project information</span>
            <SplitText as="h2" text="Safer habits through immersive practice." />
            <p className="lede">
              RumahKuVR is a Final Year Project by <strong>{PROJECT.author}</strong>, {PROJECT.programme}.
            </p>

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
                <input id="subject" name="subject" type="text" required maxLength={160} value={form.subject} onChange={set('subject')} />
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
      <a className="skip-link" href="#overview">
        Skip to content
      </a>

      <Nav theme={theme} toggleTheme={toggleTheme} />

      <main>
        <Hero />
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

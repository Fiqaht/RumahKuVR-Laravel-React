import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Accessibility, ArrowRight, ArrowUpRight, Check, ChevronRight, Eye,
  Gamepad2, Gauge, GraduationCap, Layers, Mail, Menu, MonitorPlay,
  Moon, Move3D, ShieldAlert, ShieldCheck, Sun, UserCheck, Users,
  Volume2, X, Zap
} from 'lucide-react';

/* --------------------------------------------------------------------------
   THEME MANAGER HOOK
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
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  return { theme, toggleTheme };
}

/* --------------------------------------------------------------------------
   SCROLL PROGRESS TRACKER HOOK
   -------------------------------------------------------------------------- */
function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setProgress(Math.min(100, Math.max(0, (window.scrollY / total) * 100)));
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return progress;
}

/* --------------------------------------------------------------------------
   GLOBAL SCROLL REVEAL (IntersectionObserver)
   -------------------------------------------------------------------------- */
function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll('[data-reveal], .stagger-group');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Reveal once
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
    );

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* --------------------------------------------------------------------------
   ACTIVE SECTION TRACKER
   -------------------------------------------------------------------------- */
function useActiveSection() {
  const [active, setActive] = useState('home');

  useEffect(() => {
    const sections = [...document.querySelectorAll('main section[id]')];
    const io = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(x => x.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-20% 0px -40% 0px', threshold: [0, 0.2, 0.5] }
    );
    sections.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, []);

  return active;
}

/* --------------------------------------------------------------------------
   NAVIGATION COMPONENT
   -------------------------------------------------------------------------- */
function Nav({ theme, toggleTheme }) {
  const active = useActiveSection();
  const progress = useScrollProgress();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = [
    ['home', 'Home'],
    ['overview', 'Overview'],
    ['training', 'Training'],
    ['gameplay', 'Gameplay'],
    ['platform', 'Platform'],
    ['roles', 'Roles'],
    ['system', 'System'],
    ['contact', 'Contact']
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    const onResize = () => setOpen(false);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <>
      <div
        className="scroll-progress-bar"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
      />
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-shell">
          <a href="#home" className="brand-link" aria-label="RumahKuVR home">
            <img
              src="/images/rumahkuvr-logo-white.png"
              alt="RumahKuVR"
              className="brand-logo-img"
            />
            <span>RumahKuVR</span>
          </a>

          <nav className={`nav-menu ${open ? 'open' : ''}`} aria-label="Main Navigation">
            {links.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className={`nav-link ${active === id ? 'active' : ''}`}
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <button
              type="button"
              className="btn-icon"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun size={17} className="theme-toggle-icon" />
              ) : (
                <Moon size={17} className="theme-toggle-icon" />
              )}
            </button>

            <a href="#gameplay" className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '13px' }}>
              <span>View Demo</span>
              <ArrowRight size={14} />
            </a>

            <button
              type="button"
              className="btn-icon nav-toggle"
              onClick={() => setOpen(v => !v)}
              aria-label="Toggle navigation menu"
              aria-expanded={open}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

/* --------------------------------------------------------------------------
   01 HERO SECTION (Orchestrated Entrance & Subtle Pointer Parallax)
   -------------------------------------------------------------------------- */
function Hero() {
  const visualRef = useRef(null);

  const handleMouseMove = e => {
    if (!visualRef.current || window.innerWidth < 1024) return;
    const rect = visualRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    visualRef.current.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) scale(1.01)`;
  };

  const handleMouseLeave = () => {
    if (!visualRef.current) return;
    visualRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)';
  };

  return (
    <section id="home" className="hero-section">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="hero-top-badge hero-badge-reveal">
              <span></span>
              Final Year Project · 2026 · Unity 6.3 XR
            </div>

            <h1 className="hero-title-reveal">
              A safer Malaysian home begins with immersive practice.
            </h1>

            <p className="lede hero-lede-reveal">
              RumahKuVR transforms familiar household risks into hands-on VR training for seniors —
              reinforcing hazard awareness, safe movement, and corrective habits across Meta Quest 3
              and controller modes.
            </p>

            <div className="hero-actions hero-actions-reveal">
              <a href="#training" className="btn btn-primary">
                <span>Explore Training</span>
                <ArrowRight size={15} />
              </a>
              <a href="#gameplay" className="btn btn-secondary">
                <MonitorPlay size={16} />
                <span>View Gameplay</span>
              </a>
            </div>

            <div className="hero-metrics hero-metrics-reveal">
              <div className="hero-metric-item">
                <strong>18 Hazards</strong>
                <span>Kitchen, yard & living scenarios</span>
              </div>
              <div className="hero-metric-item">
                <strong>03 Tiers</strong>
                <span>Guided to independent practice</span>
              </div>
              <div className="hero-metric-item">
                <strong>02 Modes</strong>
                <span>Meta Quest 3 & Gamepad</span>
              </div>
            </div>
          </div>

          <div
            className="hero-visual hero-visual-reveal"
            ref={visualRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src="/images/project/rumahkuvr-hero-hud.webp"
              alt="RumahKuVR in-engine VR view showing Malaysian home environment with 1.3m senior eye-level HUD"
              width={1920}
              height={1200}
              loading="eager"
            />
            <div className="hero-visual-badge">
              <span>In-Engine VR View · 1.3m Senior Eye Level HUD</span>
              <small>Unity 6.3 LTS</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   02 PROBLEM & EXPERIENCE WALKTHROUGH (Progressive Meal Transport Story)
   -------------------------------------------------------------------------- */
function ProblemExperience() {
  const steps = [
    {
      num: '01',
      title: 'Identify Risk',
      tag: 'Step 01 / Detection',
      desc: 'Spot the unassisted hot meal risk on the dining table.',
      image: '/images/gameplay/hazard-meal-01.webp'
    },
    {
      num: '02',
      title: 'Physical Action',
      tag: 'Step 02 / Correction',
      desc: 'Retrieve and guide the stable meal transport trolley.',
      image: '/images/gameplay/hazard-meal-02.webp'
    },
    {
      num: '03',
      title: 'Safe Habit',
      tag: 'Step 03 / Resolution',
      desc: 'Complete safe delivery without strain or spill hazard.',
      image: '/images/gameplay/hazard-meal-03.webp'
    }
  ];

  return (
    <section id="overview" className="section section-alt">
      <div className="container">
        <div className="intent-grid" data-reveal="up">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <span className="kicker">01 / Intent</span>
            <h2>From abstract safety advice to physical corrective habit.</h2>
            <p>
              Traditional safety pamphlets explain what not to do. RumahKuVR places seniors inside a
              familiar Malaysian home to actively notice risks, handle safety tools, and build muscle memory.
            </p>
          </div>

          <div className="intent-loop stagger-group">
            <div className="intent-card">
              <span className="intent-card-num">01 / SPOT</span>
              <h4>Identify</h4>
              <p>Recognize household fall and burn hazards in context.</p>
            </div>
            <div className="intent-card">
              <span className="intent-card-num">02 / ACT</span>
              <h4>Handle</h4>
              <p>Perform the correct physical interaction in VR.</p>
            </div>
            <div className="intent-card">
              <span className="intent-card-num">03 / LEARN</span>
              <h4>Reinforce</h4>
              <p>Review performance metrics to lock in safer habits.</p>
            </div>
          </div>
        </div>

        <div className="case-walkthrough" data-reveal="up">
          <div className="case-head">
            <div className="case-head-info">
              <h3>Case Study: Meal Transport Safety</h3>
              <p>Demonstrating progressive hazard detection, physical tool handling, and safe completion.</p>
            </div>
            <span className="hero-top-badge" style={{ margin: 0 }}>In-Engine Walkthrough</span>
          </div>

          <div className="case-steps-grid stagger-group">
            {steps.map(step => (
              <div className="case-step-card" key={step.num}>
                <div className="case-step-image">
                  <img src={step.image} alt={step.title} loading="lazy" />
                </div>
                <div className="case-step-copy">
                  <span className="case-step-tag">{step.tag}</span>
                  <strong>{step.title}</strong>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   03 PROGRESSIVE TRAINING & TUTORIAL PHILOSOPHY
   -------------------------------------------------------------------------- */
function TrainingProgression() {
  const [activeStep, setActiveStep] = useState(0);

  const levels = [
    {
      tier: 'Easy',
      badgeClass: 'badge-easy',
      title: 'Guided Learning',
      stat: '3 Core Hazards',
      image: '/images/gameplay/training-easy.webp',
      desc: 'Voice prompts, visual spotlights, and single-step cues guide first-time seniors comfortably.',
      features: ['Malay voice guidance', 'Direct spotlight cues', 'Safe trial repetition']
    },
    {
      tier: 'Medium',
      badgeClass: 'badge-med',
      title: 'Independent Practice',
      stat: '5 Core Hazards',
      image: '/images/gameplay/training-medium.webp',
      desc: 'Guidance appears only when requested. Encourages unprompted exploration and hazard recognition.',
      features: ['Contextual help on demand', 'Reduced visual markers', 'House hazard map access']
    },
    {
      tier: 'Hard',
      badgeClass: 'badge-hard',
      title: 'Full Challenge',
      stat: '10 Scenarios',
      image: '/images/gameplay/training-hard.webp',
      desc: 'Minimal assistance with compound risk chains testing situational awareness and fast decisions.',
      features: ['Full house hazard scan', 'Zero automatic hints', 'Detailed performance audit']
    }
  ];

  const tutorialSteps = [
    { num: '01', title: 'SEE', label: 'Observe hazard' },
    { num: '02', title: 'TRY', label: 'Perform action' },
    { num: '03', title: 'SUCCEED', label: 'Clear hazard' },
    { num: '04', title: 'NEXT', label: 'Advance stage' }
  ];

  return (
    <section id="training" className="section">
      <div className="container">
        <div className="section-head centered" data-reveal="up">
          <span className="kicker">02 / Training</span>
          <h2>Guidance fades as confidence grows.</h2>
          <p>
            Difficulty is structured around cognitive support levels rather than artificial time pressure,
            ensuring seniors learn at their own comfortable pace.
          </p>
        </div>

        <div className="training-grid stagger-group">
          {levels.map(lvl => (
            <article className="training-card" key={lvl.tier}>
              <div className="training-card-image">
                <img src={lvl.image} alt={`${lvl.tier} mode training in RumahKuVR`} loading="lazy" />
                <span className={`training-badge ${lvl.badgeClass}`}>{lvl.tier} Mode</span>
              </div>
              <div className="training-card-body">
                <div className="training-card-head">
                  <h3>{lvl.title}</h3>
                  <span className="training-stat-num">{lvl.stat}</span>
                </div>
                <p>{lvl.desc}</p>
                <ul className="training-card-features">
                  {lvl.features.map(f => (
                    <li key={f}><Check size={14} /> {f}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="tutorial-banner" data-reveal="up">
          <div className="tutorial-copy">
            <span className="kicker" style={{ marginBottom: '6px' }}>Tutorial Philosophy</span>
            <h3>See. Try. Succeed. Next.</h3>
            <p>
              Tutorials teach through direct physical interaction. Visual coachmarks highlight controls only
              when focus is required, keeping interfaces unobtrusive.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="hero-top-badge">In-Engine Coachmarks</span>
              <span className="hero-top-badge">Non-blocking Guidance</span>
            </div>
          </div>

          <div className="tutorial-steps-row">
            {tutorialSteps.map((step, idx) => (
              <div
                key={step.num}
                className={`tutorial-step-box ${activeStep === idx ? 'active' : ''}`}
                onClick={() => setActiveStep(idx)}
                onMouseEnter={() => setActiveStep(idx)}
                role="button"
                tabIndex={0}
                aria-label={`Step ${step.num}: ${step.title} - ${step.label}`}
              >
                <small>{step.num}</small>
                <strong>{step.title}</strong>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{step.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   04 GAMEPLAY & PROJECT EVIDENCE (Bento Gallery with Accessible Modal)
   -------------------------------------------------------------------------- */
function GameplayShowcase() {
  const [activeItem, setActiveItem] = useState(null);

  const galleryItems = [
    {
      file: '/images/project/peta-bahaya-map.webp',
      title: 'House Hazard Map (Peta Bahaya)',
      tag: 'System Navigation',
      desc: 'Interactive architectural layout tracking identified and cleared hazards across the Malaysian home.'
    },
    {
      file: '/images/gameplay/hazard-kitchen-storage.webp',
      title: 'Kitchen High Storage Hazard',
      tag: 'Fall Risk Detection',
      desc: 'Detecting overhead storage risks and practicing safe footstool repositioning in the kitchen.'
    },
    {
      file: '/images/gameplay/hazard-cat-walkway.webp',
      title: 'Pet Walkway Tripping Hazard',
      tag: 'Obstacle Management',
      desc: 'Identifying floor obstacles and safely relocating pet bowls to prevent senior stumbling.'
    },
    {
      file: '/images/project/session-result.webp',
      title: 'Session Result Scorecard',
      tag: 'Performance Feedback',
      desc: 'Immediate feedback screen showing hazards solved, completion time, and safety rating.'
    },
    {
      file: '/images/project/caregiver-dashboard.webp',
      title: 'Caregiver Oversight Portal',
      tag: 'Caregiver Portal',
      desc: 'Caregiver view showing monitored senior session history, hazard trends, and guided setups.'
    },
    {
      file: '/images/dashboard-senior.jpg',
      title: 'Senior Login & Mode Portal',
      tag: 'Accessible Interface',
      desc: 'High-contrast, low-cognitive-load portal for starting simulations and reviewing progress.'
    }
  ];

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape' && activeItem) {
        setActiveItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeItem]);

  return (
    <section id="gameplay" className="section section-alt">
      <div className="container">
        <div className="section-head centered" data-reveal="up">
          <span className="kicker">03 / Evidence</span>
          <h2>Inside RumahKuVR.</h2>
          <p>
            Curated in-engine captures demonstrating actual gameplay mechanics, senior-friendly interfaces,
            and caregiver telemetry built in Unity 6.3.
          </p>
        </div>

        <div className="gallery-grid stagger-group">
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              className="gallery-card"
              onClick={() => setActiveItem(item)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setActiveItem(item)}
              aria-label={`View ${item.title}`}
            >
              <img src={item.file} alt={item.title} loading="lazy" />
              <div className="gallery-card-overlay">
                <div className="gallery-card-info">
                  <small>{item.tag}</small>
                  <b>{item.title}</b>
                </div>
                <ArrowUpRight size={16} />
              </div>
            </div>
          ))}
        </div>

        {activeItem && (
          <div
            className="modal-backdrop"
            onClick={() => setActiveItem(null)}
            role="dialog"
            aria-modal="true"
            aria-label={activeItem.title}
          >
            <div className="modal-container" onClick={e => e.stopPropagation()}>
              <div className="modal-media">
                <img src={activeItem.file} alt={activeItem.title} />
              </div>
              <div className="modal-footer">
                <div className="modal-footer-copy">
                  <small>{activeItem.tag}</small>
                  <h4>{activeItem.title}</h4>
                  <p style={{ fontSize: '13px', margin: 0 }}>{activeItem.desc}</p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setActiveItem(null)}
                  style={{ padding: '8px 14px' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   05 PLATFORM: VR + CONTROLLER MODE
   -------------------------------------------------------------------------- */
function PlatformHardware() {
  return (
    <section id="platform" className="section">
      <div className="container">
        <div className="section-head centered" data-reveal="up">
          <span className="kicker">04 / Ecosystem</span>
          <h2>Two ways to enter the same safe home.</h2>
          <p>
            RumahKuVR adapts to the user’s physical mobility. Experience full spatial immersion with
            Meta Quest 3 or train comfortably seated using universal gamepad controls.
          </p>
        </div>

        <div className="platform-grid">
          <article className="platform-card" data-reveal="left">
            <div className="platform-card-header">
              <span className="kicker" style={{ marginBottom: 0 }}>Immersive Mode</span>
              <h3>Meta Quest 3 Headset</h3>
              <p>
                Room-scale VR training with direct two-handed environmental interaction, spatial depth cues,
                and physical hazard handling.
              </p>
            </div>
            <div className="platform-card-media">
              <img
                src="/images/meta-quest-3-real.webp"
                alt="Meta Quest 3 headset and Touch Plus controllers"
                loading="lazy"
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="hero-top-badge">6DoF Room Scale</span>
              <span className="hero-top-badge">Senior Eye-Level HUD</span>
              <span className="hero-top-badge">Natural Grasp Physics</span>
            </div>
          </article>

          <article className="platform-card" data-reveal="right">
            <div className="platform-card-header">
              <span className="kicker" style={{ marginBottom: 0 }}>Accessible Seated Mode</span>
              <h3>Universal Gamepad Support</h3>
              <p>
                Full safety training accessibility for seniors who prefer seated training. Standardized actions
                across symmetrical and offset controller layouts.
              </p>
            </div>

            <div className="controllers-duo">
              <div className="controller-subcard">
                <img
                  src="/images/controller-ps4-real.webp"
                  alt="PlayStation style controller layout reference"
                  loading="lazy"
                />
                <strong>PS-Style Layout</strong>
                <span>Symmetrical thumbsticks</span>
              </div>

              <div className="controller-subcard">
                <img
                  src="/images/controller-xbox-real.webp"
                  alt="Xbox style controller layout reference"
                  loading="lazy"
                />
                <strong>Xbox-Style Layout</strong>
                <span>Offset thumbsticks</span>
              </div>
            </div>

            <p style={{ fontSize: '11px', color: 'var(--text-faint)', margin: 0 }}>
              *Controller references illustrate standardized button mapping. RumahKuVR supports generic Bluetooth gamepads.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   06 MULTI-ROLE SYSTEM (Smooth Crossfade Tabs)
   -------------------------------------------------------------------------- */
function RolePerspectives() {
  const [role, setRole] = useState('senior');

  const roleData = {
    senior: {
      kicker: '01 / Senior User',
      title: 'Train with clarity & low cognitive load.',
      body: 'Large text interfaces, intuitive voice prompts, and direct hazard feedback ensure older adults can train independently without feeling overwhelmed.',
      image: '/images/dashboard-senior.jpg',
      points: [
        'Accessible, large-format navigation',
        'Malay voice guidance and visual cues',
        'Personal progress and hazard checklist'
      ]
    },
    caregiver: {
      kicker: '02 / Caregiver Support',
      title: 'Monitor progress & guide sessions.',
      body: 'Caregivers review session completion logs, monitor recurring hazard vulnerabilities, and configure guided scenarios tailored to the senior’s needs.',
      image: '/images/project/caregiver-dashboard.webp',
      points: [
        'Monitored session history & timestamps',
        'Vulnerability breakdown by room area',
        'Customized hazard guidance setup'
      ]
    },
    admin: {
      kicker: '03 / Administrator',
      title: 'System telemetry & hazard catalogue.',
      body: 'Maintain system integrity, inspect session telemetry, manage user credentials, and update hazard thresholds across the training catalogue.',
      image: '/images/performance-report.jpg',
      points: [
        'User and session account management',
        'Hazard catalogue and asset controls',
        'System reporting and data integrity'
      ]
    }
  };

  const current = roleData[role];

  return (
    <section id="roles" className="section section-alt">
      <div className="container">
        <div className="section-head centered" data-reveal="up">
          <span className="kicker">05 / Stakeholders</span>
          <h2>One system, three tailored perspectives.</h2>
          <p>
            RumahKuVR connects seniors, family caregivers, and administrators inside a collaborative safety ecosystem.
          </p>
        </div>

        <div className="roles-wrapper" data-reveal="scale">
          <div className="roles-copy-side">
            <div className="role-tab-buttons" role="tablist" aria-label="User Roles">
              {['senior', 'caregiver', 'admin'].map(key => (
                <button
                  type="button"
                  key={key}
                  className={`role-tab-btn ${role === key ? 'active' : ''}`}
                  onClick={() => setRole(key)}
                  role="tab"
                  aria-selected={role === key}
                >
                  {key}
                </button>
              ))}
            </div>

            <div className="role-details" key={role}>
              <span className="kicker">{current.kicker}</span>
              <h3>{current.title}</h3>
              <p>{current.body}</p>

              <ul className="role-points-list">
                {current.points.map((pt, i) => (
                  <li key={i}>
                    <Check size={15} />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="roles-media-side" key={`media-${role}`}>
            <img src={current.image} alt={`${role} interface in RumahKuVR`} loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   07 SENIOR-FIRST ACCESSIBILITY
   -------------------------------------------------------------------------- */
function SeniorAccessibility() {
  const principles = [
    {
      num: '01',
      title: 'Senior-Calibrated Typography',
      desc: 'Minimum 15px body copy, generous line-height, and strong contrast ratios exceeding WCAG AAA standards.'
    },
    {
      num: '02',
      title: 'Malay Voice Guidance',
      desc: 'Spoken Malay audio instructions reinforce visual spotlights without forcing excessive text reading.'
    },
    {
      num: '03',
      title: 'High Contrast Mode',
      desc: 'One-click contrast toggles adapt UI elements to varying visual acuity and lighting environments.'
    },
    {
      num: '04',
      title: 'Predictable Controller Mapping',
      desc: 'Standardized interactions with no rapid button-mashing or complex multi-key combinations.'
    },
    {
      num: '05',
      title: 'Controlled Near-Fall Feedback',
      desc: 'Safe audio and visual alerts replace violent camera shakes to prevent dizziness and disorientation.'
    },
    {
      num: '06',
      title: 'Progressive Guidance Fading',
      desc: 'Visual cues automatically adjust across Easy, Medium, and Hard tiers to foster independent mastery.'
    }
  ];

  return (
    <section id="accessibility" className="section">
      <div className="container">
        <div className="section-head centered" data-reveal="up">
          <span className="kicker">06 / Ergonomics</span>
          <h2>Designed to be understood, not decoded.</h2>
          <p>
            Every interface element, audio cue, and VR interaction was refined to accommodate the sensory
            and physical needs of older adults.
          </p>
        </div>

        <div className="a11y-principles-grid stagger-group">
          {principles.map(item => (
            <div className="a11y-principle-card" key={item.num}>
              <div className="a11y-principle-header">
                <strong>{item.num}</strong>
                <Accessibility size={16} style={{ color: 'var(--accent)' }} />
              </div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   08 SYSTEM ARCHITECTURE & DEVELOPMENT JOURNEY
   -------------------------------------------------------------------------- */
function SystemAndJourney() {
  const pipeline = [
    { step: '01', title: 'User Input', sub: 'Meta Quest / Gamepad' },
    { step: '02', title: 'Unity XR Engine', sub: 'Physics & 6DoF' },
    { step: '03', title: 'Hazard Detection', sub: 'Proximity & Scanning' },
    { step: '04', title: 'Corrective Logic', sub: 'Action Verification' },
    { step: '05', title: 'Session Telemetry', sub: 'Score & Time Data' },
    { step: '06', title: 'IRIS Reporting', sub: 'Caregiver Portal' }
  ];

  const journey = [
    { step: '01', title: 'Planning', desc: 'Problem framing, senior safety literature review, and hazard cataloging.' },
    { step: '02', title: 'UX Design', desc: 'Low-cognitive load UI wireframes, Malay audio script, and controller layout.' },
    { step: '03', title: 'Unity Build', desc: 'Malaysian home environment, OpenXR integration, and hazard state logic.' },
    { step: '04', title: 'Flow Testing', desc: 'VR grab affordances, near-fall feedback safety, and difficulty tuning.' },
    { step: '05', title: 'Refinement', desc: 'Visual polish, tutorial coachmark cues, and caregiver telemetry integration.' },
    { step: '06', title: 'Presentation', desc: 'Final project showcase, documentation, and evaluator demonstration.' }
  ];

  return (
    <section id="system" className="section section-alt">
      <div className="container">
        <div className="section-head centered" data-reveal="up">
          <span className="kicker">07 / Architecture</span>
          <h2>Built as an interaction system, not a slideshow.</h2>
          <p>
            RumahKuVR ties together player input, physical interaction, hazard verification, and caregiver
            telemetry inside one robust Unity XR architecture.
          </p>
        </div>

        <div className="architecture-box" data-reveal="scale">
          <span className="kicker">Interaction Pipeline</span>
          <div className="pipeline-flow stagger-group">
            {pipeline.map(node => (
              <div className="pipeline-node" key={node.step}>
                <small>{node.step}</small>
                <strong>{node.title}</strong>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{node.sub}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="section-head" style={{ marginBottom: '20px' }} data-reveal="up">
          <span className="kicker">Development Journey</span>
          <h3>Milestone Progression</h3>
        </div>

        <div className="timeline-row stagger-group">
          {journey.map(item => (
            <div className="timeline-step-item" key={item.step}>
              <small>{item.step} / PHASE</small>
              <strong>{item.title}</strong>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="iris-disclaimer" data-reveal="up">
          <ShieldAlert size={20} />
          <p>
            <strong>Academic Evaluation Note:</strong> Performance dashboards represent verified system demonstration
            prototypes for the Final Year Project showcase.
          </p>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   09 PROJECT INFORMATION & CONTACT
   -------------------------------------------------------------------------- */
function ProjectContact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [state, setState] = useState({ status: 'idle', message: '' });

  async function handleSubmit(e) {
    e.preventDefault();
    setState({ status: 'loading', message: 'Saving message…' });

    try {
      const token = document.querySelector('meta[name="csrf-token"]')?.content;
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': token
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Unable to save message.');
      setState({ status: 'success', message: 'Message sent successfully. Thank you!' });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setState({ status: 'error', message: err.message || 'Error sending message.' });
    }
  }

  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="contact-grid">
          <div className="contact-info-side" data-reveal="left">
            <span className="kicker">08 / Project Information</span>
            <h2>Safer habits through immersive learning.</h2>
            <p>
              RumahKuVR is developed as a Final Year Project by <strong>Muhammad Thaqif Fahmi Bin Rafie'e</strong>,
              Diploma in Information Technology (Software Application Development).
            </p>

            <div className="contact-meta-card">
              <div className="contact-meta-row">
                <GraduationCap size={18} />
                <span>Final Year Project · Software Application Development</span>
              </div>
              <div className="contact-meta-row">
                <Layers size={18} />
                <span>Unity 6.3 LTS · Meta Quest 3 · Laravel · React</span>
              </div>
              <div className="contact-meta-row">
                <ShieldCheck size={18} />
                <span>Malaysian Home Safety & Senior Fall Prevention</span>
              </div>
            </div>
          </div>

          <div className="contact-form-side" data-reveal="right">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    maxLength={100}
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    maxLength={160}
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  type="text"
                  required
                  maxLength={160}
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  required
                  maxLength={3000}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={state.status === 'loading'}
                style={{ width: '100%' }}
              >
                <span>{state.status === 'loading' ? 'Sending…' : 'Send Message'}</span>
                <ArrowRight size={15} />
              </button>

              {state.message && (
                <div className={`form-status ${state.status}`} role="status">
                  {state.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   ACCESSIBILITY DOCK (Contrast & Large Text Toggles)
   -------------------------------------------------------------------------- */
function AccessibilityDock() {
  const [contrast, setContrast] = useState(false);
  const [large, setLarge] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', contrast);
  }, [contrast]);

  useEffect(() => {
    document.documentElement.classList.toggle('large-type', large);
  }, [large]);

  return (
    <div className="a11y-dock">
      <button
        type="button"
        className="a11y-dock-btn"
        onClick={() => setContrast(v => !v)}
        aria-pressed={contrast}
        title="Toggle High Contrast Mode"
      >
        <Accessibility size={15} />
        <span>Contrast</span>
      </button>

      <button
        type="button"
        className="a11y-dock-btn"
        onClick={() => setLarge(v => !v)}
        aria-pressed={large}
        title="Toggle Larger Text Mode"
      >
        <span style={{ fontWeight: 700 }}>Aa</span>
        <span>Text</span>
      </button>
    </div>
  );
}

/* --------------------------------------------------------------------------
   ROOT APP COMPONENT
   -------------------------------------------------------------------------- */
function App() {
  const { theme, toggleTheme } = useTheme();
  useScrollReveal();

  return (
    <>
      <Nav theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <ProblemExperience />
        <TrainingProgression />
        <GameplayShowcase />
        <PlatformHardware />
        <RolePerspectives />
        <SeniorAccessibility />
        <SystemAndJourney />
        <ProjectContact />
      </main>
      <footer className="site-footer">
        <div className="footer-inner">
          <span>RumahKuVR · Final Year Project · 2026</span>
          <a href="#home" className="btn-link" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Back to top</span>
            <ArrowRight size={13} style={{ transform: 'rotate(-90deg)' }} />
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
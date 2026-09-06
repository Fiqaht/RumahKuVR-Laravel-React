/* --------------------------------------------------------------------------
   RUMAHKUVR — MOTION PRIMITIVES

   Everything here is plain React + browser APIs: no animation library.
   Two rules hold throughout:

   1. Every continuous effect runs inside a single requestAnimationFrame loop
      that is started on pointer/scroll and stops itself once it settles, so
      nothing burns frames while idle or off-screen.
   2. `usePrefersReducedMotion()` gates every JS-driven effect. When motion is
      reduced, hooks resolve to their finished state immediately instead of
      animating. CSS carries the same guard for transition-driven effects.
   -------------------------------------------------------------------------- */

import { useCallback, useEffect, useRef, useState } from 'react';

/* --------------------------------------------------------------------------
   REDUCED MOTION
   -------------------------------------------------------------------------- */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = e => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/* --------------------------------------------------------------------------
   FINE POINTER + WIDTH GATE
   Pointer-driven depth effects are desktop-only: they cost frames, and on a
   touch device a "hover" tilt only ever fires as a jarring tap.
   -------------------------------------------------------------------------- */
export function useCanHover(minWidth = 1024) {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minWidth}px) and (hover: hover) and (pointer: fine)`);
    const apply = () => setOk(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [minWidth]);

  return ok;
}

/* --------------------------------------------------------------------------
   SCROLL REVEAL

   One IntersectionObserver for the whole page. A MutationObserver picks up
   nodes React mounts later (role panels, coverflow captions) and hands them
   to the same observer on the next frame, so reveals keep working without a
   provider or a ref on every element.
   -------------------------------------------------------------------------- */
export function useScrollReveal(rootSelector = 'body') {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = document.querySelector(rootSelector) || document.body;

    if (reduced) {
      root.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-visible'));
      return undefined;
    }

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.1 }
    );

    const observeAll = node => {
      if (node.nodeType !== 1) return;
      if (node.hasAttribute('data-reveal') && !node.classList.contains('is-visible')) io.observe(node);
      node.querySelectorAll?.('[data-reveal]:not(.is-visible)').forEach(el => io.observe(el));
    };

    observeAll(root);

    let queued = false;
    const mo = new MutationObserver(records => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        records.forEach(r => r.addedNodes.forEach(observeAll));
      });
    });
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, [rootSelector, reduced]);
}

/* Per-element variant, for components that need to know when they are in view
   (count-ups, the pipeline rail) rather than just add a class. */
export function useInView({ threshold = 0.25, once = true, rootMargin = '0px' } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.unobserve(entry.target);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once, rootMargin]);

  return [ref, inView];
}

/* --------------------------------------------------------------------------
   SCROLL PROGRESS
   Written straight to a CSS custom property so React never re-renders on
   scroll — the progress bar is a pure compositor-side scaleX.
   -------------------------------------------------------------------------- */
export function useScrollProgress(targetRef) {
  useEffect(() => {
    let frame = 0;

    const write = () => {
      frame = 0;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
      const el = targetRef.current;
      if (el) {
        el.style.setProperty('--progress', ratio.toFixed(4));
        el.setAttribute('aria-valuenow', String(Math.round(ratio * 100)));
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(write);
    };

    write();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [targetRef]);
}

/* --------------------------------------------------------------------------
   ACTIVE SECTION
   -------------------------------------------------------------------------- */
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return undefined;

    const ratios = new Map();

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => ratios.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
        let best = null;
        let bestRatio = 0;
        ratios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        });
        if (best) setActive(best);
      },
      { rootMargin: '-25% 0px -45% 0px', threshold: [0, 0.15, 0.35, 0.6, 1] }
    );

    sections.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, [ids]);

  return active;
}

/* --------------------------------------------------------------------------
   COUNT UP
   easeOutExpo, rAF-driven, and a straight jump to the target when motion is
   reduced. Used only for figures that are literally true (18 / 3 / 2).
   -------------------------------------------------------------------------- */
export function useCountUp(target, active, duration = 1100) {
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(reduced ? target : 0);

  useEffect(() => {
    if (!active) return undefined;
    if (reduced) {
      setValue(target);
      return undefined;
    }

    let frame = 0;
    let start = 0;

    const tick = now => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / duration);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, duration, reduced]);

  return value;
}

/* --------------------------------------------------------------------------
   POINTER TILT + SPOTLIGHT

   Sets --tilt-x / --tilt-y / --mx / --my on the element and lets CSS decide
   what to do with them. The rAF loop lerps toward the pointer and shuts down
   once it is within half a hundredth of the target, so a resting card costs
   nothing.
   -------------------------------------------------------------------------- */
export function useTilt({ max = 5, scale = 1, enabled = true } = {}) {
  const ref = useRef(null);
  const state = useRef({ tx: 0, ty: 0, cx: 0, cy: 0, mx: 50, my: 50, frame: 0, active: false });

  const stop = useCallback(() => {
    if (state.current.frame) {
      cancelAnimationFrame(state.current.frame);
      state.current.frame = 0;
    }
  }, []);

  const loop = useCallback(() => {
    const el = ref.current;
    const s = state.current;
    if (!el) return stop();

    s.cx += (s.tx - s.cx) * 0.14;
    s.cy += (s.ty - s.cy) * 0.14;

    el.style.setProperty('--tilt-y', `${(s.cx * max).toFixed(3)}deg`);
    el.style.setProperty('--tilt-x', `${(-s.cy * max).toFixed(3)}deg`);
    el.style.setProperty('--tilt-scale', s.active ? String(scale) : '1');

    if (Math.abs(s.tx - s.cx) < 0.002 && Math.abs(s.ty - s.cy) < 0.002) {
      s.cx = s.tx;
      s.cy = s.ty;
      s.frame = 0;
      return undefined;
    }
    s.frame = requestAnimationFrame(loop);
    return undefined;
  }, [max, scale, stop]);

  const start = useCallback(() => {
    if (!state.current.frame) state.current.frame = requestAnimationFrame(loop);
  }, [loop]);

  const onPointerMove = useCallback(
    e => {
      if (!enabled) return;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const s = state.current;
      s.tx = px - 0.5;
      s.ty = py - 0.5;
      s.active = true;
      el.style.setProperty('--mx', `${(px * 100).toFixed(2)}%`);
      el.style.setProperty('--my', `${(py * 100).toFixed(2)}%`);
      start();
    },
    [enabled, start]
  );

  const onPointerLeave = useCallback(() => {
    const s = state.current;
    s.tx = 0;
    s.ty = 0;
    s.active = false;
    start();
  }, [start]);

  useEffect(() => stop, [stop]);

  useEffect(() => {
    const el = ref.current;
    if (el && !enabled) {
      el.style.removeProperty('--tilt-x');
      el.style.removeProperty('--tilt-y');
      el.style.removeProperty('--tilt-scale');
    }
  }, [enabled]);

  return enabled
    ? { ref, onPointerMove, onPointerLeave }
    : { ref };
}

/* --------------------------------------------------------------------------
   SCROLL PARALLAX
   Writes a translateY custom property while the element is on screen only.
   -------------------------------------------------------------------------- */
export function useParallax(strength = 26, enabled = true) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) {
      el?.style.setProperty('--parallax', '0px');
      return undefined;
    }

    let frame = 0;
    let visible = false;

    const write = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const centre = (r.top + r.height / 2 - vh / 2) / vh; // -1 .. 1 ish
      el.style.setProperty('--parallax', `${(centre * strength).toFixed(2)}px`);
    };

    const onScroll = () => {
      if (visible && !frame) frame = requestAnimationFrame(write);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) onScroll();
    });

    io.observe(el);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      io.disconnect();
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [strength, enabled]);

  return ref;
}

/* --------------------------------------------------------------------------
   BODY SCROLL LOCK — for the lightbox
   -------------------------------------------------------------------------- */
export function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return undefined;
    const { body } = document;
    const previous = body.style.overflow;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.style.overflow = previous;
      body.style.paddingRight = '';
    };
  }, [locked]);
}

/* --------------------------------------------------------------------------
   FOCUS TRAP — for the lightbox
   -------------------------------------------------------------------------- */
export function useFocusTrap(active) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active) return undefined;
    const node = ref.current;
    if (!node) return undefined;

    const previouslyFocused = document.activeElement;
    const selector =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

    const focusables = () => [...node.querySelectorAll(selector)].filter(el => el.offsetParent !== null);
    focusables()[0]?.focus();

    const onKeyDown = e => {
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    node.addEventListener('keydown', onKeyDown);
    return () => {
      node.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [active]);

  return ref;
}

/* --------------------------------------------------------------------------
   MAGNETIC POINTER RESPONSE

   The button leans toward the cursor while the cursor is near it, and settles
   back when it leaves. Used on the two hero calls to action and nowhere else:
   the effect works because it is rare, and a page where every control chases
   the pointer is a page that feels unstable.

   Follows the same contract as useTilt — one rAF loop that lerps toward the
   target and shuts itself down once it is within a tenth of a pixel, so a
   button at rest costs nothing. The lerp runs in both directions, including
   the return to centre, which is why the CSS carries no transition on
   `translate`: easing an already-eased value reads as lag.
   -------------------------------------------------------------------------- */
export function useMagnetic({ strength = 0.28, max = 9, enabled = true } = {}) {
  const ref = useRef(null);
  const state = useRef({ tx: 0, ty: 0, cx: 0, cy: 0, frame: 0 });

  const stop = useCallback(() => {
    if (state.current.frame) {
      cancelAnimationFrame(state.current.frame);
      state.current.frame = 0;
    }
  }, []);

  const loop = useCallback(() => {
    const el = ref.current;
    const s = state.current;
    if (!el) return stop();

    s.cx += (s.tx - s.cx) * 0.18;
    s.cy += (s.ty - s.cy) * 0.18;

    el.style.setProperty('--mag-x', `${s.cx.toFixed(2)}px`);
    el.style.setProperty('--mag-y', `${s.cy.toFixed(2)}px`);

    if (Math.abs(s.tx - s.cx) < 0.1 && Math.abs(s.ty - s.cy) < 0.1) {
      s.cx = s.tx;
      s.cy = s.ty;
      el.style.setProperty('--mag-x', `${s.tx.toFixed(2)}px`);
      el.style.setProperty('--mag-y', `${s.ty.toFixed(2)}px`);
      s.frame = 0;
      return undefined;
    }
    s.frame = requestAnimationFrame(loop);
    return undefined;
  }, [stop]);

  const start = useCallback(() => {
    if (!state.current.frame) state.current.frame = requestAnimationFrame(loop);
  }, [loop]);

  const onPointerMove = useCallback(
    e => {
      if (!enabled) return;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const s = state.current;
      // Clamped so a wide button never throws itself further than `max`,
      // which is what turns a magnetic lean into a wobble.
      s.tx = Math.max(-max, Math.min(max, (e.clientX - (r.left + r.width / 2)) * strength));
      s.ty = Math.max(-max, Math.min(max, (e.clientY - (r.top + r.height / 2)) * strength));
      start();
    },
    [enabled, strength, max, start]
  );

  const onPointerLeave = useCallback(() => {
    const s = state.current;
    s.tx = 0;
    s.ty = 0;
    start();
  }, [start]);

  useEffect(() => stop, [stop]);

  // Leaving a stale offset behind when the effect is switched off (a resize
  // across the hover breakpoint) would strand the button a few pixels adrift.
  useEffect(() => {
    const el = ref.current;
    if (el && !enabled) {
      el.style.removeProperty('--mag-x');
      el.style.removeProperty('--mag-y');
    }
  }, [enabled]);

  return enabled ? { ref, onPointerMove, onPointerLeave } : {};
}

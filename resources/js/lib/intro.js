/* --------------------------------------------------------------------------
   RUMAHKUVR — OPENING SEQUENCE COORDINATOR

   The opening sequence itself is CSS, declared inline in app.blade.php so the
   stage is painted on the first frame. This module owns the one decision CSS
   cannot make: *when* the curtain is allowed to part.

   Two rules govern that decision.

   1. Never before the brand phase has read. The mark scans in and the wordmark
      resolves on a fixed CSS ladder; parting the curtain over the top of that
      would throw away the half-second the sequence is built around.

   2. Never before the hero exists. The overlay is presentation, not a loading
      screen — but a curtain that opens onto an unmounted React tree is worse
      than one that waits a beat. `begin()` is called from the hero's own layout
      effect, so by the time anything here schedules an open, the hero DOM is
      committed and the LCP capture (requested by the <head> preload long
      before this file ran) is already in flight.

   The result: on a warm load the curtain parts on schedule; on a slow one it
   waits for the hero rather than revealing nothing. Neither path delays the
   hero's own rendering, because nothing here gates it.
   -------------------------------------------------------------------------- */

import { useSyncExternalStore } from 'react';

/* Phases, in order. Components read these to know whether their own entrance
   is due yet — the hero's counters in particular, which must not spend their
   count-up hidden behind the curtain. */
export const PHASE_BRAND = 'brand';
export const PHASE_OPENING = 'opening';
export const PHASE_DONE = 'done';

const TIMING = {
  desktop: { open: 570, teardown: 1320 },
  mobile: { open: 420, teardown: 1020 }
};

let phase = PHASE_BRAND;
let started = false;
const listeners = new Set();

function setPhase(next) {
  if (phase === next) return;
  phase = next;
  listeners.forEach(fn => fn(next));
}

export function getPhase() {
  return phase;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function prefersReduced() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/* Reduced motion, or no overlay in the document at all (a stale cached shell,
   say): resolve straight to the finished page. `is-hero-in` still goes on, so
   the hero's own entrance rules land on their finished state rather than
   leaving anything stranded at opacity 0. */
function finishImmediately(node) {
  document.documentElement.classList.add('is-hero-in');
  node?.remove();
  setPhase(PHASE_DONE);
}

export function begin() {
  if (started) return;
  started = true;

  const node = document.getElementById('rkv-intro');
  const root = document.documentElement;

  if (!node || prefersReduced()) {
    finishImmediately(node);
    return;
  }

  const isMobile = window.matchMedia('(max-width: 720px)').matches;
  const { open, teardown } = isMobile ? TIMING.mobile : TIMING.desktop;

  /* The CSS ladder is timed from first paint, so the wait is measured from the
     same origin — `__RKV_T0` is stamped in the first rAF after the document
     parses. If that stamp is missing for any reason, treat now as the origin
     and run the full ladder rather than skipping ahead. */
  const t0 = window.__RKV_T0;
  const elapsed = typeof t0 === 'number' ? performance.now() - t0 : 0;
  const wait = Math.max(0, open - elapsed);

  window.setTimeout(() => {
    /* Both classes land in the same frame on purpose: the curtain begins to
       part and the hero begins its own entrance together, so the hero is
       already in motion in the gaps between the rising tiles rather than
       waiting for a bare stage to clear. */
    node.classList.add('is-opening');
    root.classList.add('is-hero-in');
    setPhase(PHASE_OPENING);

    window.setTimeout(() => {
      node.remove();
      setPhase(PHASE_DONE);
    }, teardown - open);
  }, wait);
}

/* --------------------------------------------------------------------------
   REACT BINDING

   useSyncExternalStore, not useState + useEffect. The phase is a store that
   lives outside React and can advance in the window between a component
   rendering and its effects running — `begin()` resolves synchronously under
   reduced motion, and its timers can fire before React has flushed passive
   effects. A hook that seeded state at render and only then subscribed would
   miss that transition permanently and sit on a stale phase forever, which is
   exactly how the hero's counters ended up stranded at zero.

   useSyncExternalStore re-reads the store after subscribing, so a phase change
   in that window is picked up rather than lost.
   -------------------------------------------------------------------------- */
export function useIntroPhase() {
  return useSyncExternalStore(subscribe, getPhase, getPhase);
}

/* True once the curtain has begun to part — the cue for anything whose
   entrance is choreographed against the opening rather than against scroll. */
export function useIntroOpened() {
  return useIntroPhase() !== PHASE_BRAND;
}

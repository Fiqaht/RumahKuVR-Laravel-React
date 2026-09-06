/* --------------------------------------------------------------------------
   RUMAHKUVR — OPENING SEQUENCE BRIDGE

   The opening sequence does not live here. It lives in app.blade.php — its
   markup, its CSS ladder and the controller that opens it are all inline in
   the document, because the sequence is a gate the visitor opens by hand and
   the thing that opens it cannot be allowed to arrive late. If the gate were
   part of this bundle, a slow or failed chunk would leave someone looking at
   a house they cannot click.

   What is left here is the bridge: a React binding onto the store the inline
   controller already exposes as `window.__RKV_INTRO`. Components use it to
   know whether their own entrance is due yet — the hero's counters in
   particular, which must not spend their count-up hidden behind the curtain.

   Phases, in order:
     brand    — Act I is running: the mark scans in, the wordmark resolves,
                the brand parks and the house builds itself.
     live     — Act I has finished. The house is clickable and the sequence is
                waiting for a person. It can sit here indefinitely.
     entering — the visitor has acted; the volume is igniting.
     done     — the curtain has parted and the stage has been removed.
   -------------------------------------------------------------------------- */

import { useSyncExternalStore } from 'react';

export const PHASE_BRAND = 'brand';
export const PHASE_LIVE = 'live';
export const PHASE_ENTERING = 'entering';
export const PHASE_DONE = 'done';

/* A stand-in for the rare case where this module is evaluated without the
   inline controller having run — a stale cached shell, or a document assembled
   by something other than the Blade view. Reporting `done` is the safe answer:
   every component that reads the phase uses it to decide whether to hold an
   entrance back, and holding one back forever is the only real failure mode. */
const FALLBACK = {
  get: () => PHASE_DONE,
  subscribe: () => () => {},
  enter: () => {},
  ready: () => {}
};

function controller() {
  return (typeof window !== 'undefined' && window.__RKV_INTRO) || FALLBACK;
}

export function getPhase() {
  return controller().get();
}

export function subscribe(fn) {
  return controller().subscribe(fn);
}

/* Open the gate from application code. Nothing in the site calls this today —
   the visitor opens it — but it is the seam a "skip intro" control would use. */
export function enter() {
  controller().enter();
}

/* Tell the gate the page behind it has mounted. Called once, from the hero's
   own layout effect: that is the first moment the hero's DOM is committed, and
   the gate will not offer itself to be opened before then. */
export function markReady() {
  controller().ready();
}

export function useIntroPhase() {
  return useSyncExternalStore(subscribe, getPhase, getPhase);
}

/* True once the curtain has begun to part — the cue for anything whose
   entrance is choreographed against the opening rather than against scroll. */
export function useIntroOpened() {
  const phase = useIntroPhase();
  return phase === PHASE_ENTERING || phase === PHASE_DONE;
}

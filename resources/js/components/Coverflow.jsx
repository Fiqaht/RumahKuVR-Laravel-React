/* --------------------------------------------------------------------------
   RUMAHKUVR — COVERFLOW GALLERY

   A looping 3D carousel: perspective, rotateY, depth stacking, drag/swipe,
   keyboard control, pagination and a live caption.

   Implementation note — during a drag the slide transforms are written
   straight to the DOM from one rAF loop rather than through React state.
   A pointer move fires far more often than we want to re-render ten slides,
   so React only re-renders when the *committed* index changes (captions,
   dots, aria state); everything between two indices is compositor work.
   -------------------------------------------------------------------------- */

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { usePrefersReducedMotion, useCanHover } from '../lib/motion';

const SPACING = 0.56; // horizontal step, as a fraction of slide width
const ANGLE = 34; // degrees of rotateY per step
const DEPTH = 130; // px pushed back per step
const SHRINK = 0.09; // scale lost per step
const VISIBLE = 3; // steps rendered either side of centre
const DRAG_THRESHOLD = 5; // px of travel before a press counts as a drag

export default function Coverflow({ items, onOpen, label = 'Gameplay gallery' }) {
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);

  const reduced = usePrefersReducedMotion();
  const canHover = useCanHover(768);

  const stageRef = useRef(null);
  const slideRefs = useRef([]);
  const posRef = useRef(0);
  const dragRef = useRef({
    active: false, moved: false, captured: false,
    pointerId: -1, startX: 0, startPos: 0, width: 1, frame: 0
  });

  const count = items.length;

  /* ---- layout ---------------------------------------------------------- */
  const applyLayout = useCallback(
    pos => {
      const nodes = slideRefs.current;
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        if (!node) continue;

        let offset = i - pos;
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;

        const abs = Math.abs(offset);
        const beyond = abs > VISIBLE + 0.5;

        node.style.transform =
          `translate3d(${offset * SPACING * 100}%, 0, ${-abs * DEPTH}px) ` +
          `rotateY(${-offset * ANGLE}deg) ` +
          `scale(${Math.max(0.5, 1 - abs * SHRINK)})`;
        node.style.zIndex = String(100 - Math.round(abs * 10));
        node.style.opacity = beyond ? '0' : String(Math.max(0, 1 - abs * 0.26));
        node.style.pointerEvents = beyond ? 'none' : 'auto';
        node.style.visibility = beyond ? 'hidden' : 'visible';
        node.classList.toggle('is-active', abs < 0.5);
      }
    },
    [count]
  );

  useLayoutEffect(() => {
    posRef.current = index;
    applyLayout(index);
  }, [index, applyLayout]);

  useEffect(() => {
    const onResize = () => applyLayout(posRef.current);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [applyLayout]);

  /* ---- navigation ------------------------------------------------------ */
  const goTo = useCallback(next => setIndex(((next % count) + count) % count), [count]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  const onKeyDown = e => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    } else if (e.key === 'Home') {
      e.preventDefault();
      goTo(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goTo(count - 1);
    }
  };

  /* ---- drag / swipe ----------------------------------------------------

     Pointer capture is taken LATE, and only once the pointer has actually
     travelled DRAG_THRESHOLD px.

     Capturing on pointerdown — which is the obvious place to do it — silently
     breaks clicking. Once the stage holds the capture, every later pointer
     event for that pointer is retargeted to the stage, so pointerup no longer
     lands on the card. The browser derives the click target from the nearest
     common ancestor of pointerdown and pointerup, which is then the stage, and
     the nested <button> never receives a click at all. Deferring the capture
     leaves a plain press untouched, so the native button click still fires. */
  const onPointerDown = e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const stage = stageRef.current;
    if (!stage) return;

    const d = dragRef.current;
    d.active = true;
    d.moved = false;
    d.captured = false;
    d.pointerId = e.pointerId;
    d.startX = e.clientX;
    d.startPos = posRef.current;
    // One step of travel is SPACING x the SLIDE width (that is what the
    // transform uses), not the stage width. The stage runs the full viewport,
    // so measuring against it made a drag roughly three times less responsive
    // than the cards it was moving. offsetWidth is the untransformed layout
    // width, which is what the percentage translate resolves against.
    const slide = slideRefs.current.find(Boolean);
    d.width = (slide?.offsetWidth || stage.offsetWidth) * SPACING;
    // Deliberately no setPointerCapture here — see the note above.
  };

  const onPointerMove = e => {
    const d = dragRef.current;
    if (!d.active || e.pointerId !== d.pointerId) return;

    const dx = e.clientX - d.startX;

    // Below the threshold this is still a click in progress: stay out of the
    // way entirely so the button keeps its own event sequence.
    if (!d.moved) {
      if (Math.abs(dx) < DRAG_THRESHOLD) return;
      d.moved = true;
      try {
        stageRef.current?.setPointerCapture?.(e.pointerId);
        d.captured = true;
      } catch {
        d.captured = false; // capture is an optimisation, not a requirement
      }
      setDragging(true);
    }

    posRef.current = d.startPos - dx / Math.max(1, d.width);

    if (!d.frame) {
      d.frame = requestAnimationFrame(() => {
        d.frame = 0;
        applyLayout(posRef.current);
      });
    }
  };

  const releaseCapture = pointerId => {
    const d = dragRef.current;
    if (!d.captured) return;
    const stage = stageRef.current;
    try {
      if (stage?.hasPointerCapture?.(pointerId)) stage.releasePointerCapture(pointerId);
    } catch {
      /* pointer already gone (cancelled, or the element was detached) */
    }
    d.captured = false;
  };

  const endDrag = e => {
    const d = dragRef.current;
    if (!d.active) return;
    d.active = false;
    if (d.frame) {
      cancelAnimationFrame(d.frame);
      d.frame = 0;
    }
    releaseCapture(e.pointerId);

    // A press that never crossed the threshold changed no position and must
    // not be snapped — the click that follows is the user's actual intent.
    if (!d.moved) return;

    setDragging(false);
    const settled = Math.round(posRef.current);
    if (settled === index) applyLayout(index);
    goTo(settled);
  };

  useEffect(() => {
    const d = dragRef.current;
    return () => {
      if (d.frame) cancelAnimationFrame(d.frame);
    };
  }, []);

  const activate = i => {
    if (dragRef.current.moved) return; // a drag, not a click
    if (i === index) onOpen?.(items[i], i);
    else goTo(i);
  };

  /* Chrome will not hit-test the off-centre slides: they are rotated in 3D
     inside a perspective context, and only the untransformed centre slide
     resolves through elementFromPoint. Their bounding rectangles are correct
     though, so the same test is done here by hand — nearest card on top wins,
     matching the painted z-order. Without this a side card cannot be selected
     by pointer at all, only by keyboard or the arrow buttons. */
  const slideIndexAt = (clientX, clientY) => {
    let best = null;
    let bestZ = -Infinity;
    slideRefs.current.forEach((node, i) => {
      if (!node || node.style.visibility === 'hidden') return;
      const r = node.getBoundingClientRect();
      if (clientX < r.left || clientX > r.right || clientY < r.top || clientY > r.bottom) return;
      const z = Number(node.style.zIndex) || 0;
      if (z > bestZ) {
        bestZ = z;
        best = i;
      }
    });
    return best;
  };

  const onStageClick = e => {
    if (dragRef.current.moved) return; // the click that trails a drag
    if (e.target.closest?.('.coverflow-card')) return; // the centre card handled itself
    const i = slideIndexAt(e.clientX, e.clientY);
    if (i !== null && i !== index) goTo(i);
  };

  const current = items[index];

  return (
    <div className="coverflow">
      <div
        ref={stageRef}
        className={`coverflow-stage ${dragging ? 'is-dragging' : ''} ${reduced ? 'is-reduced' : ''}`}
        role="group"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClick={onStageClick}
      >
        <div className="coverflow-track">
          {items.map((item, i) => (
            <div
              key={item.file}
              ref={el => {
                slideRefs.current[i] = el;
              }}
              className="coverflow-slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${item.title}`}
              aria-hidden={i === index ? undefined : true}
            >
              <button
                type="button"
                className="coverflow-card"
                onClick={() => activate(i)}
                tabIndex={i === index ? 0 : -1}
                aria-label={i === index ? `Open ${item.title} full size` : `Show ${item.title}`}
              >
                <img
                  src={item.file}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  fetchPriority={i === 0 ? 'auto' : 'low'}
                  draggable={false}
                />
                <span className="coverflow-card-sheen" aria-hidden="true" />
                <span className="coverflow-card-tag">{item.tag}</span>
                {i === index && canHover ? (
                  <span className="coverflow-card-open" aria-hidden="true">
                    <Maximize2 size={14} strokeWidth={2} />
                    <span>View full size</span>
                  </span>
                ) : null}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="coverflow-caption" aria-live="polite">
        <div className="coverflow-caption-copy" key={current.file}>
          <span className="coverflow-caption-tag">{current.tag}</span>
          <h3>{current.title}</h3>
          {current.ms ? <p className="coverflow-caption-ms">{current.ms}</p> : null}
          <p>{current.desc}</p>
        </div>
      </div>

      <div className="coverflow-controls">
        <button type="button" className="coverflow-nav" onClick={prev} aria-label="Previous capture">
          <ChevronLeft size={18} strokeWidth={2} />
        </button>

        <div className="coverflow-dots" role="group" aria-label="Choose a capture">
          {items.map((item, i) => (
            <button
              key={item.file}
              type="button"
              className={`coverflow-dot ${i === index ? 'is-active' : ''}`}
              aria-current={i === index ? 'true' : undefined}
              aria-label={`${i + 1} of ${count}: ${item.title}`}
              onClick={() => goTo(i)}
            >
              <span />
            </button>
          ))}
        </div>

        <span className="coverflow-count" aria-hidden="true">
          {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </span>

        <button type="button" className="coverflow-nav" onClick={next} aria-label="Next capture">
          <ChevronRight size={18} strokeWidth={2} />
        </button>
      </div>

      <p className="coverflow-hint">Drag, swipe or use the arrow keys. Select the centre capture to enlarge it.</p>
    </div>
  );
}

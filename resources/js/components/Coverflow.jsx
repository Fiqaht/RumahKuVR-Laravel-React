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

export default function Coverflow({ items, onOpen, label = 'Gameplay gallery' }) {
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);

  const reduced = usePrefersReducedMotion();
  const canHover = useCanHover(768);

  const stageRef = useRef(null);
  const slideRefs = useRef([]);
  const posRef = useRef(0);
  const dragRef = useRef({ active: false, startX: 0, startPos: 0, moved: false, width: 1, frame: 0 });

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

  /* ---- drag / swipe ---------------------------------------------------- */
  const onPointerDown = e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const stage = stageRef.current;
    if (!stage) return;

    const d = dragRef.current;
    d.active = true;
    d.moved = false;
    d.startX = e.clientX;
    d.startPos = posRef.current;
    d.width = stage.getBoundingClientRect().width * SPACING;
    stage.setPointerCapture?.(e.pointerId);
    setDragging(true);
  };

  const onPointerMove = e => {
    const d = dragRef.current;
    if (!d.active) return;

    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 4) d.moved = true;
    posRef.current = d.startPos - dx / Math.max(1, d.width);

    if (!d.frame) {
      d.frame = requestAnimationFrame(() => {
        d.frame = 0;
        applyLayout(posRef.current);
      });
    }
  };

  const endDrag = e => {
    const d = dragRef.current;
    if (!d.active) return;
    d.active = false;
    if (d.frame) {
      cancelAnimationFrame(d.frame);
      d.frame = 0;
    }
    stageRef.current?.releasePointerCapture?.(e.pointerId);
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

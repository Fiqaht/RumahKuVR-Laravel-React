/* --------------------------------------------------------------------------
   RUMAHKUVR — LIGHTBOX

   The single fullscreen viewer for every capture on the site. The Gameplay
   coverflow drives it with prev/next; individual figures open it with just an
   item. Escape closes, the backdrop closes, focus is trapped while open,
   background scroll is locked, and focus returns to the trigger on close.

   Most of these screenshots are in-headset UI with small Malay labels, so the
   viewer also zooms: 1x / 1.5x / 2x / 3x by button, wheel or pinch, with
   drag-to-pan once magnified.
   -------------------------------------------------------------------------- */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Maximize, Minus, Plus, X } from 'lucide-react';
import { useFocusTrap, useScrollLock } from '../lib/motion';

const LEVELS = [1, 1.5, 2, 3];
const MIN_SCALE = LEVELS[0];
const MAX_SCALE = LEVELS[LEVELS.length - 1];
const PAN_THRESHOLD = 4; // px before a press becomes a pan

export default function Lightbox({ item, onClose, onPrev, onNext, position }) {
  const open = Boolean(item);
  const trapRef = useFocusTrap(open);
  useScrollLock(open);

  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const mediaRef = useRef(null);
  const imgRef = useRef(null);
  const panRef = useRef({ active: false, moved: false, captured: false, pointerId: -1, startX: 0, startY: 0, originX: 0, originY: 0 });
  const pinchRef = useRef({ points: new Map(), startDist: 0, startScale: 1 });

  const zoomed = scale > 1.001;

  /* Keep the image inside the frame: at scale s the image overflows its box by
     (s - 1) / 2 in each direction, and that is exactly how far it may travel. */
  const clamp = useCallback((next, atScale) => {
    const media = mediaRef.current;
    const img = imgRef.current;
    if (!media || !img) return { x: 0, y: 0 };
    const mr = media.getBoundingClientRect();
    const base = { w: img.offsetWidth, h: img.offsetHeight };
    const maxX = Math.max(0, (base.w * atScale - mr.width) / 2);
    const maxY = Math.max(0, (base.h * atScale - mr.height) / 2);
    return {
      x: Math.min(maxX, Math.max(-maxX, next.x)),
      y: Math.min(maxY, Math.max(-maxY, next.y))
    };
  }, []);

  const applyScale = useCallback(
    (next, focal) => {
      const target = Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
      setScale(prev => {
        if (target === MIN_SCALE) {
          setOffset({ x: 0, y: 0 });
          return target;
        }
        // Keep whatever sits under the cursor/pinch centre pinned in place.
        setOffset(o => {
          if (!focal) return clamp(o, target);
          const ratio = target / prev;
          return clamp({ x: focal.x - (focal.x - o.x) * ratio, y: focal.y - (focal.y - o.y) * ratio }, target);
        });
        return target;
      });
    },
    [clamp]
  );

  const stepZoom = dir => {
    const i = LEVELS.findIndex(l => l > scale + 0.001);
    const currentIndex = i === -1 ? LEVELS.length - 1 : Math.max(0, i - 1);
    const nextIndex = Math.min(LEVELS.length - 1, Math.max(0, currentIndex + dir));
    applyScale(LEVELS[nextIndex]);
  };

  const resetZoom = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  /* Zoom resets whenever the viewer opens or the capture changes, so a new
     image never inherits the previous one's magnification. */
  useEffect(() => {
    resetZoom();
  }, [item?.file, resetZoom]);

  /* ---- keyboard -------------------------------------------------------- */
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = e => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onPrev?.();
      else if (e.key === 'ArrowRight') onNext?.();
      else if (e.key === '+' || e.key === '=') { e.preventDefault(); stepZoom(1); }
      else if (e.key === '-' || e.key === '_') { e.preventDefault(); stepZoom(-1); }
      else if (e.key === '0') { e.preventDefault(); resetZoom(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose, onPrev, onNext, scale, resetZoom]);

  /* ---- wheel zoom ------------------------------------------------------
     Registered manually because it must be non-passive to preventDefault. */
  useEffect(() => {
    const media = mediaRef.current;
    if (!open || !media) return undefined;
    const onWheel = e => {
      e.preventDefault();
      const rect = media.getBoundingClientRect();
      const focal = { x: e.clientX - rect.left - rect.width / 2, y: e.clientY - rect.top - rect.height / 2 };
      applyScale(scale * (e.deltaY < 0 ? 1.18 : 1 / 1.18), focal);
    };
    media.addEventListener('wheel', onWheel, { passive: false });
    return () => media.removeEventListener('wheel', onWheel);
  }, [open, scale, applyScale]);

  /* ---- pan + pinch ----------------------------------------------------- */
  const onPointerDown = e => {
    const p = pinchRef.current;
    p.points.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (p.points.size === 2) {
      const [a, b] = [...p.points.values()];
      p.startDist = Math.hypot(a.x - b.x, a.y - b.y);
      p.startScale = scale;
      return;
    }
    if (!zoomed) return; // nothing to pan at fit-to-screen

    const d = panRef.current;
    d.active = true;
    d.moved = false;
    d.captured = false;
    d.pointerId = e.pointerId;
    d.startX = e.clientX;
    d.startY = e.clientY;
    d.originX = offset.x;
    d.originY = offset.y;
  };

  const onPointerMove = e => {
    const p = pinchRef.current;
    if (p.points.has(e.pointerId)) p.points.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (p.points.size === 2 && p.startDist > 0) {
      const [a, b] = [...p.points.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const rect = mediaRef.current?.getBoundingClientRect();
      const focal = rect
        ? { x: (a.x + b.x) / 2 - rect.left - rect.width / 2, y: (a.y + b.y) / 2 - rect.top - rect.height / 2 }
        : null;
      applyScale(p.startScale * (dist / p.startDist), focal);
      return;
    }

    const d = panRef.current;
    if (!d.active || e.pointerId !== d.pointerId) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;

    if (!d.moved) {
      if (Math.hypot(dx, dy) < PAN_THRESHOLD) return;
      d.moved = true;
      try {
        mediaRef.current?.setPointerCapture?.(e.pointerId);
        d.captured = true;
      } catch {
        d.captured = false;
      }
    }
    setOffset(clamp({ x: d.originX + dx, y: d.originY + dy }, scale));
  };

  const endPointer = e => {
    const p = pinchRef.current;
    p.points.delete(e.pointerId);
    if (p.points.size < 2) p.startDist = 0;

    const d = panRef.current;
    if (!d.active) return;
    d.active = false;
    if (d.captured) {
      try {
        if (mediaRef.current?.hasPointerCapture?.(e.pointerId)) mediaRef.current.releasePointerCapture(e.pointerId);
      } catch {
        /* pointer already gone */
      }
      d.captured = false;
    }
  };

  const goPrev = () => { resetZoom(); onPrev?.(); };
  const goNext = () => { resetZoom(); onNext?.(); };

  if (!open) return null;

  const label = item.title || item.alt || 'Capture';

  /* Rendered into <body>, never in place. A viewer mounted next to its trigger
     inherits that container's rules — `.roles-media img { object-fit: cover }`
     was cropping the capture — and any transformed ancestor (the tilt cards)
     would become the containing block for `position: fixed`, pinning the
     overlay to the card instead of the viewport. */
  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={label} onClick={onClose}>
      <div className="lightbox-panel" ref={trapRef} onClick={e => e.stopPropagation()}>
        <div
          ref={mediaRef}
          className={`lightbox-media ${zoomed ? 'is-zoomed' : ''}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endPointer}
          onPointerCancel={endPointer}
          onDoubleClick={() => (zoomed ? resetZoom() : applyScale(2))}
        >
          <img
            ref={imgRef}
            src={item.file}
            alt={item.alt || item.title}
            draggable={false}
            style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}
          />
        </div>

        <div className="lightbox-footer">
          <div className="lightbox-copy">
            {item.tag ? <span className="lightbox-tag">{item.tag}</span> : null}
            <h3>{label}</h3>
            {item.desc ? <p>{item.desc}</p> : null}
          </div>

          <div className="lightbox-actions">
            <div className="lightbox-zoom" role="group" aria-label="Zoom">
              <button
                type="button"
                className="btn-icon"
                onClick={() => stepZoom(-1)}
                disabled={scale <= MIN_SCALE + 0.001}
                aria-label="Zoom out"
              >
                <Minus size={16} strokeWidth={2.2} />
              </button>
              <span className="lightbox-zoom-level" aria-live="polite">
                {scale.toFixed(1).replace('.0', '')}&times;
              </span>
              <button
                type="button"
                className="btn-icon"
                onClick={() => stepZoom(1)}
                disabled={scale >= MAX_SCALE - 0.001}
                aria-label="Zoom in"
              >
                <Plus size={16} strokeWidth={2.2} />
              </button>
              <button
                type="button"
                className="btn-icon"
                onClick={resetZoom}
                disabled={!zoomed}
                aria-label="Fit image to screen"
                title="Fit to screen"
              >
                <Maximize size={15} strokeWidth={2} />
              </button>
            </div>

            {onPrev ? (
              <button type="button" className="btn-icon" onClick={goPrev} aria-label="Previous capture">
                <ChevronLeft size={18} strokeWidth={2} />
              </button>
            ) : null}
            {position ? (
              <span className="lightbox-count" aria-hidden="true">
                {position}
              </span>
            ) : null}
            {onNext ? (
              <button type="button" className="btn-icon" onClick={goNext} aria-label="Next capture">
                <ChevronRight size={18} strokeWidth={2} />
              </button>
            ) : null}

            <button type="button" className="btn btn-secondary lightbox-close" onClick={onClose}>
              <X size={16} strokeWidth={2} />
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

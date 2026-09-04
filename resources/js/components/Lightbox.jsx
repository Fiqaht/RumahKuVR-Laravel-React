/* --------------------------------------------------------------------------
   RUMAHKUVR — LIGHTBOX

   Escape to close, click the backdrop to close, focus trapped inside while
   open, background scroll locked, and focus returned to the trigger on close.
   -------------------------------------------------------------------------- */

import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useFocusTrap, useScrollLock } from '../lib/motion';

export default function Lightbox({ item, onClose, onPrev, onNext, position }) {
  const open = Boolean(item);
  const trapRef = useFocusTrap(open);
  useScrollLock(open);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = e => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onPrev?.();
      else if (e.key === 'ArrowRight') onNext?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose, onPrev, onNext]);

  if (!open) return null;

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={item.title} onClick={onClose}>
      <div className="lightbox-panel" ref={trapRef} onClick={e => e.stopPropagation()}>
        <div className="lightbox-media">
          <img src={item.file} alt={item.alt || item.title} />
        </div>

        <div className="lightbox-footer">
          <div className="lightbox-copy">
            <span className="lightbox-tag">{item.tag}</span>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>

          <div className="lightbox-actions">
            {onPrev ? (
              <button type="button" className="btn-icon" onClick={onPrev} aria-label="Previous capture">
                <ChevronLeft size={18} strokeWidth={2} />
              </button>
            ) : null}
            {position ? (
              <span className="lightbox-count" aria-hidden="true">
                {position}
              </span>
            ) : null}
            {onNext ? (
              <button type="button" className="btn-icon" onClick={onNext} aria-label="Next capture">
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
    </div>
  );
}

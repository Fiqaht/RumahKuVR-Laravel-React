/* --------------------------------------------------------------------------
   RUMAHKUVR — SHARED PRESENTATION PRIMITIVES
   -------------------------------------------------------------------------- */

import React, { useCallback, useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { useCountUp, useInView, useTilt, useCanHover, usePrefersReducedMotion } from '../lib/motion';
import Lightbox from './Lightbox';

/* --------------------------------------------------------------------------
   SPLIT TEXT
   Word-level reveal. The words stay real text nodes inside the heading, so
   screen readers and text selection behave exactly as they would without it.
   -------------------------------------------------------------------------- */
export function SplitText({ as: Tag = 'span', text, className = '', delay = 0, step = 42 }) {
  const words = String(text).split(' ');

  return (
    <Tag className={`split ${className}`.trim()} data-reveal="split">
      {words.map((word, i) => (
        <React.Fragment key={`${word}-${i}`}>
          <span className="split-word">
            <span className="split-word-inner" style={{ transitionDelay: `${delay + i * step}ms` }}>
              {word}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </Tag>
  );
}

/* --------------------------------------------------------------------------
   SECTION HEADING
   -------------------------------------------------------------------------- */
export function SectionHead({ kicker, title, children, centered = false, className = '' }) {
  return (
    <header className={`section-head ${centered ? 'centered' : ''} ${className}`.trim()}>
      <span className="kicker" data-reveal="up">
        {kicker}
      </span>
      <SplitText as="h2" text={title} delay={90} />
      {children ? (
        <p className="lede" data-reveal="up" style={{ transitionDelay: '160ms' }}>
          {children}
        </p>
      ) : null}
    </header>
  );
}

/* --------------------------------------------------------------------------
   COUNTER
   -------------------------------------------------------------------------- */
export function Counter({ value, suffix = '', pad = true }) {
  // threshold 0, not 0.6: these spans are only a few px wide, and a fast
  // flick scroll can pass one without ever sampling a 60%-visible frame,
  // which would strand the number at zero.
  const [ref, inView] = useInView({ threshold: 0 });
  const shown = useCountUp(value, inView);
  const text = pad && value < 10 ? String(shown).padStart(2, '0') : String(shown);

  return (
    <span ref={ref} className="counter">
      {text}
      {suffix}
    </span>
  );
}

/* --------------------------------------------------------------------------
   ZOOM TRIGGER

   Wraps an existing <img> in a real <button> without changing the surrounding
   layout: the button is a transparent, full-size block, so the container keeps
   its own sizing, aspect-ratio and hover transitions and the image keeps
   matching every `.parent img` rule already written for it.

   Used for the captures that carry small in-headset Malay text, where reading
   the screenshot is the point. Decorative and product imagery is left alone.
   -------------------------------------------------------------------------- */
export function ZoomTrigger({ item, label, children, className = '' }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={`zoom-trigger ${className}`.trim()}
        onClick={() => setOpen(true)}
        aria-label={`View ${label} full size`}
        aria-haspopup="dialog"
      >
        {children}
        <span className="zoom-hint" aria-hidden="true">
          <Maximize2 size={13} strokeWidth={2.2} />
          <span>View full size</span>
        </span>
      </button>

      <Lightbox item={open ? item : null} onClose={() => setOpen(false)} />
    </>
  );
}

/* --------------------------------------------------------------------------
   FIGURE
   An image that fades and un-blurs the moment it decodes, wrapped in a frame
   that can carry a clip-path reveal. Prevents the "grey box snaps to photo"
   flash on slower connections without shipping a placeholder for every asset.
   -------------------------------------------------------------------------- */
export function Figure({
  src,
  alt,
  caption,
  className = '',
  reveal = 'clip',
  eager = false,
  zoomable = false,
  zoomTag,
  zoomDesc,
  width,
  height,
  sizes,
  children
}) {
  const [loaded, setLoaded] = useState(false);

  // A cached image can finish loading before React ever fires onLoad, which
  // would leave it stuck at opacity 0. Check `complete` on mount as well.
  const imgRef = useCallback(node => {
    if (node?.complete) setLoaded(true);
  }, []);

  const image = (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      loading={eager ? 'eager' : 'lazy'}
      decoding={eager ? 'sync' : 'async'}
      fetchPriority={eager ? 'high' : undefined}
      onLoad={() => setLoaded(true)}
      className={loaded ? 'is-loaded' : ''}
    />
  );

  return (
    <figure className={`figure ${className}`.trim()} data-reveal={reveal}>
      <div className="figure-media">
        {zoomable ? (
          <ZoomTrigger
            label={caption || alt}
            item={{ file: src, alt, title: caption || alt, tag: zoomTag, desc: zoomDesc }}
          >
            {image}
          </ZoomTrigger>
        ) : (
          image
        )}
        {children}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

/* --------------------------------------------------------------------------
   TILT CARD
   Depth-on-hover wrapper. Falls back to a plain element wherever a fine
   pointer is unavailable or the viewport is narrow.
   -------------------------------------------------------------------------- */
export function TiltCard({ as: Tag = 'div', className = '', max = 4, scale = 1.006, children, ...rest }) {
  const canHover = useCanHover();
  const reduced = usePrefersReducedMotion();
  // CSS already neutralises the transform under reduced motion; gating here
  // stops the rAF loop from running at all.
  const tilt = useTilt({ max, scale, enabled: canHover && !reduced });

  return (
    <Tag className={`tilt ${className}`.trim()} {...tilt} {...rest}>
      {children}
    </Tag>
  );
}

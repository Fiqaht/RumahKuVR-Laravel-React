/* --------------------------------------------------------------------------
   RUMAHKUVR — DEMO REEL

   One clip, one frame, one decision at the end of it.

   The video is a real in-engine capture: a camera walked through the kampung
   house of the Mod Sederhana scene in Unity 6.3, past the hazard signage, the
   folded carpet and the utility clutter, into the kitchen. It is silent by
   design — there is nothing here that needs narration, and a silent clip never
   ambushes anyone.

   Three states, and the frame never moves between them:
     idle    — the poster, with the play control over it.
     playing — chrome recedes to a thin control bar.
     ended   — the closing panel, where the clip earns its call to action.

   Everything is native <video>: no player library, no analytics shim, no
   autoplay. The file is not requested at all until the visitor asks for it
   (`preload="none"`), so the section costs one poster image to anybody who
   scrolls past it.
   -------------------------------------------------------------------------- */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { SplitText } from './primitives';

const SRC = '/video/rumahkuvr-house-walkthrough.mp4';

/* The still is an <img>, not the video's `poster` attribute.

   A poster is fetched eagerly whatever `preload` says, so the 165KB frame was
   going out at 262ms alongside the hero capture on a page where the section is
   four screens down. As an image it can be lazy and responsive: it is not
   requested until the reel is near the viewport, and a phone takes the 34KB
   candidate instead of the full one. */
const POSTER = '/video/rumahkuvr-house-walkthrough-poster.webp';
const POSTER_SM = '/video/rumahkuvr-house-walkthrough-poster-800w.webp';

/* Chapters, in seconds, matched to the camera path that produced the clip.
   They are labels rather than controls: the reel is twelve seconds long, and a
   scrubbing UI on twelve seconds would be furniture. */
const BEATS = [
  { at: 0, label: 'Entrance hall' },
  { at: 3.4, label: 'Living room · two hazards' },
  { at: 7.2, label: 'Corridor to the kitchen' },
  { at: 9.8, label: 'Dapur' }
];

export default function DemoReel() {
  const videoRef = useRef(null);
  const [state, setState] = useState('idle'); // idle | playing | paused | ended
  const [progress, setProgress] = useState(0);
  const [beat, setBeat] = useState(0);

  const play = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    /* A rejected play() is normal — a power-saving mode, or a policy that
       refuses even a muted start. Falling back to the idle state leaves the
       poster and the control exactly where they were rather than stranding
       the frame mid-transition. */
    v.play().then(
      () => setState('playing'),
      () => setState('idle')
    );
  }, []);

  const pause = useCallback(() => {
    videoRef.current?.pause();
    setState('paused');
  }, []);

  const replay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    play();
  }, [play]);

  const toggle = useCallback(() => {
    if (state === 'playing') pause();
    else if (state === 'ended') replay();
    else play();
  }, [state, pause, play, replay]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return undefined;

    const onTime = () => {
      if (!v.duration) return;
      setProgress(v.currentTime / v.duration);
      let i = 0;
      for (let n = 0; n < BEATS.length; n += 1) if (v.currentTime >= BEATS[n].at) i = n;
      setBeat(i);
    };
    const onEnded = () => setState('ended');
    const onPause = () => setState(s => (s === 'playing' ? 'paused' : s));

    v.addEventListener('timeupdate', onTime);
    v.addEventListener('ended', onEnded);
    v.addEventListener('pause', onPause);
    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('ended', onEnded);
      v.removeEventListener('pause', onPause);
    };
  }, []);

  /* The closing CTA carries a subject into the contact form rather than
     dropping the visitor at a blank one. The form owns its own state, so this
     goes through the window as an event instead of lifting that state up
     through four components that have no other reason to know about it. */
  const requestDemo = () => {
    window.dispatchEvent(
      new CustomEvent('rkv:contact-prefill', {
        detail: { subject: 'Request a RumahKuVR demo session' }
      })
    );
  };

  const idle = state === 'idle';
  const ended = state === 'ended';

  return (
    <section id="demo" className="section demo-section" data-reveal="edge">
      <div className="container">
        <div className="demo-head">
          <div>
            <span className="kicker" data-reveal="up">
              Demo reel
            </span>
            <SplitText as="h2" text="One take, through the whole house." delay={90} />
          </div>
          <p className="lede demo-head-note" data-reveal="up" style={{ transitionDelay: '160ms' }}>
            Front hall to kitchen in twelve seconds, no cuts. Captured in the Unity editor from the Mod
            Sederhana scene — the same rooms, signage and props a senior walks through in the headset.
          </p>
        </div>

        {/* The player's state is a data attribute for the same reason the tier
            panels' selected state is: this element carries `data-reveal`, and
            the scroll-reveal observer marks it by adding a class. Rewriting
            `className` on play would wipe that mark and drop the whole frame
            back to opacity 0 the instant the clip started. */}
        <figure className="demo-frame" data-state={state} data-reveal="scale">
          <div className="demo-media">
            {/* Only while nothing has been played: once the clip has frames of
                its own, the still would cover a paused frame. */}
            {idle ? (
              <img
                className="demo-poster"
                sizes="(max-width: 720px) calc(100vw - 32px), (max-width: 1024px) 92vw, min(1280px, 88vw)"
                srcSet={`${POSTER_SM} 800w, ${POSTER} 1600w`}
                src={POSTER_SM}
                alt=""
                width={1600}
                height={900}
                loading="lazy"
                decoding="async"
              />
            ) : null}

            <video
              ref={videoRef}
              className="demo-video"
              src={SRC}
              preload="none"
              playsInline
              muted
              /* Not a control surface itself — the overlay button below owns
                 the interaction, so native chrome would be a second, worse
                 set of controls sitting on top of it. */
              controls={false}
              aria-label="RumahKuVR walkthrough: a continuous camera pass through the kampung house, from the entrance hall past the hazard signage and the folded carpet to the kitchen"
            />

            {/* The one control. It is the whole frame while the poster is up,
                and shrinks to a corner button once the clip is running. */}
            <button
              type="button"
              className="demo-trigger"
              onClick={toggle}
              aria-label={
                state === 'playing' ? 'Pause the walkthrough' : ended ? 'Replay the walkthrough' : 'Play the walkthrough'
              }
            >
              <span className="demo-trigger-face" aria-hidden="true">
                {state === 'playing' ? <Pause size={20} strokeWidth={2} /> : <Play size={20} strokeWidth={2} />}
              </span>
              {idle ? (
                <span className="demo-trigger-label" aria-hidden="true">
                  Play the walkthrough
                  <small>12 seconds · in-engine · silent</small>
                </span>
              ) : null}
            </button>

            {/* Closing panel. Held out of the accessibility tree until it is on
                screen, so the two calls to action are not announced or
                tabbable while the clip is still running. */}
            <div className="demo-end" hidden={!ended}>
              <p className="demo-end-kicker">You have seen the house</p>
              <p className="demo-end-title">Eighteen hazards are hidden in it.</p>
              <div className="demo-end-actions">
                <a href="#contact" className="btn btn-primary" onClick={requestDemo}>
                  <span>Request a demo session</span>
                  <ArrowRight size={16} strokeWidth={2.2} />
                </a>
                <button type="button" className="btn btn-secondary" onClick={replay}>
                  <Play size={15} strokeWidth={2.2} />
                  <span>Watch again</span>
                </button>
              </div>
            </div>

            {/* Playing chrome: where you are in the clip, and which room. */}
            <div className="demo-bar" aria-hidden="true">
              <span className="demo-bar-beat">{BEATS[beat].label}</span>
              <span className="demo-bar-track">
                <i style={{ transform: `scaleX(${progress})` }} />
              </span>
              {/* No sound control, because there is no sound track. A muted
                  speaker icon on a file with no audio is a lie about the
                  asset. */}
              <span className="demo-bar-silent">Silent</span>
            </div>
          </div>

          <figcaption className="demo-caption">
            In-engine capture · Unity 6.3 LTS · Mod Sederhana scene · no post-production beyond a fade in and out
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

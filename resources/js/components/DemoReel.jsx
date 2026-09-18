/* --------------------------------------------------------------------------
   RUMAHKUVR — DEMO REEL

   One clip, one frame, one decision at the end of it.

   The clip is the sixty-second gameplay trailer. Every shot in it is a real
   capture out of the Unity 6.3 build — first-person passes through the kampung
   house with the hands and the HUD the headset actually draws, the build's own
   hazard cards, its session result and its caregiver portal. The motion
   graphics around them are the only thing that was added.

   Unlike the walkthrough this replaced, it has a soundtrack: house ambience,
   the build's own interaction SFX and a score cut to the same grid as the
   picture. So the reel now owns a sound control, and the play button says what
   is about to happen before it happens.

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
import { ArrowRight, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { SplitText } from './primitives';

const SRC = '/video/rumahkuvr-trailer.mp4';

/* The still is an <img>, not the video's `poster` attribute.

   A poster is fetched eagerly whatever `preload` says, so the frame was going
   out alongside the hero capture on a page where the section is four screens
   down. As an image it can be lazy and responsive: it is not requested until
   the reel is near the viewport, and a phone takes the smaller candidate
   instead of the full one. */
const POSTER = '/video/rumahkuvr-trailer-poster.webp';
const POSTER_SM = '/video/rumahkuvr-trailer-poster-800w.webp';

/* Chapters, in seconds, matched to the trailer's cut points. They are labels
   rather than controls: the reel is sixty seconds long, and a scrubbing UI on
   sixty seconds would be furniture. */
const BEATS = [
  { at: 0, label: 'A home should feel safe' },
  { at: 5.5, label: 'Risks in plain sight' },
  { at: 10.5, label: 'RumahKuVR' },
  { at: 14.5, label: 'Spot the risk' },
  { at: 22.5, label: 'Take action' },
  { at: 30.5, label: 'Learn from every session' },
  { at: 36.5, label: 'Three tiers · eighteen hazards' },
  { at: 42.5, label: 'VR and controller' },
  { at: 47.5, label: 'Seniors and caregivers' },
  { at: 52.5, label: 'Practise · Recognise · Respond' }
];

export default function DemoReel() {
  const videoRef = useRef(null);
  const [state, setState] = useState('idle'); // idle | playing | paused | ended
  const [progress, setProgress] = useState(0);
  const [beat, setBeat] = useState(0);
  const [muted, setMuted] = useState(false);

  const play = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    /* Play is always user-initiated here, so sound is allowed and the button
       says so before it is pressed. A policy can still refuse it — a
       power-saving mode, or a profile that blocks audible playback outright —
       and the fallback is to start muted rather than not to start, with the
       control updated so the frame is not lying about its own state. */
    v.play().then(
      () => setState('playing'),
      () => {
        v.muted = true;
        setMuted(true);
        v.play().then(
          () => setState('playing'),
          () => setState('idle')
        );
      }
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

  const toggleSound = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const next = !v.muted;
    v.muted = next;
    setMuted(next);
  }, []);

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
    /* The element is the source of truth for sound: a keyboard user reaching
       the native controls, or a browser muting the tab, both change it without
       going through the button above. */
    const onVolume = () => setMuted(v.muted);

    v.addEventListener('timeupdate', onTime);
    v.addEventListener('ended', onEnded);
    v.addEventListener('pause', onPause);
    v.addEventListener('volumechange', onVolume);
    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('ended', onEnded);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('volumechange', onVolume);
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
              Gameplay trailer
            </span>
            <SplitText as="h2" text="Sixty seconds inside the house." delay={90} />
          </div>
          <p className="lede demo-head-note" data-reveal="up" style={{ transitionDelay: '160ms' }}>
            Cut entirely from in-engine Unity 6.3 captures across all three tiers: the hazards as the
            build flags them, the corrections as a senior performs them, and the session analysis the
            headset writes afterwards.
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
              /* Not a control surface itself — the overlay button below owns
                 the interaction, so native chrome would be a second, worse
                 set of controls sitting on top of it. */
              controls={false}
              aria-label="RumahKuVR gameplay trailer: sixty seconds of in-engine footage, from the darkened kampung house through the hazards the build detects, the corrections a senior carries out, the session analysis, the three difficulty tiers, VR and controller play, and the senior and caregiver interfaces"
            >
              <track kind="captions" srcLang="en" label="No dialogue" />
            </video>

            {/* The one control. It is the whole frame while the poster is up,
                and shrinks to a corner button once the clip is running. */}
            <button
              type="button"
              className="demo-trigger"
              onClick={toggle}
              aria-label={
                state === 'playing' ? 'Pause the trailer' : ended ? 'Replay the trailer' : 'Play the trailer'
              }
            >
              <span className="demo-trigger-face" aria-hidden="true">
                {state === 'playing' ? <Pause size={20} strokeWidth={2} /> : <Play size={20} strokeWidth={2} />}
              </span>
              {idle ? (
                <span className="demo-trigger-label" aria-hidden="true">
                  Watch the RumahKuVR trailer
                  <small>60 seconds · in-engine · with sound</small>
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

            {/* Playing chrome: where you are in the clip, which beat, and the
                one thing about this reel a visitor may actually need to change. */}
            <div className="demo-bar">
              {/* Sound leads the bar rather than closing it. At the right-hand
                  end it sat underneath the page's fixed accessibility dock,
                  which is also pinned bottom-right: the button rendered, but a
                  real click landed on the dock and never reached it. Here it is
                  clear of the dock and next to the play control, which is where
                  the rest of the transport already lives. */}
              <button
                type="button"
                className="demo-bar-sound"
                onClick={toggleSound}
                aria-pressed={muted}
                aria-label={muted ? 'Unmute the trailer' : 'Mute the trailer'}
              >
                {muted ? <VolumeX size={15} strokeWidth={2.1} /> : <Volume2 size={15} strokeWidth={2.1} />}
              </button>
              <span className="demo-bar-beat" aria-hidden="true">
                {BEATS[beat].label}
              </span>
              <span className="demo-bar-track" aria-hidden="true">
                <i style={{ transform: `scaleX(${progress})` }} />
              </span>
            </div>
          </div>

          <figcaption className="demo-caption">
            In-engine capture · Unity 6.3 LTS · Mod Mudah, Sederhana and Sukar · sound built from the
            project's own audio library
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   RUMAHKUVR — DEMO REEL

   One clip, one frame, one decision at the end of it.

   Real controller mode gameplay captured from the Unity 6.3 LTS build:
   controller interaction, hazard detection and correction, Mod Mudah,
   Mod Sederhana, Mod Sukar and session results.

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
import { ArrowRight, Maximize2, Minimize2, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { SplitText } from './primitives';

const SRC = '/video/RumahKuVR_Controller_Mode_Trailer_Web.mp4';

/* The still is an <img>, not the video's `poster` attribute.

   A poster is fetched eagerly whatever `preload` says, so the frame was going
   out alongside the hero capture on a page where the section is four screens
   down. As an image it can be lazy and responsive: it is not requested until
   the reel is near the viewport, and a phone takes the smaller candidate
   instead of the full one. */
const POSTER = '/images/project/hero-hazard-scan.webp';
const POSTER_SM = '/images/project/hero-hazard-scan-800w.webp';

export default function DemoReel() {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [fullscreenError, setFullscreenError] = useState('');
  const [state, setState] = useState('idle'); // idle | playing | paused | ended
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const player = playerRef.current;
    const video = videoRef.current;
    const available = () => setCanFullscreen(Boolean(
      (player.requestFullscreen && document.fullscreenEnabled !== false) ||
      (player.webkitRequestFullscreen && document.webkitFullscreenEnabled !== false) ||
      video.webkitEnterFullscreen
    ));
    const sync = () => setFullscreen(
      document.fullscreenElement === player || document.webkitFullscreenElement === player ||
      Boolean(video.webkitDisplayingFullscreen)
    );
    const begin = () => setFullscreen(true);
    const end = () => setFullscreen(false);
    available();
    document.addEventListener('fullscreenchange', sync);
    document.addEventListener('webkitfullscreenchange', sync);
    video.addEventListener('loadedmetadata', available);
    video.addEventListener('webkitbeginfullscreen', begin);
    video.addEventListener('webkitendfullscreen', end);
    return () => {
      document.removeEventListener('fullscreenchange', sync);
      document.removeEventListener('webkitfullscreenchange', sync);
      video.removeEventListener('loadedmetadata', available);
      video.removeEventListener('webkitbeginfullscreen', begin);
      video.removeEventListener('webkitendfullscreen', end);
    };
  }, []);

  const toggleFullscreen = () => {
    const player = playerRef.current;
    const video = videoRef.current;
    setFullscreenError('');
    try {
      let result;
      if (document.fullscreenElement === player) result = document.exitFullscreen?.();
      else if (document.webkitFullscreenElement === player) result = document.webkitExitFullscreen?.();
      else if (video.webkitDisplayingFullscreen) result = video.webkitExitFullscreen?.();
      else if (player.requestFullscreen && document.fullscreenEnabled !== false) result = player.requestFullscreen();
      else if (player.webkitRequestFullscreen && document.webkitFullscreenEnabled !== false) result = player.webkitRequestFullscreen();
      else if (video.webkitEnterFullscreen) result = video.webkitEnterFullscreen();
      else return;
      // Keep the request in the tap handler; retrying asynchronously can lose user activation.
      Promise.resolve(result).catch(() => setFullscreenError('Fullscreen could not open. Try again after starting the trailer.'));
    } catch {
      setFullscreenError('Fullscreen could not open. Try again after starting the trailer.');
    }
  };

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
    setProgress(0);
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
    };
    const onEnded = () => setState('ended');
    const onPlay = () => setState('playing');
    const onPause = () => setState(s => (s === 'playing' ? 'paused' : s));
    /* The element is the source of truth for sound: a keyboard user reaching
       the native controls, or a browser muting the tab, both change it without
       going through the button above. */
    const onVolume = () => setMuted(v.muted);

    v.addEventListener('play', onPlay);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('ended', onEnded);
    v.addEventListener('pause', onPause);
    v.addEventListener('volumechange', onVolume);
    return () => {
      v.removeEventListener('play', onPlay);
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
  const requestDemo = async event => {
    const player = playerRef.current;
    if (document.fullscreenElement === player || document.webkitFullscreenElement === player) {
      event.preventDefault();
      try {
        if (document.fullscreenElement === player) await document.exitFullscreen?.();
        else await document.webkitExitFullscreen?.();
      } catch {
        setFullscreenError('Exit fullscreen to open the contact form.');
        return;
      }
      document.getElementById('contact')?.scrollIntoView();
    }
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
              Real controller mode gameplay
            </span>
            <SplitText as="h2" text="Controller gameplay in action." delay={90} />
          </div>
          <p className="lede demo-head-note" data-reveal="up" style={{ transitionDelay: '160ms' }}>
            Real gameplay from the RumahKuVR build: controller interaction, hazard detection and
            correction across Mod Mudah, Mod Sederhana and Mod Sukar, followed by the session result.
          </p>
        </div>

        {/* The player's state is a data attribute for the same reason the tier
            panels' selected state is: this element carries `data-reveal`, and
            the scroll-reveal observer marks it by adding a class. Rewriting
            `className` on play would wipe that mark and drop the whole frame
            back to opacity 0 the instant the clip started. */}
        <figure className="demo-frame" data-state={state} data-reveal="scale">
          <div className="demo-player" ref={playerRef}>
            <div className="demo-media">
              {/* Only while nothing has been played: once the clip has frames of
                  its own, the still would cover a paused frame. */}
              {idle ? (
                <img
                  className="demo-poster"
                  sizes="(max-width: 720px) calc(100vw - 32px), (max-width: 1024px) 92vw, min(1280px, 88vw)"
                  srcSet={`${POSTER_SM} 800w, ${POSTER} 1500w`}
                  src={POSTER_SM}
                  alt=""
                  width={1500}
                  height={844}
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
                aria-label="RumahKuVR controller mode gameplay trailer showing hazard detection, corrections, difficulty modes and session results"
              >
                <track kind="captions" srcLang="en" label="No dialogue" />
              </video>

              {/* The poster is a play target; the strip owns playback afterwards. */}
              <button
                type="button"
                className="demo-trigger"
                hidden={!idle}
                onClick={toggle}
                aria-label={
                  state === 'playing' ? 'Pause the controller mode trailer' : ended ? 'Replay the controller mode trailer' : 'Play the controller mode trailer'
                }
              >
                <span className="demo-trigger-face" aria-hidden="true">
                  {state === 'playing' ? <Pause size={20} strokeWidth={2} /> : <Play size={20} strokeWidth={2} />}
                </span>
                {idle ? (
                  <span className="demo-trigger-label" aria-hidden="true">
                    Watch controller mode gameplay
                    <small>In-engine capture · with sound</small>
                  </span>
                ) : null}
              </button>

              {/* Closing panel. Held out of the accessibility tree until it is on
                  screen, so the two calls to action are not announced or
                  tabbable while the clip is still running. */}
              <div className="demo-end" hidden={!ended}>
                <p className="demo-end-kicker">Controller mode gameplay</p>
                <p className="demo-end-title">Detect hazards. Practise corrections.</p>
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

            </div>
            <div className="demo-bar" role="group" aria-label="Controller mode trailer controls">
              <button type="button" className="demo-bar-sound" onClick={toggle}
                aria-label={state === 'playing' ? 'Pause the controller mode trailer' : ended ? 'Replay the controller mode trailer' : 'Play the controller mode trailer'}>
                {state === 'playing' ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button
                type="button"
                className="demo-bar-sound"
                onClick={toggleSound}
                aria-pressed={muted}
                aria-label={muted ? 'Unmute the controller mode trailer' : 'Mute the controller mode trailer'}
              >
                {muted ? <VolumeX size={15} strokeWidth={2.1} /> : <Volume2 size={15} strokeWidth={2.1} />}
              </button>
              <button type="button" className="demo-bar-sound" onClick={toggleFullscreen}
                disabled={!canFullscreen}
                aria-label={!canFullscreen ? 'Fullscreen unavailable in this browser' : fullscreen ? 'Exit controller mode trailer fullscreen' : 'View controller mode trailer fullscreen'}>
                {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              <span className="demo-bar-beat">
                Controller mode gameplay
              </span>
              <span className="demo-bar-track" aria-hidden="true">
                <i style={{ transform: `scaleX(${progress})` }} />
              </span>
            </div>
            {fullscreenError ? <p className="demo-error" role="status">{fullscreenError}</p> : null}
          </div>

          <figcaption className="demo-caption">
            In-engine controller gameplay capture · Unity 6.3 LTS · Mod Mudah, Sederhana and Sukar ·
            recorded from the RumahKuVR build
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

"use client";

import { PauseIcon, PlayIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as React from "react";
import { cn } from "@/lib/utils";

declare global {
  interface Navigator {
    /** Chrome/Edge only; absent elsewhere. */
    getAutoplayPolicy?: (
      type: "mediaelement" | "audiocontext",
    ) => "allowed" | "allowed-muted" | "disallowed";
  }
}

const OPT_OUT_KEY = "whauzan:track-opted-out";

function timecode(seconds: number): string {
  const whole = Math.max(0, Math.floor(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

interface TrackTransportProps extends React.ComponentProps<"div"> {
  src: string;
  title: string;
  /** Known length, so the timecode renders before the file is fetched. */
  seconds: number;
  playLabel: string;
  pauseLabel: string;
  /** The bar field, passed through so it inherits `--playhead`. */
  children: React.ReactNode;
}

/**
 * Playback for the hero track, and the only thing on the site that makes sound.
 *
 * Sets `--playhead` from `audio.currentTime`, so the position is real and the
 * bar field stays a Server Component. Nothing moves unless audio is playing.
 */
function TrackTransport({
  src,
  title,
  seconds,
  playLabel,
  pauseLabel,
  children,
  className,
  ...props
}: TrackTransportProps) {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const fieldRef = React.useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = React.useState(false);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (localStorage.getItem(OPT_OUT_KEY) === "1") return;
    } catch {
      // Blocked storage — treat as no stored preference.
    }

    // Only a definite "disallowed" skips. An absent API means ask by trying,
    // or Safari and Firefox visitors who allowed autoplay get denied.
    if (navigator.getAutoplayPolicy?.("mediaelement") === "disallowed") return;

    let cancelled = false;
    void audio.play().then(
      () => {
        if (!cancelled) setPlaying(true);
      },
      () => {
        // Blocked, the common case.
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const tick = () => {
      const audio = audioRef.current;
      if (audio && audio.duration > 0) {
        fieldRef.current?.style.setProperty(
          "--playhead",
          `${(audio.currentTime / audio.duration) * 100}%`,
        );
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  function remember(optedOut: boolean) {
    try {
      if (optedOut) localStorage.setItem(OPT_OUT_KEY, "1");
      else localStorage.removeItem(OPT_OUT_KEY);
    } catch {
      // Blocked storage — the preference just will not persist.
    }
  }

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      remember(true);
      return;
    }
    try {
      await audio.play();
      setPlaying(true);
      remember(false);
    } catch {
      setPlaying(false);
    }
  }

  return (
    <div
      ref={fieldRef}
      data-slot="track-transport"
      className={cn("relative isolate flex flex-col", className)}
      {...props}
    >
      {children}

      <audio
        ref={audioRef}
        src={src}
        preload="none"
        loop
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      >
        <track kind="captions" />
      </audio>

      {/* shrink-0: without it the flex-1 content above squeezes the control
          off-screen on short viewports. */}
      <div className="mx-auto flex w-full max-w-280 shrink-0 flex-wrap items-center gap-3 px-6 pb-12">
        <button
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={`${playing ? pauseLabel : playLabel} — ${title}`}
          className={cn(
            "inline-flex h-8 shrink-0 items-center gap-2 rounded-sm px-3 type-label",
            "transition-colors duration-(--dur-fast) ease-attack",
            playing
              ? "bg-panel-hi text-foreground hover:bg-border-hi"
              : "bg-transparent text-foreground hairline hover:bg-panel-hi hover:hairline-hi",
          )}
        >
          <HugeiconsIcon
            icon={playing ? PauseIcon : PlayIcon}
            className={cn("size-4", playing ? "text-signal" : "text-primary")}
          />
          {playing ? pauseLabel : playLabel}
        </button>

        <span className="type-meta text-tertiary">
          {title} · {timecode(seconds)}
        </span>
      </div>
    </div>
  );
}

export { TrackTransport };
export type { TrackTransportProps };

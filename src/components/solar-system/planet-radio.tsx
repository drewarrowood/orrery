"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Pause,
  Play,
  Radio,
  SkipBack,
  SkipForward,
  Shuffle,
} from "lucide-react";
import {
  FALLBACK_PLAYLIST,
  radioPlaylistUrl,
  radioTrackUrl,
  type RadioTrack,
} from "@/lib/radio-playlist";
import { useSimStore } from "@/store/sim-store";
import { cn } from "@/lib/utils";

/**
 * Planet-themed field radio — Holst The Planets (public domain), same pattern
 * as live-and-let-live's WWI field radio. All media via relative asset URLs.
 */
export function PlanetRadio() {
  const selectedId = useSimStore((s) => s.selectedId);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playlist, setPlaylist] = useState<RadioTrack[]>(FALLBACK_PLAYLIST);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [volume, setVolume] = useState(0.32);
  const [minimized, setMinimized] = useState(true);
  const [wantPlay, setWantPlay] = useState(false);
  const failStreak = useRef(0);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audio.volume = 0.32;
    audioRef.current = audio;

    const onPlay = () => {
      setPlaying(true);
      setWantPlay(true);
      failStreak.current = 0;
    };
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      setIndex((i) => {
        const list = playlistRef.current;
        if (shuffleRef.current && list.length > 1) {
          let n = i;
          while (n === i) n = Math.floor(Math.random() * list.length);
          return n;
        }
        return (i + 1) % list.length;
      });
      setWantPlay(true);
    };
    const onError = () => {
      failStreak.current += 1;
      if (failStreak.current < playlistRef.current.length) {
        setIndex((i) => (i + 1) % playlistRef.current.length);
      }
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.pause();
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audioRef.current = null;
    };
  }, []);

  const playlistRef = useRef(playlist);
  const shuffleRef = useRef(shuffle);
  useEffect(() => {
    playlistRef.current = playlist;
  }, [playlist]);
  useEffect(() => {
    shuffleRef.current = shuffle;
  }, [shuffle]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(radioPlaylistUrl(), { cache: "no-store" });
        if (r.ok) {
          const data = (await r.json()) as RadioTrack[];
          if (!cancelled && Array.isArray(data) && data.length) {
            setPlaylist(data);
          }
        }
      } catch {
        /* fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const load = useCallback(
    async (i: number, autoplay: boolean) => {
      const audio = audioRef.current;
      const track = playlist[i];
      if (!audio || !track) return;
      audio.src = radioTrackUrl(track.file);
      try {
        await audio.play();
        if (!autoplay) audio.pause();
      } catch {
        setPlaying(false);
      }
    },
    [playlist],
  );

  useEffect(() => {
    void load(index, wantPlay);
  }, [index, playlist, load, wantPlay]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!selectedId) return;
    const i = playlist.findIndex((t) => t.planet === selectedId);
    if (i >= 0 && i !== index) {
      setIndex(i);
    }
  }, [selectedId, playlist, index]);

  const track = playlist[index] ?? playlist[0];

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      setWantPlay(true);
      void audio.play().catch(() => setPlaying(false));
    } else {
      setWantPlay(false);
      audio.pause();
    }
  };

  const next = () => {
    if (shuffle && playlist.length > 1) {
      let n = index;
      while (n === index) n = Math.floor(Math.random() * playlist.length);
      setIndex(n);
    } else {
      setIndex((i) => (i + 1) % playlist.length);
    }
    setWantPlay(true);
  };

  const prev = () => {
    setIndex((i) => (i - 1 + playlist.length) % playlist.length);
    setWantPlay(true);
  };

  return (
    <div
      className={cn(
        "ss-panel pointer-events-auto w-[min(320px,calc(100vw-1.25rem))]",
        "overflow-hidden shadow-panel",
      )}
      role="region"
      aria-label="Planet radio"
    >
      <header
        className={cn(
          "flex items-center justify-between gap-2 border-b border-border px-3 py-2",
          "bg-bg-subtle",
        )}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "size-1.5 rounded-full",
                playing
                  ? "bg-accent shadow-[0_0_6px_var(--color-accent)]"
                  : "bg-fg-subtle",
              )}
              aria-hidden
            />
            <p className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-fg-muted">
              <Radio className="size-3" strokeWidth={2} aria-hidden />
              Planet radio
            </p>
          </div>
          <p className="mt-0.5 text-[10px] text-fg-subtle">
            Holst · public domain
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMinimized((m) => !m)}
          className="inline-flex size-8 items-center justify-center rounded-md border border-border text-fg-muted hover:text-fg"
          aria-label={minimized ? "Expand radio" : "Minimize radio"}
        >
          {minimized ? (
            <ChevronUp className="size-4" strokeWidth={2} />
          ) : (
            <ChevronDown className="size-4" strokeWidth={2} />
          )}
        </button>
      </header>

      {!minimized && (
        <div className="space-y-2.5 p-3">
          <div className="min-h-[2.6em]">
            <p className="text-sm font-medium leading-snug text-fg">
              {track?.title ?? "—"}
            </p>
            <p className="text-[11px] text-fg-muted">
              {track?.composer}
              {track?.year ? ` · ${track.year}` : ""}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <IconBtn label="Previous" onClick={prev}>
              <SkipBack className="size-3.5" strokeWidth={2} />
            </IconBtn>
            <IconBtn label={playing ? "Pause" : "Play"} onClick={toggle} primary>
              {playing ? (
                <Pause className="size-3.5" strokeWidth={2} />
              ) : (
                <Play className="size-3.5" strokeWidth={2} />
              )}
            </IconBtn>
            <IconBtn label="Next" onClick={next}>
              <SkipForward className="size-3.5" strokeWidth={2} />
            </IconBtn>
            <IconBtn
              label="Shuffle"
              onClick={() => setShuffle((s) => !s)}
              active={shuffle}
            >
              <Shuffle className="size-3.5" strokeWidth={2} />
            </IconBtn>
          </div>

          <select
            className={cn(
              "h-9 w-full rounded-md border border-border bg-bg-subtle px-2 text-xs text-fg",
              "outline-none focus:border-accent",
            )}
            value={index}
            onChange={(e) => {
              setIndex(Number(e.target.value));
              setWantPlay(true);
            }}
            aria-label="Select track"
          >
            {playlist.map((t, i) => (
              <option key={t.file} value={i}>
                {t.title}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <label
              htmlFor="planet-vol"
              className="text-[10px] font-medium uppercase tracking-wider text-fg-subtle"
            >
              Vol
            </label>
            <input
              id="planet-vol"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-bg-subtle accent-accent"
            />
          </div>

          <p className="text-[10px] leading-snug text-fg-subtle">
            The Planets, Op. 32 — composition and this recording are public
            domain. Cue follows selected planet when available.
          </p>
        </div>
      )}
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  label,
  primary,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  primary?: boolean;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-md border text-sm",
        "transition-colors active:scale-[0.98]",
        primary
          ? "border-transparent bg-fg text-bg-elevated hover:opacity-90"
          : active
            ? "border-accent-dim bg-bg-subtle text-accent"
            : "border-border bg-bg-subtle text-fg hover:border-border-strong",
      )}
    >
      {children}
    </button>
  );
}

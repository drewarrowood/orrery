import { useEffect, useState } from "react";

export function useMedia(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** Phone-width or a coarse pointer: cap GPU work and use the compact dock. */
export function useCompactViewport(): boolean {
  return useMedia("(max-width: 767px), (pointer: coarse)");
}

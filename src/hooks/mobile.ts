import { useEffect, useMemo, useState } from "react";

/**
 * Hook to determinate mobile viewport
 */
export default function useMobile(mobileWidth = 720) {
  const [mobile, setMobile] = useState(false);
  const query = useMemo(() => {
    if (typeof window === "undefined") return null;

    return window.matchMedia(`(max-width: ${mobileWidth}px)`);
  }, [mobileWidth]);

  useEffect(() => {
    if (!query) return;

    const listener = (e: MediaQueryListEvent) => setMobile(e.matches);

    query.addEventListener("change", listener);
    setMobile(query.matches);

    return () => query.removeEventListener("change", listener);
  }, [query]);

  return mobile;
}

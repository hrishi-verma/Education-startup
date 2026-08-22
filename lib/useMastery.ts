"use client";

import { useEffect, useState } from "react";
import { loadStore, type MasteryStore } from "@/lib/mastery";

/** Subscribe a component to the localStorage-backed mastery store. */
export function useMastery(): MasteryStore {
  const [store, setStore] = useState<MasteryStore>(loadStore);

  useEffect(() => {
    const sync = () => setStore(loadStore());
    sync(); // hydrate on mount (SSR renders the empty default)
    window.addEventListener("mastery-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("mastery-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return store;
}

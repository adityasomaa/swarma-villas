"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CONSENT_EVENT,
  readConsent,
  writeConsent,
  type ConsentState,
  type ConsentValue,
} from "@/lib/consent";

type Ctx = {
  consent: ConsentState;
  /** True once the stored value has been read on the client. */
  ready: boolean;
  set: (value: ConsentValue) => void;
  /** Re-opens the banner, so the choice can be changed from the footer. */
  reopen: () => void;
  banner: boolean;
};

const ConsentCtx = createContext<Ctx | null>(null);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>("unset");
  const [ready, setReady] = useState(false);
  const [forced, setForced] = useState(false);

  useEffect(() => {
    setConsent(readConsent());
    setReady(true);
    const sync = () => setConsent(readConsent());
    window.addEventListener(CONSENT_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CONSENT_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const set = useCallback((value: ConsentValue) => {
    writeConsent(value);
    setConsent(value);
    setForced(false);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      consent,
      ready,
      set,
      reopen: () => setForced(true),
      banner: ready && (forced || consent === "unset"),
    }),
    [consent, ready, set, forced],
  );

  return <ConsentCtx.Provider value={value}>{children}</ConsentCtx.Provider>;
}

export function useConsent(): Ctx {
  const ctx = useContext(ConsentCtx);
  if (!ctx) throw new Error("useConsent must be used inside <ConsentProvider>");
  return ctx;
}

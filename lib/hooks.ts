"use client";
import { useState, useEffect, useCallback, useRef } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = typeof value === "function" ? (value as (prev: T) => T)(prev) : value;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(next));
        }
        return next;
      });
    },
    [key]
  );

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key]);

  return [storedValue, setValue];
}

/**
 * Enhanced SSE hook with:
 * - Last-Event-ID header for resuming streams
 * - Exponential backoff with jitter
 * - Connection state reporting
 * - Automatic cleanup on unmount
 */
export interface SSEState<T> {
  data: T | null;
  connected: boolean;
  connecting: boolean;
  error: string | null;
  lastEventId: string | null;
}

export function useSSE<T>(url: string, eventTypes: string[] = ["message"]) {
  const [state, setState] = useState<SSEState<T>>({
    data: null,
    connected: false,
    connecting: true,
    error: null,
    lastEventId: null,
  });

  const esRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 10;
  const baseDelay = 1000;
  const isMountedRef = useRef(true);
  const lastEventIdRef = useRef<string | null>(null);
  const urlRef = useRef(url);
  const eventTypesRef = useRef(eventTypes);

  // Keep refs current without triggering reconnects
  urlRef.current = url;
  eventTypesRef.current = eventTypes;

  const connect = useCallback(() => {
    if (!isMountedRef.current) return;
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }

    setState((prev) => ({ ...prev, connecting: true, error: null }));

    // Build URL with Last-Event-ID if available
    let connectUrl = urlRef.current;
    const lastId = lastEventIdRef.current;
    if (lastId && typeof window !== "undefined") {
      const sep = connectUrl.includes("?") ? "&" : "?";
      connectUrl = `${connectUrl}${sep}lastEventId=${encodeURIComponent(lastId)}`;
    }

    try {
      const es = new EventSource(connectUrl);
      esRef.current = es;

      es.onopen = () => {
        if (!isMountedRef.current) return;
        reconnectAttemptsRef.current = 0;
        setState((prev) => ({
          ...prev,
          connected: true,
          connecting: false,
          error: null,
        }));
      };

      // Listen for specific event types
      eventTypesRef.current.forEach((type) => {
        es.addEventListener(type, (e: MessageEvent) => {
          if (!isMountedRef.current) return;
          try {
            const parsed = JSON.parse(e.data);
            const eventId = (e as any).lastEventId || parsed.id || null;
            lastEventIdRef.current = eventId || lastEventIdRef.current;
            setState((prev) => ({
              ...prev,
              data: parsed,
              lastEventId: lastEventIdRef.current || prev.lastEventId,
            }));
          } catch (err) {
            // Non-JSON data — store as string
            setState((prev) => ({
              ...prev,
              data: e.data as unknown as T,
            }));
          }
        });
      });

      // Also catch generic "message" events if not already covered
      if (!eventTypesRef.current.includes("message")) {
        es.onmessage = (e) => {
          if (!isMountedRef.current) return;
          try {
            const parsed = JSON.parse(e.data);
            const eventId = e.lastEventId || parsed.id || null;
            lastEventIdRef.current = eventId || lastEventIdRef.current;
            setState((prev) => ({
              ...prev,
              data: parsed,
              lastEventId: lastEventIdRef.current || prev.lastEventId,
            }));
          } catch {
            setState((prev) => ({
              ...prev,
              data: e.data as unknown as T,
            }));
          }
        };
      }

      es.onerror = () => {
        if (!isMountedRef.current) return;
        es.close();
        esRef.current = null;
        setState((prev) => ({
          ...prev,
          connected: false,
          connecting: false,
          error: "Connection lost. Retrying...",
        }));

        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(
            30000,
            baseDelay * Math.pow(2, reconnectAttemptsRef.current) + Math.random() * 1000
          );
          reconnectAttemptsRef.current++;
          reconnectTimeoutRef.current = setTimeout(connect, delay);
        } else {
          setState((prev) => ({
            ...prev,
            error: "Max reconnection attempts reached. Please refresh.",
          }));
        }
      };
    } catch (err) {
      setState((prev) => ({
        ...prev,
        connecting: false,
        error: `Failed to connect: ${err}`,
      }));
    }
  }, []); // No deps — refs keep everything current

  useEffect(() => {
    isMountedRef.current = true;
    connect();
    return () => {
      isMountedRef.current = false;
      esRef.current?.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [connect]);

  return state;
}

export function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  return now;
}

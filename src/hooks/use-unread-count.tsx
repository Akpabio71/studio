"use client";

import { useEffect, useState, useRef } from 'react';

export function useUnreadCount(pollInterval = 15000) {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const mounted = useRef(true);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    mounted.current = true;

    // If EventSource is available, use SSE for real-time updates
    if (typeof window !== 'undefined' && 'EventSource' in window) {
      try {
        setLoading(true);
        const es = new EventSource('/api/chats/stream');
        esRef.current = es;

        es.onmessage = (ev) => {
          try {
            const payload = JSON.parse(ev.data);
            if (payload && payload.type) {
              // if it's an init event, it may contain count
              if (payload.type === 'init' && typeof payload.count === 'number') {
                setCount(payload.count);
              } else if (payload.type === 'update' || payload.type === 'add') {
                // compute unread from payload.chat if available
                if (payload.chat && typeof payload.chat.unread === 'number') {
                  // naive: refetch total to keep consistent
                  fetch('/api/chats?q=unread-count', { cache: 'no-store' })
                    .then(r => r.ok ? r.json() : null)
                    .then(d => {
                      if (d && typeof d.count === 'number') setCount(d.count)
                    })
                } else if (typeof payload.count === 'number') {
                  setCount(payload.count)
                }
              }
            }
          } catch (e) {
            // ignore
          } finally {
            if (mounted.current) setLoading(false);
          }
        }

        es.onerror = () => {
          // fallback to polling if SSE fails
          es.close()
          esRef.current = null
        }
      } catch (e) {
        // ignore and fallback to polling
      }
    }

    // polling fallback if EventSource is not available or fails
    let id: number | undefined
    async function fetchCount() {
      try {
        setLoading(true);
        const res = await fetch('/api/chats?q=unread-count', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted.current) return;
        setCount(typeof data.count === 'number' ? data.count : 0);
      } catch (err) {
        // ignore
      } finally {
        if (mounted.current) setLoading(false);
      }
    }

    if (!esRef.current) {
      fetchCount();
      id = window.setInterval(fetchCount, pollInterval);
    }

    return () => {
      mounted.current = false;
      if (esRef.current) {
        try { esRef.current.close() } catch (e) {}
        esRef.current = null
      }
      if (id) clearInterval(id)
    };
  }, [pollInterval]);

  return { count, loading };
}

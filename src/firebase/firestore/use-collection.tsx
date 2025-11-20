'use client';
import { useState, useEffect } from 'react';
import { onSnapshot, Query, DocumentData } from 'firebase/firestore';

export function useCollection<T>(query: Query<DocumentData> | null) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(query, (snapshot) => {
      setData(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as T[]);
      setLoading(false);
    }, (error) => {
        console.error("Error in useCollection snapshot listener:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [query]);

  return { data, loading };
}

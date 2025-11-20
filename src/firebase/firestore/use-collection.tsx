'use client';
import { useState, useEffect } from 'react';
import { onSnapshot, Query, DocumentData } from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

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
        const permissionError = new FirestorePermissionError({
            path: (query as any)?._query?.path?.segments.join('/') || '',
            operation: 'list'
        });
        errorEmitter.emit('permission-error', permissionError);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [query ? JSON.stringify(query) : 'null']);

  return { data, loading };
}

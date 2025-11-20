'use client';
import { useState, useEffect } from 'react';
import { doc, onSnapshot, DocumentData, DocumentReference } from 'firebase/firestore';
import { useFirestore } from '../provider';

export function useDoc<T>(path: string, docId: string) {
    const firestore = useFirestore();
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!firestore) return;

        const docRef = doc(firestore, path, docId);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setData({ ...docSnap.data(), id: docSnap.id } as T);
            } else {
                setData(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();

    }, [firestore, path, docId]);

    return { data, loading };
}

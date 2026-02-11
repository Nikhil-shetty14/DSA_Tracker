import { useState, useEffect, useCallback } from 'react';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

// Generic hook for syncing data with Firestore
export function useFirestore<T>(field: string, defaultValue: T): [T, (value: T | ((prev: T) => T)) => void] {
    const { user } = useAuth();
    const [data, setData] = useState<T>(defaultValue);
    const [_isInitialized, setIsInitialized] = useState(false);

    // Subscribe to real-time updates
    useEffect(() => {
        if (!user?.uid) {
            setData(defaultValue);
            setIsInitialized(false);
            return;
        }

        const userDocRef = doc(db, 'users', user.uid);

        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const userData = docSnap.data();
                if (userData[field] !== undefined) {
                    setData(userData[field] as T);
                } else {
                    setData(defaultValue);
                }
            }
            setIsInitialized(true);
        }, (error) => {
            console.error('Firestore error:', error);
            setIsInitialized(true);
        });

        return () => unsubscribe();
    }, [user?.uid, field]);

    // Update function
    const updateData = useCallback((value: T | ((prev: T) => T)) => {
        if (!user?.uid) return;

        const newValue = typeof value === 'function'
            ? (value as (prev: T) => T)(data)
            : value;

        setData(newValue);

        // Update Firestore
        const userDocRef = doc(db, 'users', user.uid);
        updateDoc(userDocRef, { [field]: newValue }).catch(console.error);
    }, [user?.uid, field, data]);

    return [data, updateData];
}

// Hook for progress data
export function useProgress() {
    return useFirestore<{ [key: string]: number }>('progress', {});
}

// Hook for streak data
export function useFirestoreStreak() {
    const [streak, setStreak] = useFirestore<{
        currentStreak: number;
        bestStreak: number;
        lastLogDate: string | null;
    }>('streak', { currentStreak: 0, bestStreak: 0, lastLogDate: null });

    const updateStreak = useCallback(() => {
        const today = new Date().toLocaleDateString();
        const lastLog = streak.lastLogDate;

        if (lastLog === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toLocaleDateString();

        let newCurrentStreak = 1;
        if (lastLog === yesterdayStr) {
            newCurrentStreak = streak.currentStreak + 1;
        }

        setStreak({
            currentStreak: newCurrentStreak,
            lastLogDate: today,
            bestStreak: Math.max(newCurrentStreak, streak.bestStreak)
        });
    }, [streak, setStreak]);

    return { streak, updateStreak, setStreak };
}

// Hook for journal entries
export function useJournal() {
    return useFirestore<Array<{ id: string; date: string; content: string; mood: string }>>('journal', []);
}

// Hook for profile data
export function useProfile() {
    return useFirestore<{ bio: string; location: string }>('profile', { bio: '', location: '' });
}

// Hook for quiz results
export interface QuizResult {
    topicId: string;
    score: number;
    total: number;
    date: string;
    timeTaken: number; // seconds
}

export function useQuizResults() {
    return useFirestore<QuizResult[]>('quizResults', []);
}

// Hook for XP data
export interface XPData {
    totalXP: number;
    level: number;
}

export function useXP() {
    const [xpData, setXPData] = useFirestore<XPData>('xpData', { totalXP: 0, level: 1 });

    const addXP = useCallback((amount: number) => {
        setXPData(prev => ({
            ...prev,
            totalXP: prev.totalXP + amount,
        }));
    }, [setXPData]);

    return { xpData, setXPData, addXP };
}

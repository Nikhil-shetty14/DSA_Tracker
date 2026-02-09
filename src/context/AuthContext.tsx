import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthUser {
    uid: string;
    email: string | null;
    name: string | null;
    photoURL: string | null;
}

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
    loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const authUser: AuthUser = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL
                };
                setUser(authUser);
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error: unknown) {
            const firebaseError = error as { code?: string; message?: string };
            let errorMessage = 'Login failed';

            if (firebaseError.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email';
            } else if (firebaseError.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password';
            } else if (firebaseError.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address';
            } else if (firebaseError.code === 'auth/invalid-credential') {
                errorMessage = 'Invalid email or password';
            }

            return { success: false, error: errorMessage };
        }
    };

    const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Update profile with name
            await updateProfile(userCredential.user, { displayName: name });

            // Create user document in Firestore
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                name: name,
                email: email,
                createdAt: new Date().toISOString(),
                progress: {},
                streak: { currentStreak: 0, bestStreak: 0, lastLogDate: null },
                journal: [],
                profile: { bio: '', location: '' }
            });

            return { success: true };
        } catch (error: unknown) {
            const firebaseError = error as { code?: string; message?: string };
            let errorMessage = 'Signup failed';

            if (firebaseError.code === 'auth/email-already-in-use') {
                errorMessage = 'An account with this email already exists';
            } else if (firebaseError.code === 'auth/weak-password') {
                errorMessage = 'Password should be at least 6 characters';
            } else if (firebaseError.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address';
            }

            return { success: false, error: errorMessage };
        }
    };

    const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            // Check if user doc exists, if not create it
            const userDoc = await getDoc(doc(db, 'users', result.user.uid));
            if (!userDoc.exists()) {
                await setDoc(doc(db, 'users', result.user.uid), {
                    name: result.user.displayName,
                    email: result.user.email,
                    photoURL: result.user.photoURL,
                    createdAt: new Date().toISOString(),
                    progress: {},
                    streak: { currentStreak: 0, bestStreak: 0, lastLogDate: null },
                    journal: [],
                    profile: { bio: '', location: '' }
                });
            }

            return { success: true };
        } catch (error: unknown) {
            const firebaseError = error as { code?: string; message?: string };
            return { success: false, error: firebaseError.message || 'Google sign-in failed' };
        }
    };

    const logout = () => {
        signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, signup, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

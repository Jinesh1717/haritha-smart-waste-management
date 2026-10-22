"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { getUserProfile, UserProfile } from "@/services/firestore";

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Helper: read demo user from localStorage
    const getDemoUser = (): User | null => {
        if (typeof window === "undefined") return null;
        const stored = localStorage.getItem("hks_demo_user");
        if (!stored) return null;
        try {
            return JSON.parse(stored) as User;
        } catch {
            return null;
        }
    };

    // Fetch profile from Firestore for the given uid and set state
    const loadProfile = async (uid: string) => {
        try {
            const p = await getUserProfile(uid);
            setProfile(p);
        } catch {
            setProfile(null);
        }
    };

    useEffect(() => {
        // Immediately restore demo session if present so pages don't flash unauthenticated
        const initialDemo = getDemoUser();
        if (initialDemo) {
            setUser(initialDemo);
            loadProfile(initialDemo.uid).finally(() => setLoading(false));
        }

        // Listen for manual demo-auth changes (login/logout via localStorage)
        const handleAuthChange = () => {
            const demo = getDemoUser();
            if (demo) {
                setUser(demo);
                loadProfile(demo.uid);
            } else {
                setUser(null);
                setProfile(null);
            }
        };
        window.addEventListener("hks_auth_change", handleAuthChange);

        // Listen for real Firebase auth changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            const demo = getDemoUser();
            if (demo) {
                // demo session takes priority
                setUser(demo);
                await loadProfile(demo.uid);
            } else if (firebaseUser) {
                setUser(firebaseUser);
                await loadProfile(firebaseUser.uid);
            } else {
                setUser(null);
                setProfile(null);
            }
            setLoading(false);
        });

        return () => {
            window.removeEventListener("hks_auth_change", handleAuthChange);
            unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AuthContext.Provider value={{ user, profile, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

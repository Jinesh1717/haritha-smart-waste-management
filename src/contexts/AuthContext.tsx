"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

interface AuthContextType {
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getDemoUser = (): User | null => {
            if (typeof window !== "undefined") {
                const stored = localStorage.getItem("hks_demo_user");
                if (stored) {
                    try {
                        return JSON.parse(stored) as User;
                    } catch {
                        return null;
                    }
                }
            }
            return null;
        };

        const initialDemo = getDemoUser();
        if (initialDemo) {
            setUser(initialDemo);
            setLoading(false);
        }

        const handleAuthChange = () => {
            const demo = getDemoUser();
            if (demo) {
                setUser(demo);
                setLoading(false);
            } else if (!auth.currentUser) {
                setUser(null);
            }
        };

        window.addEventListener("hks_auth_change", handleAuthChange);

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            const demo = getDemoUser();
            if (demo) {
                setUser(demo);
            } else {
                setUser(firebaseUser);
            }
            setLoading(false);
        });

        return () => {
            window.removeEventListener("hks_auth_change", handleAuthChange);
            unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";

// Google provider instance
const googleProvider = new GoogleAuthProvider();

export const loginWithEmail = async (email: string, pass: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        return { user: userCredential.user, error: null };
    } catch (error: Error | unknown) {
        return { user: null, error: error instanceof Error ? error.message : "Unknown error" };
    }
};

export const registerWithEmail = async (email: string, pass: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        return { user: userCredential.user, error: null };
    } catch (error: Error | unknown) {
        return { user: null, error: error instanceof Error ? error.message : "Unknown error" };
    }
};

export const loginWithGoogle = async () => {
    try {
        const userCredential = await signInWithPopup(auth, googleProvider);
        return { user: userCredential.user, error: null };
    } catch (error: Error | unknown) {
        return { user: null, error: error instanceof Error ? error.message : "Unknown error" };
    }
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
        return { success: true, error: null };
    } catch (error: Error | unknown) {
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
};

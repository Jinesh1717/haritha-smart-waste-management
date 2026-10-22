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

// ─── Demo Users (for development / demo purposes) ────────────────────────────
export const DEMO_USERS = {
    admin: {
        email: "admin@haritha.com",
        password: "admin123",
        user: {
            uid: "demo-admin-id",
            email: "admin@haritha.com",
            displayName: "Administrator",
        } as unknown as import("firebase/auth").User,
        profile: {
            id: "demo-admin-id",
            email: "admin@haritha.com",
            role: "admin",
            name: "Haritha Admin Officer",
        }
    },
    staff: {
        email: "staff@haritha.com",
        password: "staff123",
        user: {
            uid: "demo-staff-id",
            email: "staff@haritha.com",
            displayName: "Rahul K. (Staff)",
        } as unknown as import("firebase/auth").User,
        profile: {
            id: "demo-staff-id",
            email: "staff@haritha.com",
            role: "collector",
            status: "approved",
            name: "Rahul K. (Collector)",
        }
    },
    resident: {
        phone: "9876543210",
        otp: "123456",
        email: "resident@haritha.com",
        password: "resident123",
        user: {
            uid: "demo-resident-id",
            email: "resident@haritha.com",
            phoneNumber: "+919876543210",
            displayName: "Mahesh K. (Resident)",
        } as unknown as import("firebase/auth").User,
        profile: {
            id: "demo-resident-id",
            phone: "+919876543210",
            email: "resident@haritha.com",
            role: "resident",
            name: "Mahesh K.",
            ward: "Ward 2",
            household: "House #42",
        }
    }
};

// ─── Session Cookie Helpers ───────────────────────────────────────────────────

/**
 * Set a lightweight session cookie readable by Next.js middleware.
 * role: "admin" | "collector" | "resident"
 */
export const setSessionCookie = (role: string) => {
    if (typeof document === "undefined") return;
    // 7-day expiry
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `hks_session=${role}; path=/; expires=${expires}; SameSite=Lax`;
};

/**
 * Clear the session cookie (called on logout).
 */
export const clearSessionCookie = () => {
    if (typeof document === "undefined") return;
    document.cookie = "hks_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
};

// ─── Demo localStorage session ────────────────────────────────────────────────

export const setDemoSession = (user: import("firebase/auth").User, role: string) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("hks_demo_user", JSON.stringify(user));
        setSessionCookie(role);
        window.dispatchEvent(new Event("hks_auth_change"));
    }
};

// ─── Login ────────────────────────────────────────────────────────────────────

export const loginWithEmail = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();

    // Check built-in demo credentials
    if (cleanEmail === "admin@haritha.com" && pass === "admin123") {
        setDemoSession(DEMO_USERS.admin.user, "admin");
        return { user: DEMO_USERS.admin.user, error: null };
    }
    if (cleanEmail === "staff@haritha.com" && pass === "staff123") {
        setDemoSession(DEMO_USERS.staff.user, "collector");
        return { user: DEMO_USERS.staff.user, error: null };
    }
    if (cleanEmail === "resident@haritha.com" && pass === "resident123") {
        setDemoSession(DEMO_USERS.resident.user, "resident");
        return { user: DEMO_USERS.resident.user, error: null };
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        // Note: caller must call setSessionCookie(role) after determining the role
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

// ─── Logout ───────────────────────────────────────────────────────────────────

export const logoutUser = async () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("hks_demo_user");
        clearSessionCookie();
        window.dispatchEvent(new Event("hks_auth_change"));
    }
    try {
        await signOut(auth);
        return { success: true, error: null };
    } catch {
        return { success: true, error: null };
    }
};

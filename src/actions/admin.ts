"use server";

import { adminAuth, adminDb } from "@/lib/firebase/admin";

/**
 * Verify a Firebase ID token securely on the server
 */
export async function verifyUserToken(idToken: string) {
    try {
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        return { uid: decodedToken.uid, email: decodedToken.email, role: decodedToken.role };
    } catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
}

/**
 * Assign an 'admin' custom claim to a user.
 * This should only be called by an existing admin or initial setup script.
 */
export async function makeAdmin(uid: string) {
    try {
        await adminAuth.setCustomUserClaims(uid, { role: "admin" });

        // Update the record in Firestore to reflect the role
        await adminDb.collection("users").doc(uid).set({
            role: "admin",
            updatedAt: new Date(),
        }, { merge: true });

        return { success: true };
    } catch (error: Error | unknown) {
        console.error("Failed to make admin:", error);
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}

/**
 * Safely check if the currently authenticated user is an admin 
 * (Assuming the client sends the token in an auth header or cookie, 
 * but here we check based on a uid as an example action)
 */
export async function checkAdminStatus(uid: string) {
    try {
        const userRecord = await adminAuth.getUser(uid);
        return !!userRecord.customClaims?.["admin"];
    } catch {
        return false;
    }
}

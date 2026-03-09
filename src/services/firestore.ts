import { db } from "@/lib/firebase/client";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    query,
    where,
    addDoc,
    serverTimestamp
} from "firebase/firestore";

// --- USERS & STAFF ---

export interface UserProfile {
    id: string;
    email?: string;
    role?: string;
    [key: string]: any;
}

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as UserProfile : null;
};

export const createUserProfile = async (uid: string, data: Record<string, unknown>) => {
    const docRef = doc(db, "users", uid);
    await setDoc(docRef, {
        ...data,
        createdAt: serverTimestamp(),
    });
};

export const updateUserProfile = async (uid: string, data: Record<string, unknown>) => {
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
    });
};

// --- WARDS ---

export const getWards = async () => {
    const q = query(collection(db, "wards"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createWard = async (wardData: Record<string, unknown>) => {
    const colRef = collection(db, "wards");
    const docRef = await addDoc(colRef, {
        ...wardData,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
};

// --- WASTE MANAGEMENT ---

export const getWasteRecordsForUser = async (userId: string) => {
    const q = query(collection(db, "waste_records"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addWasteRecord = async (recordData: Record<string, unknown>) => {
    const colRef = collection(db, "waste_records");
    const docRef = await addDoc(colRef, {
        ...recordData,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
};

// --- BILLING / PAYMENTS ---

export const getUserBills = async (userId: string) => {
    const q = query(collection(db, "bills"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createBill = async (billData: Record<string, unknown>) => {
    const colRef = collection(db, "bills");
    const docRef = await addDoc(colRef, {
        ...billData,
        status: 'pending',
        createdAt: serverTimestamp(),
    });
    return docRef.id;
};

import { initializeApp, getApps } from "firebase/app";
import { addDoc, collection, getFirestore, onSnapshot, query, where, type Unsubscribe } from "firebase/firestore";
import type { Complaint } from "@/data/types";
// Firebase is the single persistence boundary for complaints, clusters, assets, and road segments; seed mode remains active until public project values are supplied.
const config={apiKey:import.meta.env.VITE_FIREBASE_API_KEY,authDomain:import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,projectId:import.meta.env.VITE_FIREBASE_PROJECT_ID};
export const firebaseEnabled=Boolean(config.apiKey&&config.authDomain&&config.projectId);
const app=firebaseEnabled?(getApps()[0]??initializeApp(config)):null;
export const db=app?getFirestore(app):null;
export async function addComplaint(complaint:Complaint){if(!db)return null;return addDoc(collection(db,"complaints"),complaint)}
export function subscribeToZoneComplaints(zone:string,onData:(items: Complaint[])=>void):Unsubscribe|undefined { if(!db)return;return onSnapshot(query(collection(db,"complaints"),where("zone","==",zone)),snapshot=>onData(snapshot.docs.map(doc=>doc.data() as Complaint))); }
export const collectionNames={complaints:"complaints",clusters:"clusters",assets:"assets",roadSegments:"roadSegments"} as const;

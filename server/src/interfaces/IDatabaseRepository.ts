import { CollectionReference, DocumentData } from "firebase/firestore";

export interface IDatabaseRepositorie
{
    findUserByEmail(userRef: CollectionReference<DocumentData>, email: string): Promise<DocumentData[]>; 
}
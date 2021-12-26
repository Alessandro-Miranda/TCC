import { CollectionReference, DocumentData } from "firebase/firestore";
import { Contacts } from "../types/Contacts";
import { User } from "../types/User";

export interface IDatabaseRepositorie
{
    getRef(collectionName: string): CollectionReference<DocumentData>;
    findUserByEmail(email: string): Promise<User[]>;
    findAllUsersByDepartment(department: string): Promise<User[]>;
    findAllContacts(username: string): Promise<Contacts[]>;
}
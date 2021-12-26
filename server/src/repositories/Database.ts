import {
    collection,
    CollectionReference,
    DocumentData,
    getDocs,
    query,
    where
} from "firebase/firestore";
import { firestoreApp } from "../config/firebaseConfig";
import { IDatabaseRepositorie } from "../interfaces/IDatabaseRepository";
import { Contacts } from "../types/Contacts";
import { User } from "../types/User";

export class Database implements IDatabaseRepositorie
{
    private collectionRef;

    constructor(collectionName: string)
    {
        this.collectionRef = this.getRef(collectionName);
    }

    getRef(collectionName: string): CollectionReference<DocumentData>
    {
        return collection(firestoreApp, collectionName);    
    }

    async findUserByEmail(email: string): Promise<User[]>
    {
        const queryToExecute = query(this.collectionRef, where('email', '==', email));
        
        const querySnapshot = await getDocs(queryToExecute);
        const userFound: User[] = [];
        
        querySnapshot.forEach(doc => {
            userFound.push(doc.data() as User);
        });

        return userFound;    
    }

    async findAllUsersByDepartment(department: string): Promise<User[]>
    {
        const queryToExecute = query(this.collectionRef, where('department', '==', department));
        const querySnapshot = await getDocs(queryToExecute);
        const users: User[] = [];

        querySnapshot.forEach(doc => {
            users.push(doc.data() as User);
        });

        return users;
    }

    async findAllContacts(email: string): Promise<Contacts[]>
    {
        // Obtém a subcoleção de contatos o formato final representa o path /usuarios/{email}/contatos
        const contactsCollection = collection(firestoreApp, 'usuarios', email, 'contatos');
        const contactsDoc = await getDocs(query(contactsCollection));
        
        return contactsDoc.docs.map(doc => doc.data() as Contacts);
    }
}
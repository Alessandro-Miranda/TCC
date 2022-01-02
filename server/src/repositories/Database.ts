import {
    collection,
    CollectionReference,
    doc,
    DocumentData,
    getDocs,
    query, setDoc, where
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

    async findUserByEmail(email: string): Promise<User>
    {
        const queryToExecute = query(this.collectionRef, where('email', '==', email));
        
        const querySnapshot = await getDocs(queryToExecute);
        let userFound = {} as User;
        
        querySnapshot.forEach(doc => {
            userFound = doc.data() as User;
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
        // Obtém a subcoleção de contatos o formato final representa o path {raiz}/usuarios/{email}/contatos
        const contactsCollection = collection(firestoreApp, 'usuarios', email, 'contatos');
        const contactsDoc = await getDocs(query(contactsCollection));
        
        return contactsDoc.docs.map(doc => doc.data() as Contacts);
    }

    async createChat(userEmail: string, contactEmail: string, uniqueChatId: string): Promise<Boolean>
    {
        const chatRef = doc(firestoreApp, 'chats', uniqueChatId);
        const chatInfo = {
            users: {}
        }

        Object.defineProperty(chatInfo.users, userEmail, {
            configurable: true,
            writable: true,
            enumerable: true,
            value: true
        });

        Object.defineProperty(chatInfo.users, contactEmail, {
            configurable: true,
            writable: true,
            enumerable: true,
            value: true
        });
        
        const response = setDoc(chatRef, chatInfo).then(() => {
            return true;
        }).catch(() => {
            return false;
        })

        return response;
    }
    
    async addContact(userEmail: string, contactEmail: string, contactId: string, chatId: string): Promise<Boolean>
    {
        const contactInfo = await this.findUserByEmail(contactEmail);
        const contactRef = doc(firestoreApp, 'usuarios', userEmail, 'contatos', contactId);
        const infosToSave = {
            ...contactInfo,
            chatID: chatId
        }
        const response = setDoc(contactRef, infosToSave).then(() => {
            return true;
        }).catch(() => {
            return false;
        });

        return response;    
    }
}
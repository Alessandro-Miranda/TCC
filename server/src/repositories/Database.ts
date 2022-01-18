import {
    arrayUnion,
    collection,
    CollectionReference,
    doc,
    DocumentData,
    getDoc,
    getDocs,
    query,
    QuerySnapshot,
    setDoc,
    updateDoc,
    where
} from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import { firestoreApp } from "../config/firebaseConfig";
import { CHATS, CONTACTS, USERS } from "../constants";
import { IDatabaseRepositorie } from "../interfaces/IDatabaseRepository";
import { Contacts } from "../types/Contacts";
import { MessageBody, MessageState, Preview } from "../types/Message";
import { User } from "../types/User";

export class Database implements IDatabaseRepositorie
{
    private collectionRef;

    constructor(collectionName: string)
    {
        // coleção de usuários
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
        const contactsCollection = collection(firestoreApp, USERS, email, CONTACTS);
        const contactsDoc = await getDocs(query(contactsCollection));
        
        return contactsDoc.docs.map(doc => doc.data() as Contacts);
    }

    async createChat(userEmail: string, contactEmail: string, uniqueChatId: string): Promise<Boolean>
    {
        const chatRef = doc(firestoreApp, CHATS, uniqueChatId);
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
        const contactRef = doc(firestoreApp, USERS, userEmail, CONTACTS, contactId);
        const infosToSave = {
            ...contactInfo,
            chatID: chatId
        }
        const response = setDoc(contactRef, infosToSave).then(() => true).catch(() => false);

        return response;    
    }

    async addNewUser(userInfos: User): Promise<boolean>
    {
        const userRef = doc(firestoreApp, USERS, userInfos.email);

        const createNewUserResponse = setDoc(userRef, userInfos).then(() => true).catch(() => false);

        if(!createNewUserResponse)
        {
            return false;
        }

        const contactsFromSameDepartment = await this.findAllUsersByDepartment(userInfos.department);

        for(const contact of contactsFromSameDepartment)
        {
            const chatID = uuidv4();
            
            // Adiciona os usuários do mesmo setor aos contatos do novo usuário
            await this.addContact(userInfos.email, contact.email, uuidv4(), chatID);
            
            // Adiciona o usuário ao contato dos usuários do setor já existentes
            await this.addContact(contact.email, userInfos.email, uuidv4(), chatID);
        }
        
        return true;    
    }

    async updateUser(userEmail: string, newInfos: User): Promise<boolean>
    {
        const userRef = doc(firestoreApp, USERS, userEmail);

        const updateResponse = updateDoc(userRef, newInfos).then(() => true).catch(() => false);

        return updateResponse;
    }

    async sendMessage(message: MessageBody): Promise<Boolean>
    {
        const chatMessage = doc(firestoreApp, 'chats', message.chatID, 'mensagens', 'mensagem');
        const messageInfo = {
            ...message,
            state: MessageState.Sent
        }
        const response = setDoc(chatMessage, { mensagem: arrayUnion(messageInfo) }, { merge: true }).then(() => {
            return true;
        }).catch(() => {
            return false;
        });
        
        return response;    
    }

    async getMessages(email: string): Promise<Preview[] | []>
    {
        const chatCollection = collection(firestoreApp, 'chats');
        const querySnapshot = await getDocs(chatCollection);

        const messagePreview = await this.getMessagePreview(querySnapshot, email);

        return messagePreview;
    }

    async getMessagePreview(snapshot: QuerySnapshot<DocumentData>, email: string): Promise<Preview[] | []>
    {
        const chats: { chatID: string, contactEmail: string }[] = [];
        const chatsInfo: Preview[] = [];

        snapshot.forEach(doc => {
            const users = Object.keys(doc.data().users);

            if(users.includes(email))
            {
                chats.push({
                    chatID: doc.id,
                    contactEmail: users.filter(user => user !== email)[0]
                });
            }
        });

        if(!chats.length)
        {
            return [];
        }
        
        for(const chat of chats)
        {
            const docRef = doc(firestoreApp, 'chats', chat.chatID, 'mensagens', 'mensagem');
            const contactInfos = await this.findUserByEmail(chat.contactEmail);
            const docSnapshoot = await getDoc(docRef);

            if(docSnapshoot.exists())
            {
                const allMessages = docSnapshoot.data() as { mensagem: MessageBody[]};
                const lastMessage = allMessages.mensagem.pop() as MessageBody;

                chatsInfo.push({
                    contact: {
                        department: contactInfos.department,
                        chatID: chat.chatID,
                        email: contactInfos.email,
                        firstName: contactInfos.firstName,
                        lastName: contactInfos.lastName
                    },
                    messagePreview: lastMessage.message,
                    timestamp: lastMessage.timestamp
                });
            }
        }

        return chatsInfo;
    }
}
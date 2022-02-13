import {
    arrayUnion,
    collection,
    CollectionReference,
    doc,
    DocumentData,
    DocumentReference,
    DocumentSnapshot,
    FieldPath,
    getDoc,
    getDocs,
    query,
    QueryDocumentSnapshot,
    QuerySnapshot,
    setDoc,
    updateDoc,
    where
} from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import { firestoreApp } from "../config/firebaseConfig";
import { CHATS, CONTACTS, MESSAGE, MESSAGES, USERS } from "../constants";
import { IDatabaseRepositorie } from "../interfaces/IDatabaseRepository";
import { Contacts } from "../types/Contacts";
import { MessageBody, MessageState, Preview } from "../types/Message";
import { User } from "../types/User";

export class Database implements IDatabaseRepositorie
{
    getCollectionRef(collectionPath: string | string[]): CollectionReference<DocumentData>
    {
        const slashSeparetedPath = Array.isArray(collectionPath) ? collectionPath.join('/') : collectionPath;

        return collection(firestoreApp, slashSeparetedPath);    
    }

    getDoc(docPath: string | string[]): DocumentReference<DocumentData>
    {
        const slashSeparetedDocPath = Array.isArray(docPath) ? docPath.join('/') : docPath;
        
        return doc(firestoreApp, slashSeparetedDocPath);
    }

    async findUserByEmail(email: string): Promise<User>
    {
        const queryToExecute = query(this.getCollectionRef(USERS), where('email', '==', email));
        
        const querySnapshot = await getDocs(queryToExecute);
        let userFound = {} as User;
        
        querySnapshot.forEach(doc => {
            userFound = doc.data() as User;
        });

        return userFound;    
    }

    async findAllUsersByDepartment(department: string): Promise<User[]>
    {
        const queryToExecute = query(this.getCollectionRef(USERS), where('department', '==', department));
        const querySnapshot = await getDocs(queryToExecute);
        const users: User[] = [];

        querySnapshot.forEach(doc => {
            users.push(doc.data() as User);
        });

        return users;
    }

    async findAllContacts(email: string): Promise<Contacts[]>
    {
        const contactsCollection = this.getCollectionRef([USERS, email, CONTACTS]);
        const contactsDoc = await getDocs(query(contactsCollection));
        
        return contactsDoc.docs.map(doc => doc.data() as Contacts);
    }

    async createChat(userEmail: string, contactEmail: string, uniqueChatId: string): Promise<Boolean>
    {
        const chatRef = this.getDoc([CHATS, uniqueChatId]);
        const chatInfo = { users: {} }

        Object.defineProperty(chatInfo.users, Buffer.from(userEmail).toString('base64'), {
            enumerable: true,
            value: true
        });

        Object.defineProperty(chatInfo.users, Buffer.from(contactEmail).toString('base64'), {
            enumerable: true,
            value: true
        });
        
        const response = await this.setDocuments(chatRef, chatInfo, true);

        return response;
    }
    
    async addContact(userEmail: string, contactEmail: string, chatId: string): Promise<Boolean>
    {
        const { password, admin, ...contactInfo } = await this.findUserByEmail(contactEmail);
        const contactRef = this.getDoc([USERS, userEmail, CONTACTS, contactEmail]);
        const infosToSave = {
            ...contactInfo,
            chatID: chatId
        }

        const response = await this.setDocuments(contactRef, infosToSave);

        return response;
    }

    async addNewUser(userInfos: User): Promise<boolean>
    {
        const userRef = this.getDoc([USERS, userInfos.email]);

        const createNewUserResponse = await this.setDocuments(userRef, userInfos);

        if(!createNewUserResponse)
        {
            return false;
        }

        const contactsFromSameDepartment = await this.findAllUsersByDepartment(userInfos.department);

        for(const contact of contactsFromSameDepartment)
        {
            const chatID = uuidv4();
            
            // Adiciona os usuários do mesmo setor aos contatos do novo usuário
            await this.addContact(userInfos.email, contact.email, chatID);
            
            // Adiciona o usuário ao contato dos usuários do setor já existentes
            await this.addContact(contact.email, userInfos.email, chatID);
        }
        
        return true;    
    }

    async updateUser(userEmail: string, newInfos: User): Promise<boolean>
    {
        const userRef = this.getDoc([USERS, userEmail]);

        const updateResponse = updateDoc(userRef, newInfos).then(() => true).catch(() => false);

        return updateResponse;
    }

    async sendMessage(message: MessageBody): Promise<Boolean>
    {
        const chatMessage = this.getDoc([CHATS, message.chatID, MESSAGES, MESSAGE]);
        const messageInfo = {
            ...message,
            state: MessageState.Sent
        }
        
        const response = await this.setDocuments(chatMessage, { mensagem: arrayUnion(messageInfo)}, true);
        
        return response;    
    }

    async findChat(userEmail: string, contactEmail: string): Promise<{ chatAlreadyExists: boolean; chatID: string; }>
    {
        const chats = await getDocs(this.getCollectionRef(CHATS));
        let chatID: string = '';

        chats.forEach(chat => {
            const chatUsers = chat.data() as { users: {} };
            
            const users = Object.keys(chatUsers.users);
            
            if(users.every(user => user === userEmail || user === contactEmail))
            {
                chatID = chat.id;
            }
        })

        return {
            chatAlreadyExists: chatID !== '',
            chatID
        }
    }

    private async setDocuments(
        documentReference: DocumentReference<DocumentData>,
        data: any,
        merge?: boolean | undefined,
        mergeFields?: (string | FieldPath)[] | undefined
    )
    {
        const options = {
            merge: merge ?? false,
            mergeFields
        };

        return setDoc(documentReference, data, options).then(() => true).catch(() => false);
    }

    async getMessages(email: string): Promise<Preview[] | []>
    {
        const querySnapshot = await getDocs(this.getCollectionRef(CHATS));

        const messagePreview = await this.getMessagePreview(querySnapshot, email);

        return messagePreview;
    }

    private getChatInfoToMessagePreview(
        snapshotDoc: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>,
        email: string
    ): { chatID: string, contactEmail: string }
    {
        
        const chats: { chatID: string, contactEmail: string } = {
            chatID: '',
            contactEmail: ''
        };
        const users = Object.keys(snapshotDoc.data()?.users);
        const userEmailInBase64 = Buffer.from(email).toString('base64');
                
        if(users.includes(userEmailInBase64))
        {
            chats.chatID = snapshotDoc.id;
            chats.contactEmail = users.filter(user => user !== userEmailInBase64)[0];
        }

        return chats;
    }

    async getMessagePreview(
        snapshot: QuerySnapshot<DocumentData> | DocumentSnapshot<DocumentData>,
        email: string,
        chatUserDoc?: QueryDocumentSnapshot<DocumentData>
    ): Promise<Preview[] | []>
    {
        const chats: { chatID: string, contactEmail: string }[] = [];
        const chatsInfo: Preview[] = [];

        if(snapshot instanceof QuerySnapshot)
        {
            snapshot.forEach(doc => {

                chats.push(this.getChatInfoToMessagePreview(doc, email));
            });
        }
        else
        {
            if(chatUserDoc)
            {
                const docRef = this.getDoc(chatUserDoc?.ref.path);
                const userDoc = await getDoc(docRef);
                chats.push(this.getChatInfoToMessagePreview(userDoc, email));
            }
        }

        if(!chats.length)
        {
            return [];
        }
        
        for(const chat of chats)
        {
            const contactEmailInBuffer = Buffer.from(chat.contactEmail, 'base64');
            const contactEmail = contactEmailInBuffer.toString('utf-8');
            
            const docRef = this.getDoc([CHATS, chat.chatID, MESSAGES, MESSAGE]);
            const contactInfos = await this.findUserByEmail(contactEmail);
            
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
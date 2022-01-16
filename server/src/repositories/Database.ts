import {
    arrayUnion,
    collection,
    CollectionReference,
    doc,
    DocumentData,
    getDoc,
    getDocs,
    query, setDoc, where
} from "firebase/firestore";
import { firestoreApp } from "../config/firebaseConfig";
import { IDatabaseRepositorie } from "../interfaces/IDatabaseRepository";
import { Contacts } from "../types/Contacts";
import { MessageBody, MessageState, Preview } from "../types/Message";
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
        const chats: { chatID: string, contactEmail: string}[] = [];

        querySnapshot.forEach(doc => {
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

        const chatsInfo: Preview[] = [];
        
        for(const chat of chats)
        {
            const docRef = doc(firestoreApp, 'chats', chat.chatID, 'mensagens', 'mensagem');
            const contactName = await this.findUserByEmail(chat.contactEmail);
            const docSnapshoot = await getDoc(docRef);

            if(docSnapshoot.exists())
            {
                const allMessages = docSnapshoot.data() as { mensagem: MessageBody[]};
                const lastMessage = allMessages.mensagem.pop() as MessageBody;

                chatsInfo.push({
                    chatID: chat.chatID,
                    contactName: `${contactName.first_name} ${contactName.last_name}`,
                    messagePreview: lastMessage.message,
                    photo: '',
                    time: lastMessage.timestamp
                });
            }
        }
        return chatsInfo;
    }
}
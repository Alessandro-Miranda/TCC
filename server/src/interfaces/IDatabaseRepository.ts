import { CollectionReference, DocumentData } from "firebase/firestore";
import { Contacts } from "../types/Contacts";
import { MessageBody } from "../types/Message";
import { User } from "../types/User";

export interface IDatabaseRepositorie
{
    getRef(collectionName: string): CollectionReference<DocumentData>;
    findUserByEmail(email: string): Promise<User>;
    findAllUsersByDepartment(department: string): Promise<User[]>;
    findAllContacts(username: string): Promise<Contacts[]>;
    createChat(userEmail: string, contactEmail: string, uniqueChatId: string): Promise<Boolean>;
    addContact(userEmail: string, contactEmail: string, contactId: string, chatId: string): Promise<Boolean>;
    sendMessage(message: MessageBody): Promise<Boolean>
}
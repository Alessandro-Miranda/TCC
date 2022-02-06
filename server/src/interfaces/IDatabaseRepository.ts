import { CollectionReference, DocumentData, DocumentReference, QuerySnapshot } from "firebase/firestore";
import { Contacts } from "../types/Contacts";
import { MessageBody, Preview } from "../types/Message";
import { User } from "../types/User";

export interface IDatabaseRepositorie
{
    getCollectionRef(collectionPath: string | string[]): CollectionReference<DocumentData>;
    getDoc(docPath: string | string[]): DocumentReference<DocumentData>;
    findUserByEmail(email: string): Promise<User>;
    findAllUsersByDepartment(department: string): Promise<User[]>;
    findAllContacts(username: string): Promise<Contacts[]>;
    createChat(userEmail: string, contactEmail: string, uniqueChatId: string): Promise<Boolean>;
    addContact(userEmail: string, contactEmail: string, contactId: string, chatId: string): Promise<Boolean>;
    sendMessage(message: MessageBody): Promise<Boolean>;
    getMessages(email: string): Promise<Preview[] | []>;
    getMessagePreview(snapshoot: QuerySnapshot<DocumentData>, email: string): Promise<Preview[] | []>;
    addNewUser(userInfos: User): Promise<boolean>;
    updateUser(userEmail: string, newInfos: User): Promise<boolean>;
    findChat(userEmail: string, contactEmail: string): Promise<{ chatAlreadyExists: boolean, chatID: string }>
}
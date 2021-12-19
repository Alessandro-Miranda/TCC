import { USERS_COLLECTION_NAME } from "../constants/constants";
import { Database } from "../repositories/Database";
import { Contacts } from "../types/Contacts";

export class MessageModel
{
    private database;

    constructor()
    {
        this.database = new Database(USERS_COLLECTION_NAME);
    }

    async getAllContacts(username: string): Promise<Contacts[]>
    {
        const contacts = await this.database.findAllContacts(username);
        return contacts;
    }
}
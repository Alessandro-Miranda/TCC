import { v4 as uuidv4 } from 'uuid';
import { USERS_COLLECTION_NAME } from "../constants/constants";
import { Database } from "../repositories/Database";
import { Contacts } from "../types/Contacts";
import { MessageBody } from '../types/Message';
import { User } from "../types/User";

type AllUsers = Omit<User, "password">;

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

    async getAllUsersFromSameDepartment(email: string, department: string): Promise<AllUsers[]>
    {
        const users = await this.database.findAllUsersByDepartment(department);
        const allContacts: AllUsers[] = [];
        
        for(const user of users)
        {
            const { password, ...userInfos } = user;

            if(userInfos.email !== email)
            {
                allContacts.push(userInfos);
            }
        }
        return allContacts;
    }

    async createChat(userEmail: string, contactEmail: string)
    {
        const uniqueChatId = uuidv4();
        const hasCreateadChat = await this.database.createChat(userEmail, contactEmail, uniqueChatId);

        if(hasCreateadChat)
        {
            const newContactId = uuidv4();
            const hasAddedNewContact = await this.database.addContact(userEmail, contactEmail, newContactId, uniqueChatId);
            
            return hasAddedNewContact ? uniqueChatId : new Error('An Error has occured creating a new chat');
        }
        else
        {
            throw new Error('An Error has occured creating a new chat');
        }
    }

    async sendMessage(message: MessageBody)
    {
        const response = await this.database.sendMessage(message);

        if(response)
        {
            return true;
        }
        else
        {
            throw new Error('An Error has occured sending message');
        }
    }
}
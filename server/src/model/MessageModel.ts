import { v4 as uuidv4 } from 'uuid';
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
        this.database = new Database();
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
        const { chatAlreadyExists, chatID } = await this.database.findChat(userEmail, contactEmail);

        if(chatAlreadyExists)
        {
            return chatID;
        }
        
        const uniqueChatId = uuidv4();
        const hasCreateadChat = await this.database.createChat(userEmail, contactEmail, uniqueChatId);

        if(hasCreateadChat)
        {
            const hasAddedNewContact = await this.database.addContact(userEmail, contactEmail, uniqueChatId);
            
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

    async getMessages(email: string)
    {
        const response = await this.database.getMessages(email);

        if(response) return response;
        else throw new Error('An Error has occured getting messages')
    }
}
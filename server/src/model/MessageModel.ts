import { USERS_COLLECTION_NAME } from "../constants/constants";
import { Database } from "../repositories/Database";
import { Contacts } from "../types/Contacts";
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
}
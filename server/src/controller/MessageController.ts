import { Request, Response } from "express";
import { AuthModel } from "../model/AuthModel";
import { MessageModel } from "../model/MessageModel";

type Params = {
    email: string;
    department?: string;
}

export class MessageController
{
    private model;

    constructor()
    {
        this.model = new MessageModel();
    }

    async getContacts(req: Request, res: Response)
    {
        const { email, department } = req.params as Params;
        const token = req.headers['x-access-token'];

        if(!token)
        {
            res
                .status(401)
                .setHeader('WWW-Authenticate', 'Unauthorized')
                .send({ message: 'Usuário não logado' });
                
            return;
        }

        const authModel = new AuthModel();
        const isAuthenticated = authModel.verifyJWT(token as string);

        if(!isAuthenticated)
        {
            res
                .status(401)
                .setHeader('WWW-Authenticate', 'Unauthorized')
                .send({ message: 'Token expirado' });
                
            return;
        }
        
        let contacts;

        if(department)
        {
            contacts = await this.model.getAllUsersFromSameDepartment(email, department.toLowerCase());
        }
        else
        {
            contacts = await this.model.getAllContacts(email);
        }

        res.status(200).send(contacts);
    }
}
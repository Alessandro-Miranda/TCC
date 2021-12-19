import { Request, Response } from "express";
import { AuthModel } from "../model/AuthModel";
import { MessageModel } from "../model/MessageModel";

export class MessageController
{
    private model;

    constructor()
    {
        this.model = new MessageModel();
    }

    async getContacts(req: Request, res: Response)
    {
        const userName = req.params.username;
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

        const contacts = await this.model.getAllContacts(userName);

        res.status(200).send(contacts);
    }
}
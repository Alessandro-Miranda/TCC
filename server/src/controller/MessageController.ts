import { Request, Response } from "express";
import { AuthModel } from "../model/AuthModel";
import { MessageModel } from "../model/MessageModel";
import { MessageBody } from "../types/Message";

type Params = {
    email: string;
    department: string;
}

type GetContactsParams = {
    email: string;
}

type CreateChatBody = {
    userEmail: string;
    contactEmail: string;
}

type ResponseErrorBody = {
    status: number;
    header: string[];
    send: { message: string };
}

export class MessageController
{
    private model;

    constructor()
    {
        this.model = new MessageModel();
    }

    async getContactsBySameDepartment(req: Request, res: Response)
    {
        const { email, department } = req.params as Params;
        const token = req.headers['x-access-token'];
    
        const checkAuthentication = this.checkIfUserIsAuthenticated(token);

        if(!checkAuthentication.continue)
        {
            this.sendRequestErrorResponse(res, checkAuthentication as ResponseErrorBody)
            return;
        }
        
        const contacts = await this.model.getAllUsersFromSameDepartment(email, department.toLowerCase());

        res.status(200).send(contacts);
    }

    async getContacts(req: Request, res: Response)
    {
        const { email } = req.params as GetContactsParams;
        const token = req.headers['x-access-token'];
    
        const checkAuthentication = this.checkIfUserIsAuthenticated(token);

        if(!checkAuthentication.continue)
        {
            this.sendRequestErrorResponse(res, checkAuthentication as ResponseErrorBody)
            return;
        }
        
        const contacts = await this.model.getAllContacts(email);

        res.status(200).send(contacts);
    }

    async createChat(req: Request, res: Response)
    {
        const { userEmail, contactEmail } = req.body as CreateChatBody;
        const token = req.headers['x-access-token'];

        const checkAuthentication = this.checkIfUserIsAuthenticated(token);

        if(!checkAuthentication.continue)
        {
            this.sendRequestErrorResponse(res, checkAuthentication as ResponseErrorBody)
            return;
        }

        if(!userEmail || !contactEmail)
        {
            this.sendRequestErrorResponse(res, {
                status: 422,
                header: ['422', 'Unprocessabel Entity'],
                send: { message: 'É necessário que seja passado, no mínimo, dois usuários para a criação do chat' }
            });

            return;
        }

        try
        {
            const chatID = await this.model.createChat(userEmail, contactEmail);
            
            res.status(200).send({ chatID });
        }
        catch(err)
        {
            this.sendRequestErrorResponse(res, {
                status: 500,
                header: ['500', 'Internal Server Error'],
                send: { message: String(err) }
            });

            return;
        }
    }

    async sendMessage(req: Request, res: Response)
    {
        const message = req.body as MessageBody;

        try
        {
            const isSent = await this.model.sendMessage(message);
            
            if(isSent)
            {
                res.status(200).send({
                    isSent: true,
                    message: 'message sent successfully'
                });
                return;
            }
        }
        catch(err)
        {
            this.sendRequestErrorResponse(res, {
                status: 500,
                header: ['500', 'Internal Server Error'],
                send: { message: String(err) }
            })
            return;
        }
    }

    async getMessages(req: Request, res: Response)
    {
        const email = req.params.email;

        try
        {
            const response = await this.model.getMessages(email);

            if(response)
            {
                res.status(200).send(response);
            }
        }
        catch(err)
        {
            this.sendRequestErrorResponse(res, {
                header: ['500', 'Internal Server Error'],
                send: { message: String(err) },
                status: 500
            })
        }
    }

    private checkIfUserIsAuthenticated(token: string | string[] | undefined)
    {
        const authModel = new AuthModel();

        if(!token)
        {
            return {
                continue: false,
                status: 401,
                header: ['WWW-Authenticate', 'Unauthorized'],
                send: { message: 'Usuário não logado' }
            }
        }

        const isAuthenticated = authModel.verifyJWT(token as string);

        if(!isAuthenticated)
        {
            return {
                continue: false,
                status: 401,
                header: ['WWW-Authenticate', 'Unauthorized'],
                send: { message: 'Token expirado' }
            };
        }

        return { continue: true };
    }

    private sendRequestErrorResponse(res: Response, responseBody: ResponseErrorBody)
    {
        res
            .status(responseBody.status)
            .setHeader(
                responseBody.header?.[0],
                responseBody.header?.[1]
            )
            .send(responseBody.send);
    }
}
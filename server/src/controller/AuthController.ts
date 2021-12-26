import { Request, Response } from "express";
import { INVALID_PASSWORD, USER_NOT_FOUND } from "../constants/constants";
import { AuthModel } from "../model/AuthModel";

type ReqBodyAuth = {
    email: string;
    password: string;
};

export class AuthController
{
    private model;
    
    constructor()
    {
        this.model = new AuthModel();
    }

    async authenticate(req: Request, res: Response)
    {
        const { email, password } = req.body as ReqBodyAuth;
        const response = await this.model.checkUser(email, password);

        if(response ===  USER_NOT_FOUND || response === INVALID_PASSWORD)
        {
            res
                .status(401)
                .setHeader('WWW-Authenticate', 'Unauthorized')
                .send({ message: 'Usuário e/ou senha inválido' });
                
            return;
        }
        
        res.status(200).send(response);
    }

    async confirmAuthentication(req: Request, res: Response)
    {
        const token = req.headers['x-access-token'];

        if(!token)
        {
            res
                .status(401)
                .setHeader('WWW-Authenticate', 'Unauthorized')
                .send({ auth: false });
        }

        if(this.model.verifyJWT(token as string))
        {
            res
                .status(200)
                .send({ auth: true });
        }
        else
        {
            res
                .status(401)
                .setHeader('WWW-Authenticate', 'Unauthorized')
                .send({ auth: false });
        }
    }
}
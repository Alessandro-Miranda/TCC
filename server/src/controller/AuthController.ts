import { Request, Response } from "express";
import { INVALID_PASSWORD, USER_NOT_FOUND } from "../constants/constants";
import { AuthModel } from "../model/AuthModel";

type ReqBodyAuth = {
    user: string;
    password: string;
};

export class AuthController
{
    constructor(private model = new AuthModel()){}

    async authenticate(req: Request, res: Response)
    {
        const { user, password } = req.body as ReqBodyAuth;
        
        const response = await this.model.checkUser(user, password);

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
import { Request, Response } from "express";
import { INVALID_PASSWORD, USER_NOT_FOUND } from "../constants/constants";
import { AuthModel } from "../model/AuthModel";

type ReqBodyAuth = {
    user: string;
    password: string;
};

export class AuthController
{
    async post(req: Request, res: Response)
    {
        const { user, password } = req.body as ReqBodyAuth;
        
        const model = new AuthModel();
        const response = await model.checkUser(user, password);

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
}
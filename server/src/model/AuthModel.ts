import { sign, verify } from 'jsonwebtoken';
import {
    INVALID_PASSWORD,
    USER_NOT_FOUND
} from '../constants';
import { Database } from '../repositories/Database';
import { User } from '../types/User';
import { passwordValidate } from '../utils/passwordValidate';

export class AuthModel
{
    private database;
    
    constructor()
    {
        this.database = new Database();
    }

    async checkUser(email: string, pwd: string)
    {
        const userFound = await this.database.findUserByEmail(email);

        if(!userFound)
        {
            return USER_NOT_FOUND;
        }

        const isValidPassword = passwordValidate(pwd, 'sha256', userFound.password);

        if(!isValidPassword)
        {
            return INVALID_PASSWORD;
        }
        
        const token = this.generateAuthToken(userFound);
        const { password, ...user } = userFound;

        return {
            token,
            user: user
        };
    }

    generateAuthToken(user: User)
    {
        const jwtSecret = process.env.JWT_SECRET?.trimEnd() as string;
        const token = sign({ id: user.email }, jwtSecret, {
            expiresIn: 1800
        });

        return token;
    }

    verifyJWT(token: string)
    {
        const secretKey = process.env.JWT_SECRET?.trimEnd() as string;
        let isUserAuthenticated = false;

        verify(token, secretKey, (err) => {
            if(!err)
            {
                isUserAuthenticated = true;
            }
        });

        return isUserAuthenticated;
    }
}
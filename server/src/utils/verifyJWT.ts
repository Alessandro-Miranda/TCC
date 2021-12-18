import { verify } from 'jsonwebtoken';

export function verifyJWT(token: string)
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
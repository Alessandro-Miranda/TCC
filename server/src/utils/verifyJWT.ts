import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const TOKEN = req.headers['x-access-token'] as string;
    const SECRET_KEY = process.env.JWT_SECRET?.trimEnd() ?? '';
    let decodedId: string;

    if(!TOKEN)
    {
        return res.status(500).json({
            auth: false,
            message: 'No token provided'
        }).end();
    }

    verify(TOKEN, SECRET_KEY, (err) => {
        if(err)
        {
            return res.status(500).json({
                auth: false,
                message: 'Failed to authenticate token'
            });
        }

        next();
    });
}
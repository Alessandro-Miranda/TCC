import { Router } from 'express';
import { getDatabase, ref, onValue } from 'firebase/database';
import { firebaseApp } from '../config/firebaseConfig';
import { createHash } from 'crypto';
import { sign } from 'jsonwebtoken';

const authRouter = Router();

type ReqBodyAuth = {
    userId: string;
    password: string;
};

type UserInformations = {
    id: string;
    department: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    admin: boolean;
};

authRouter.post('/', (req, res) => {
    const userInformations: ReqBodyAuth = req.body;
    const { userId, password } = userInformations;
    const HASHED_PASSWORD = createHash('sha256').update(password).digest('hex');
    const DB_REF = ref(getDatabase(firebaseApp), '/users');
    
    // Inicia o objeto com as propriedades vazias
    const user: UserInformations = {
        id: '',
        department: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        admin: false
    };

    onValue(DB_REF, (value) => {
        value.forEach(elem => elem.key === userId && Object.assign(user, elem.val()));
        
        if(Object.values(user).some(value => value === ''))
        {
            res.status(500).json({
                message: 'Usuário não encontrado'
            }).end();
            return;
        }
        
        if(HASHED_PASSWORD !== user.password)
        {
            res.status(500).json({
                message: 'Senha incorreta'
            }).end();
            return;
        }

        const JWT_SECRET = process.env.JWT_SECRET?.trimEnd() ?? '';
        const TOKEN = sign({ id: user.id }, JWT_SECRET, {
            expiresIn: 600
        });
        
        res.status(200).json({
            auth: true,
            TOKEN,
            isAdmin: user.admin
        }).end();
    }, { onlyOnce: true });
});

export { authRouter };
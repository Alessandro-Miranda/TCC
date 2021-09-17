import { Router } from 'express';
import { getDatabase, ref, onValue } from 'firebase/database';
import { firebaseApp } from '../config/firebaseConfig';
import { createHash } from 'crypto';
import { sign } from 'jsonwebtoken';

const authRouter = Router();

type ReqBodyAuth = {
    user: string;
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
    const { user, password } = req.body as ReqBodyAuth;
    const HASHED_PASSWORD = createHash('sha256').update(password).digest('hex');
    // obtém a referência do banco firebase
    const DB_REF = ref(getDatabase(firebaseApp), '/users');
    
    // Inicia o objeto com as propriedades vazias
    const userInformations: UserInformations = {
        id: '',
        department: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        admin: false
    };

    onValue(DB_REF, (value) => {
        value.forEach(elem => elem.key === user && Object.assign(userInformations, elem.val()));
        
        // Checa se foi encontrado algum
        if(Object.values(user).some(value => value === ''))
        {
            return res.status(500).json({
                message: 'Usuário não encontrado'
            });
        }
        
        if(HASHED_PASSWORD !== userInformations.password)
        {
            return res.status(500).json({
                message: 'Senha incorreta'
            });
        }

        const JWT_SECRET = process.env.JWT_SECRET?.trimEnd() ?? '';
        const TOKEN = sign({ id: userInformations.id }, JWT_SECRET, {
            expiresIn: 600
        });
        
        res.status(200).json({
            auth: true,
            token: TOKEN,
            isAdmin: userInformations.admin
        });
    }, { onlyOnce: true });
});

export { authRouter };
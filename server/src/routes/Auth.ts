import { Router } from 'express';
import { getDatabase, ref, onValue, query, orderByChild } from 'firebase/database';
import { firebaseApp } from '../config/firebaseConfig';

export const authRouter = Router();

authRouter.get('/', (req, res) => {
    res.send('vai tomar no cu')
});

type ReqBodyAuth = {
    userId: string;
    password: string;
};

type UserInformations = {
    department: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
};

authRouter.post('/', (req, res) => {
    const userInformations: ReqBodyAuth = req.body;
    const { userId, password } = userInformations;
    const dbRef = ref(getDatabase(firebaseApp), '/users');
    
    const user: UserInformations = {
        department: '',
        email: '',
        first_name: '',
        last_name: '',
        password: ''
    };

    onValue(dbRef, (value) => {
        value.forEach(elem => elem.key === userId && Object.assign(user, elem.val()));
    }, { onlyOnce: true });

    if(Object.values(user).every(value => value === ''))
    {
        res.send('Usuário não encontrado');
        res.end();
        return;
    }

    if(password !== user.password)
    {
        res.send('Senha incorreta');
        res.end();
        return;
    }

    // Configurar aqui a autenticação JWT
    res.send('ok');
});
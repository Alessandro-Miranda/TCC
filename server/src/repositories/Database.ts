import { CollectionReference, DocumentData, getDocs, query, where } from "firebase/firestore";
import { IDatabaseRepositorie } from "../interfaces/IDatabaseRepository";
import { User } from "../types/User";

export class Database implements IDatabaseRepositorie
{
    async findUserByEmail(userRef: CollectionReference<DocumentData>, email: string)
    {
        const queryToExecute = query(userRef, where('email', '==', email));
        
        const querySnapshot = await getDocs(queryToExecute);
        const userFound: User[] = [];
        
        querySnapshot.forEach(doc => {
            userFound.push(doc.data() as User);
        });

        return userFound;    
    }
}
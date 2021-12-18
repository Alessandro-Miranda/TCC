import { createHash } from 'crypto';

export function passwordValidate(password: string, hash: string, passwordToCompare: string)
{
    const HASHED_PWD = createHash(hash).update(password).digest('hex');

    return HASHED_PWD === passwordToCompare;
}
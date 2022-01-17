export type Contact = {
    department: string;
    email: string;
    firstName: string;
    lastName: string;
    image?: string;
    chatID: string;
}

export type User = {
    firstName: string;
    department: string;
    email: string;
    lastName: string;
    password: string;
    admin: boolean;
}
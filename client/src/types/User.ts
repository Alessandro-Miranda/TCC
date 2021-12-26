export type Contact = {
    chatID: string;
    department: string;
    email: string;
    first_name: string;
    last_name: string;
    image?: string;
}

export type User = {
    first_name: string;
    department: string;
    email: string;
    last_name: string;
    password: string;
    admin: boolean;
}
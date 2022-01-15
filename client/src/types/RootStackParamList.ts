import { Contact } from "./User";

export type RootStackParamList = {
    Home: undefined;
    SignIn: undefined;
    Profile: { userId: string };
    Message: {
        contact: Contact;
    };
};
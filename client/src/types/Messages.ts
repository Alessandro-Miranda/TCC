import { Contact } from "./User"

export type Preview = {
    contact: Contact
    messagePreview: string;
    timestamp: number;
}

export type MessageBody = {
    chatID: string;
    messageID: string;
    message: string;
    from: string;
    to: string;
    timestamp: number;
    state: MessageState
}

export enum MessageState {
    Wait = 'Wait',
    Sent = 'Sent',
    Received = 'Received'
}
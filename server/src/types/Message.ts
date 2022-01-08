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
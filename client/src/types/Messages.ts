export type Preview = {
    contactName: string;
    messagePreview: string;
    time: string;
    photo: string;
}

export type MessageBody = {
    message: string;
    from: string;
    timestamp: number;
    state?: string;
}

export enum MessageState {
    Wait = 'Wait',
    Sent = 'Sent',
    Received = 'Received'
}
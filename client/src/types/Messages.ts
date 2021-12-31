export type Preview = {
    contactName: string;
    messagePreview: string;
    time: string;
    photo: string;
}

export enum MessageState {
    Wait = 'Wait',
    Sent = 'Sent',
    Received = 'Received'
}
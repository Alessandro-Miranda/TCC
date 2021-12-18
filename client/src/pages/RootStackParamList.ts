export type RootStackParamList = {
    Home: undefined;
    Profile: { userId: string };
    Chats: { chatId: string };
    Messages: { sort: 'latest' | 'top' } | undefined;
};
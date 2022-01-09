import React, { useEffect, useState } from "react";
import { Alert, Image, NativeSyntheticEvent, TextInput, TextInputChangeEventData, View } from "react-native";
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";
import { NavigationStackScreenProps } from "react-navigation-stack";
import { io, Socket } from "socket.io-client";
import MessagesText from "../../components/MessagesText";
import { api } from "../../services/api";
import { MessageBody, MessageState } from "../../types/Messages";
import { RootStackParamList } from "../../types/RootStackParamList";
import { Contact, User } from "../../types/User";
import { getInformationsFromStorage } from "../../utils/getInformationsFromStorage";
import { styles } from "./styles";

type Props = NavigationStackScreenProps<RootStackParamList, "Message">;

const Message: React.FC <Props> = ({ navigation }) => {
    const [ message, setMessage ] = useState('');
    const [ userInfos, setUserInfos ] = useState({} as User);
    const [ allMessages, setAllMessages ] = useState([] as MessageBody[]);
    const [ chatInfos, setChatInfos ] = useState({ chatID: '', contactInfo: {} as Contact });
    const [ socket, setSocket ] = useState<Socket>();
    
    useEffect(() => {
        asyncBootstrap();
        const socket = io("http://192.168.1.4:4000/");

        setSocket(socket);
        
        const contactInfo = navigation.state.params?.contact as Contact;
        const chatID = navigation.state.params?.chatID;

        setChatInfos({
            chatID,
            contactInfo
        });

        return () => {
            socket.disconnect();
        }
    }, []);

    const asyncBootstrap = async () => {
        const user = await getInformationsFromStorage('user');

        if(user)
        {
            setUserInfos(JSON.parse(user));
        }
    }

    const onTypeMessage = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setMessage(event.nativeEvent.text);
    }

    const onSendMessage = async () => {
        const newMessage = [...allMessages];

        newMessage.push({
            from: userInfos.email,
            message,
            timestamp: new Date().getTime(),
            state: MessageState.Wait
        });
        
        setAllMessages(newMessage);

        if(chatInfos.chatID === '')
        {
            const wasCreated = await createChat();

            if(!wasCreated)
            {
                return;
            }
        }

        await sendMessage();
        setMessage('');

    }

    const sendMessage = async () => {

    }

    const createChat = async (): Promise<boolean> => {
        try
        {
            const token = await getInformationsFromStorage('authToken');

            const { data } = await api.post<{ chatID: string }>('/messages/create-chat', {
                userEmail: userInfos.email,
                contactEmail: chatInfos.contactInfo.email,
                headers: {
                    'x-access-token': token?.replace(/"/g, '')
                }
            });

            const chat = {
                ...chatInfos,
                chatID: data.chatID
            };

            setChatInfos(chat);
            return true;
        }
        catch(err)
        {
            Alert.alert('Algo inesperado aconteceu por aqui :(', 'Um erro inesperado ocorreu ao iniciar a conversa. Por favor, tente enviar a mensagem novamente');
            return false;
        }
    }

    return (
        <View style={styles.messageContainer}>
            <ScrollView
                style={styles.messageWrapper}
            >
                {
                    allMessages.map((message, index) => (
                        <MessagesText
                            message={message.message}
                            from={message.from}
                            timestamp={message.timestamp}
                            state={message.state}
                            key={index}
                        />
                    ))
                }
            </ScrollView>
            <View style={styles.messageInputContainer}>
                <TextInput
                    value={message}
                    onChange={onTypeMessage}
                    autoCapitalize={'sentences'}
                    autoCorrect={true}
                    multiline={true}
                    style={styles.messageInput}
                />
                <TouchableHighlight
                    underlayColor={'unset'}
                    onPress={onSendMessage}
                >
                    <Image
                        width={20}
                        height={20}
                        source={require('../../../assets/send.png')}
                    />
                </TouchableHighlight>
            </View>
        </View>
    )
}

export default Message;
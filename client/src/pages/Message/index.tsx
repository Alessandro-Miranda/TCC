import React, { useEffect, useRef, useState } from "react";
import { Alert, Image, NativeSyntheticEvent, TextInput, TextInputChangeEventData, View } from "react-native";
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";
import 'react-native-get-random-values';
import { NavigationStackScreenProps } from "react-navigation-stack";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';
import MessagesText from "../../components/MessagesText";
import { BASE_URL, NEW_MESSAGE } from "../../constants";
import { api } from "../../services/api";
import { MessageBody, MessageState } from "../../types/Messages";
import { RootStackParamList } from "../../types/RootStackParamList";
import { Contact, User } from "../../types/User";
import { getInformationsFromStorage } from "../../utils/getInformationsFromStorage";
import { styles } from "./styles";

type Props = NavigationStackScreenProps<RootStackParamList, "Message">;
type Message = Omit<MessageBody, "chatID" | "to">

const Message: React.FC <Props> = ({ navigation }) => {
    const [ message, setMessage ] = useState('');
    const [ userInfos, setUserInfos ] = useState({} as User);
    const [ allMessages, setAllMessages ] = useState([] as Message[]);
    const [ chatInfos, setChatInfos ] = useState({} as Contact);
    const [ socket, setSocket ] = useState<Socket>();
    
    const scrollViewRef = useRef<ScrollView>(null);
    
    useEffect(() => {
        asyncBootstrap();
        const socket = io(BASE_URL);
        
        setSocket(socket);
        
        const contactInfo = navigation.state.params?.contact as Contact;
        setChatInfos({
            ...contactInfo
        });
        
        if(contactInfo.chatID)
        {
            socket.emit(NEW_MESSAGE, contactInfo.chatID);
        }

        return () => {
            socket.disconnect();
        }
    }, []);

    socket?.on(NEW_MESSAGE, (data: MessageBody[]) => {
        
        setAllMessages(data);
    });

    const onScrollToBottom = () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

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
            messageID: uuidv4(),
            from: userInfos.email,
            message: message.trimEnd(),
            timestamp: new Date().getTime(),
            state: MessageState.Wait
        });
        
        setAllMessages(newMessage);
        
        if(!chatInfos.chatID)
        {
            const wasCreated = await createChat();

            if(!wasCreated)
            {
                return;
            }
        }

        await sendMessage(newMessage);
    }

    const sendMessage = async (messages: Message[]) => {
        try
        {
            const lastMessage = messages[messages.length - 1] as Message;
            
            const messageToSend: MessageBody = {
                chatID: chatInfos.chatID,
                ...lastMessage,
                to: chatInfos.email
            };
            
            const { data } = await api.post<{ isSent: boolean, message: string }>("/messages/send", messageToSend);
            socket?.emit(NEW_MESSAGE, 'teste');
            if(!data.isSent)
            {
                Alert.alert('Ocorreu um erro ao enviar a mensagem', "Por favor, tente novamente");
                return;
            }
            setMessage('');
        }
        catch(err)
        {
            Alert.alert('Ocorreu um erro ao enviar a mensagem', "Por favor, tente novamente");
            return;
        }
    }

    const createChat = async (): Promise<boolean> => {
        try
        {
            const token = await getInformationsFromStorage('authToken');
            
            const { data } = await api.post<{ chatID: string }>('/messages/create-chat', {
                userEmail: userInfos.email,
                contactEmail: chatInfos.email,
            },
            {
                headers: {
                    'x-access-token': token?.replace(/"/g, '')
                }
            });
                    
            setChatInfos({
                ...chatInfos,
                chatID: data.chatID
            });

            navigation.setParams({
                Message: {
                    contact: { ...chatInfos }
                }
            });
            
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
                ref={scrollViewRef}
                onContentSizeChange={onScrollToBottom}
                style={styles.messageWrapper}
            >
                {
                    allMessages.map((message) => (
                        <MessagesText
                            message={message.message}
                            from={message.from}
                            timestamp={message.timestamp}
                            state={message.state}
                            messageID={message.messageID}
                            key={message.messageID}
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
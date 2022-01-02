import React, { useEffect, useState } from "react";
import { Image, NativeSyntheticEvent, TextInput, TextInputChangeEventData, View } from "react-native";
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";
import { NavigationStackScreenProps } from "react-navigation-stack";
import MessagesText from "../../components/MessagesText";
import { MessageBody, MessageState } from "../../types/Messages";
import { RootStackParamList } from "../../types/RootStackParamList";
import { Contact } from "../../types/User";
import { getInformationsFromStorage } from "../../utils/getInformationsFromStorage";
import { styles } from "./styles";

type Props = NavigationStackScreenProps<RootStackParamList, "Message">;

const Message: React.FC <Props> = ({ navigation }) => {
    const [ message, setMessage ] = useState('');
    const [ allMessages, setAllMessages ] = useState([] as MessageBody[]);
    const [ chatInfos, setChatInfos ] = useState({ chatID: '', contactInfo: {} as Contact });
    
    useEffect(() => {
        const contactInfo = navigation.state.params?.contact as Contact;
        const chatID = navigation.state.params?.chatID;

        setChatInfos({
            chatID,
            contactInfo
        });
    }, []);

    const onTypeMessage = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setMessage(event.nativeEvent.text);
    }

    const onSendMessage = async () => {
        const newMessage = [...allMessages];
        const userInfo = await getInformationsFromStorage('user');

        if(userInfo)
        {
            const { email } = JSON.parse(userInfo);

            newMessage.push({
                from: email,
                message,
                timestamp: new Date().getTime(),
                state: MessageState.Wait
            });
            
            setAllMessages(newMessage);

            initChat();
        }

    }

    const initChat = () => {
        if(chatInfos.chatID !== "")
        {

        }
        else
        {
            createChat();
        }
    }

    const createChat = () => {

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
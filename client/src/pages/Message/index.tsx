import React, { useEffect, useState } from "react";
import { Image, NativeSyntheticEvent, TextInput, TextInputChangeEventData, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { NavigationStackScreenProps } from "react-navigation-stack";
import MessagesText from "../../components/MessagesText";
import { MessageBody } from "../../types/Messages";
import { RootStackParamList } from "../../types/RootStackParamList";
import { Contact } from "../../types/User";
import { styles } from "./styles";

type Props = NavigationStackScreenProps<RootStackParamList, "Message">;

const Message: React.FC <Props> = ({ navigation }) => {
    
    const [ contact, setContact ] = useState({} as Contact);
    const [ chatID, setChatID] = useState('');
    const [ message, setMessage ] = useState('');
    const [ allMessages, setAllMessages ] = useState([] as MessageBody[]);

    useEffect(() => {
        const contact = navigation.state.params?.contact as Contact;
        const chatID = navigation.state.params?.chatID;
        
        setContact(contact);
        setAllMessages([
            {
                message: 'coe neguim',
                from: 'joao@empresa.com',
                timestamp: '1640975957317'
            },
        ]);

        if(chatID !== "") setChatID(chatID);
    }, []);

    const onTypeMessage = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setMessage(event.nativeEvent.text);
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
                <Image
                    width={20}
                    height={20}
                    source={require('../../../assets/send.png')}
                />
            </View>
        </View>
    )
}

export default Message;
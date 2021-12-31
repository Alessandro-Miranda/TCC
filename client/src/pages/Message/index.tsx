import React, { useEffect, useState } from "react";
import { Image, NativeSyntheticEvent, TextInput, TextInputChangeEventData, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { NavigationStackScreenProps } from "react-navigation-stack";
import MessagesText from "../../components/MessagesText";
import { MessageState } from "../../types/Messages";
import { RootStackParamList } from "../../types/RootStackParamList";
import { Contact } from "../../types/User";
import { styles } from "./styles";

type Props = NavigationStackScreenProps<RootStackParamList, "Message">;

const Message: React.FC <Props> = ({ navigation }) => {
    
    const [ contact, setContact ] = useState({} as Contact);
    const [ chatID, setChatID] = useState('');
    const [ message, setMessage ] = useState('');

    useEffect(() => {
        const contact = navigation.state.params?.contact as Contact;
        const chatID = navigation.state.params?.chatID;
        
        setContact(contact);

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
                <MessagesText
                    message="E aí, meu mano!! Só na paz? tudo no progresso hj?"
                    from="joão@empresa.com"
                    timestamp="1640975957317"
                    state={MessageState.Received}
                    key={1}
                />
                <MessagesText
                    message="Salve, neguim! To suave e vc?"
                    from="alessandro@empresa.com.br"
                    timestamp="1640976081729"
                    state={MessageState.Wait}
                    key={2}
                />
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
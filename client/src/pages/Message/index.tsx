import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { NavigationStackScreenProps } from "react-navigation-stack";
import { RootStackParamList } from "../../types/RootStackParamList";
import { Contact } from "../../types/User";

type Props = NavigationStackScreenProps<RootStackParamList, "Message">;

const Message: React.FC <Props> = ({ navigation}) => {
    
    const [ contact, setContact ] = useState({} as Contact);

    useEffect(() => {
        const Param = navigation.state.params?.contact as Contact;
        
        setContact(Param);
    }, []);

    return (
        <View>
            <Text>Aqui vai ficar a mensagem</Text>
            <Text>Contato: {JSON.stringify(contact)}</Text>
        </View>
    )
}

export default Message;
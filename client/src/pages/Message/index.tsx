import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { NavigationStackScreenProps } from "react-navigation-stack";
import { RootStackParamList } from "../../types/RootStackParamList";

type Props = NavigationStackScreenProps<RootStackParamList, "Message">;

const Message: React.FC <Props> = ({ navigation, screenProps}) => {
    
    const [ contact, setContact ] = useState({} as any);

    useEffect(() => {
        const Param = navigation.state.params?.contact;
        
        // Alert.alert(JSON.stringify(Param));
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
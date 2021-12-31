import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { MessageState } from "../../types/Messages";
import { User } from "../../types/User";
import { getInformationsFromStorage } from "../../utils/getInformationsFromStorage";
import { styles } from "./styles";

type Props = {
    message: string;
    timestamp: string;
    from: string;
    state?: MessageState
};

const MessagesText: React.FC<Props> = ({
    message,
    from,
    timestamp,
    state
}) => {
    const [ userEmail, setUserEmail ] = useState('');

    useEffect(() => {
        asyncBootstrap();
    }, []);

    const asyncBootstrap = async () => {
        const userInfo = await getInformationsFromStorage('user');

        if(userInfo)
        {
            const { email } = JSON.parse(userInfo) as User;

            setUserEmail(email);
        }
    }
    return (
        <View style={[
            styles.messageWrapper,
            userEmail === from ? styles.messageSent : styles.messageReceived
        ]}>
            <View style={[
                styles.messageContainerDetail,
                userEmail === from ? styles.messageContainerDetailSent : styles.messageContainerDetailReceived
            ]}>
            </View>
            <Text style={styles.messageText}>
                {message}
            </Text>
        </View>
    );
};

export default MessagesText;
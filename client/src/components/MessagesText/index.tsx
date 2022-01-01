import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { MessageBody, MessageState } from "../../types/Messages";
import { User } from "../../types/User";
import { getInformationsFromStorage } from "../../utils/getInformationsFromStorage";
import { styles } from "./styles";

const MessagesText: React.FC<MessageBody> = ({
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

    const getTimeFromTimestamp = () => {
        const date = new Date(Number(timestamp));
        const hours = date.getHours();
        const minutes = date.getMinutes();
        
        return `${hours}:${minutes}`;
    }

    const getUriImage = () => {
        const baseUrl = '../../../assets/';
        
        if(state === MessageState.Received)
        {
            return require(baseUrl + "double-check.png");
        }
        else if(state === MessageState.Sent)
        {
            return require(baseUrl + "check.png");
        }
        else
        {
            return require(baseUrl + "clock.png");
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
            <View style={styles.messageHourAndStatusContainer}>
                <Text style={styles.messageHour}>
                    {getTimeFromTimestamp()}
                </Text>
                {
                    userEmail === from && (
                        <Image
                            source={getUriImage()}
                            style={styles.messageStateIcon}
                        />
                    )
                }
            </View>
        </View>
    );
};

export default MessagesText;
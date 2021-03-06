import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { MessageBody, MessageState } from "../../types/Messages";
import { User } from "../../types/User";
import { getInformationsFromStorage } from "../../utils/getInformationsFromStorage";
import { styles } from "./styles";

const MessagesText: React.FC<Omit<MessageBody, "chatID" | "to">> = ({
    message,
    from,
    timestamp,
    state,
    messageID
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
        const date = new Date(timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
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
        <View
        style={[
            styles.messageWrapper,
            userEmail === from ? styles.messageSent : styles.messageReceived,
            state === MessageState.Wait && styles.messageSentWaiting
        ]}
        key={messageID}
        >
            <View style={[
                styles.messageContainerDetail,
                userEmail === from ? styles.messageContainerDetailSent : styles.messageContainerDetailReceived,
                { opacity: state === MessageState.Wait ? 0 : 1 }
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
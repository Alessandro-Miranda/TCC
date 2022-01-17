import React from "react";
import { FlatList, Text, View } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import { NavigationParams, NavigationRoute } from "react-navigation";
import { StackNavigationProp } from "react-navigation-stack/lib/typescript/src/vendor/types";
import { Preview } from "../../types/Messages";
import { RootStackParamList } from "../../types/RootStackParamList";
import { Contact } from "../../types/User";
import ProfileImage from "../ProfileImage";
import { styles } from "./styles";

type Props = {
    messages: Preview[];
    navigation: StackNavigationProp<NavigationRoute<NavigationParams>, RootStackParamList>;
}

const MessagePreview: React.FC<Props> = ({ messages, navigation }) => {
    
    const getTime = (time: number) => {
        const date = new Date(time);
        const hour = date.getHours();
        const minutes = date.getMinutes();

        return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    const onSelectMessage = (contact: Contact) => {
        navigation.navigate('Mensagem', {
            contact
        });
    }

    return (
        <FlatList
            data={messages}
            renderItem={({ item, index }) => (
                <TouchableHighlight
                    style={styles.messageContainer}
                    onPress={() => onSelectMessage(item.contact)}
                    key={index}
                    underlayColor={'unset'}
                >
                    <View style={styles.messageContainerView}>
                        <ProfileImage
                            uri={'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png'}
                            width={50}
                            height={50}
                            style={styles.profileImage}
                        />
                        <View style={styles.contactNameAndMessage}>
                            <Text style={styles.contactName}>
                                {`${item.contact.firstName} ${item.contact.lastName}`}
                            </Text>
                            <View style={styles.messagePreviewContainer}>
                                <Text style={styles.messagePreview}>
                                    {`${item.messagePreview.substring(0, 37)}...`}
                                </Text>
                                <Text style={styles.messageTime}>
                                    {`${getTime(item.timestamp)}`}
                                </Text>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
            )}
            keyExtractor={(_, index) => index.toString()}
            style={styles.wrapper}
        />
    );
}

export default MessagePreview;
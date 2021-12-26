import React from "react";
import { Text, View } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import { Contact } from "../../types/User";
import ProfileImage from "../ProfileImage";
import { styles } from "./styles";

type Infos = {
    contact: Contact;
    index: number;
};
export const ContactInfos: React.FC<Infos> = ({ contact, index }) => {
    
    const onSelectedContact = (chatId?: string) => {
        
    }

    const changeTextToLowerOrUppercase = (text: string) => {
        if(text.length <= 5)
        {
            return text.toUpperCase();
        }
        else
        {
            return text
                .split(" ")
                .map(word => word[0].toUpperCase() + word.slice(1))
                .join(" ");
        }
    }
    
    return (
        <TouchableHighlight
        onPress={() => onSelectedContact(contact.chatID)}
            style={styles.touchableArea}
        >
            <View style={styles.contactInfoContainer} key={index}>
                <ProfileImage
                    width={50}
                    height={50}
                    uri={`${!contact.image
                        ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                        : contact.image}`}
                    style={styles.profileImage} />
                <View>
                    <Text style={styles.contactName}>{contact.first_name} {contact.last_name}</Text>
                    <Text style={styles.contactDepartment}>
                        {changeTextToLowerOrUppercase(contact.department)}
                    </Text>
                </View>
            </View>
        </TouchableHighlight>
    );
}

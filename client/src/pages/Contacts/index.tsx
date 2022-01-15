import React, { useEffect, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import { NavigationStackScreenProps } from "react-navigation-stack";
import { ContactInfos } from "../../components/ContactInfo";
import { api } from "../../services/api";
import { RootStackParamList } from "../../types/RootStackParamList";
import { Contact, User } from "../../types/User";
import { getInformationsFromStorage } from "../../utils/getInformationsFromStorage";

type Props = NavigationStackScreenProps<RootStackParamList, "Message">;

const Contacts: React.FC<Props> = (navigation) => {
    const [ contacts, setContacts ] = useState<Contact[]>([]);

    useEffect(() => {
        asyncInit();
    }, []);

    const asyncInit = async () => {
        const userInformation = await getInformationsFromStorage('user') as string;
        const token = await getInformationsFromStorage('authToken');
        const { email, department } = JSON.parse(userInformation) as User; 
        
        try
        {
            const { data } = await api.get<Contact[]>(`/messages/contacts/${email}`, {
                headers: {
                    'x-access-token': token?.replace(/"/g, '')
                }
            });

            setContacts(data);
        }
        catch(err)
        {
            console.log(err);
            Alert.alert('Ocorreu um erro inesperado. Por favor, tente novamente');
        }

    };

    return (
        <View>
            <FlatList
                data={contacts}
                renderItem={({ item, index }) => <ContactInfos contact={item} navigation={navigation} index={index} />}
                keyExtractor={(_, index) => index.toString()}
            />
        </View>
    )
}

export default Contacts;
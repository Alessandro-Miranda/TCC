import React, { useEffect, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import { ContactInfos } from "../../components/ContactInfo";
import { api } from "../../services/api";
import { Contact, User } from "../../types/User";
import { getInformationsFromStorage } from "../../utils/getInformationsFromStorage";

const Contacts: React.FC = () => {
    const [ contacts, setContacts ] = useState<Contact[]>([]);

    useEffect(() => {
        asyncInit();
    }, []);

    const asyncInit = async () => {
        const userInformation = await getInformationsFromStorage('user') as string;
        const token = await getInformationsFromStorage('authToken');
        const { email } = JSON.parse(userInformation) as User; 
        
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
            Alert.alert('Ocorreu um erro inesperado. Por favor, tente novamente');
        }

    };

    return (
        <View>
            <FlatList
                data={contacts}
                renderItem={({ item, index }) => <ContactInfos contact={item} index={index} />}
                keyExtractor={(_, index) => index.toString()}
            />
        </View>
    )
}

export default Contacts;
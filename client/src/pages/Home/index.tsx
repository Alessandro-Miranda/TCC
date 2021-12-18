import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import {
    FlatList, Text,
    View
} from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import ProfileImage from '../../components/ProfileImage';
import { validateLogin } from '../../utils/validateLogin';
import { RootStackParamList } from '../RootStackParamList';
import { styles } from './styles';

type Props = NavigationStackScreenProps<RootStackParamList, 'Auth'>
const Home: React.FC<Props> = ({ navigation }) => {

    useEffect(() => {
        bootstrapAsync();
    }, []);

    const bootstrapAsync = async () => {
        const token = await AsyncStorage.getItem('authToken');
        await validateLogin(token, navigation);
    }

    const onMessageSelect = () => {

    }

    return (
        <View style={styles.container}>
            <FlatList
                data={[
                    { contactName: 'João', message: 'Alguma mensagem que você verá a introdução dela' },
                    { contactName: 'Maria', message: 'Alguma mensagem que você verá a introdução dela' },
                    { contactName: 'Elaine', message: 'Alguma mensagem que você verá a introdução dela' },
                    { contactName: 'Kelly', message: 'Alguma mensagem que você verá a introdução dela' },
                    { contactName: 'Rodrigo', message: 'Alguma mensagem que você verá a introdução dela' },
                ]}
                renderItem={({ item, index }) => (
                    <TouchableHighlight
                        style={styles.messageContainer}
                        onPress={onMessageSelect}
                        key={index}
                    >
                        <View style={styles.messageContainerView}>
                            <ProfileImage
                                uri={'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png'}
                                width={50}
                                height={50}
                                style={styles.profileImage}
                            />
                            <View style={styles.contactNameAndMessage}>
                                <Text style={styles.contactName}>{item.contactName}</Text>
                                <Text style={styles.messagePreview}>
                                    {`${item.message.substring(0, 40)}...`}
                                </Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                )}
                keyExtractor={(_, index) => index.toString()}
                style={styles.flatList}
            />
            <View>
                <Text style={styles.showContactsIcon}>Icon</Text>
            </View>    
        </View>
    );
}

export default Home;
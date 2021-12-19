import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
    Image,
    Text,
    View
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import MessagePreview from '../../components/MessagePreview';
import { Preview } from '../../types/Messages';
import { RootStackParamList } from '../../types/RootStackParamList';
import { validateLogin } from '../../utils/validateLogin';
import { styles } from './styles';

type Props = NavigationStackScreenProps<RootStackParamList, 'Auth'>

const Home: React.FC<Props> = ({ navigation }) => {

    const [ messages, setMessages ] = useState<Preview>();

    useEffect(() => {
        bootstrapAsync();
    }, []);

    const bootstrapAsync = async () => {
        const token = await AsyncStorage.getItem('authToken');
        await validateLogin(token, navigation);
    }

    return (
        <View style={styles.container}>
            {
                messages ? <MessagePreview /> : <NoMessages />
            }
            <View style={styles.showContactsIcon}> 
                <TouchableOpacity>
                    <Image
                        source={require('../../../assets/chat.png')}
                        style={styles.showContactIconImage}
                    />
                </TouchableOpacity>
            </View>    
        </View>
    );
}

const NoMessages = () => (
    <View style={[ styles.wrapper, styles.noMessage ]}>
        <Text style={styles.noMessageText}>
            Você ainda não possui nenhuma mensagem.
        </Text>
    </View>
)

export default Home;
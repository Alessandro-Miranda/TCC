import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Text,
    View
} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { io, Socket } from 'socket.io-client';
import MessagePreview from '../../components/MessagePreview';
import { BASE_URL } from '../../constants';
import { api } from '../../services/api';
import { Preview } from '../../types/Messages';
import { RootStackParamList } from '../../types/RootStackParamList';
import { User } from '../../types/User';
import { getInformationsFromStorage } from '../../utils/getInformationsFromStorage';
import { validateLogin } from '../../utils/validateLogin';
import { styles } from './styles';

type Props = NavigationStackScreenProps<RootStackParamList>

const Home: React.FC<Props> = ({ navigation }) => {

    const [ messages, setMessages ] = useState<Preview[]>();
    const [ socket, setSocket ] = useState<Socket>();

    useEffect(() => {
        bootstrapAsync();

        const socket = io(BASE_URL);

        setSocket(socket);

        asyncGetMessages();

        return () => {
            socket.disconnect();
        }
    }, []);

    socket?.on('', (data: Preview[]) => {
        setMessages(data);
    });

    const asyncGetMessages= async () => {
        const userInfo = await getInformationsFromStorage('user');

        if(userInfo)
        {
            const { email } = JSON.parse(userInfo) as User;
            
            try
            {
                const { data } = await api.get<Preview[]>(`/messages/get-messages/${email}`);

                if(data.length)
                {
                    setMessages(data);
                }
                
            }
            catch(err)
            {
                Alert.alert('Ocorreu um erro inesperado', 'Por favor, tente fechar e abrir a aplicação novamente');
            }
        }
        
    } ;

    const bootstrapAsync = async () => {
        const token = await getInformationsFromStorage('authToken');
        await validateLogin(token, navigation);
    }

    const onContactsPress = async () => {
        const token = await getInformationsFromStorage('authToken');
        await validateLogin(token, navigation, 'Contatos');
    }

    return (
        <ScrollView style={styles.container}>
            {
                messages
                ? (
                    <MessagePreview
                        messages={messages}
                        navigation={navigation}
                    />
                ) : <NoMessages />
            }
            <View style={styles.showContactsIcon}> 
                <TouchableOpacity onPress={onContactsPress}>
                    <Image
                        source={require('../../../assets/chat.png')}
                        style={styles.showContactIconImage}
                    />
                </TouchableOpacity>
            </View>    
        </ScrollView>
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
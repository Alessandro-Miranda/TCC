import React, { useContext, useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Text,
    View
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import MessagePreview from '../../components/MessagePreview';
import { NEW_CHAT } from '../../constants';
import { SocketContext } from '../../contexts/socketContext';
import { api } from '../../services/api';
import { Preview } from '../../types/Messages';
import { RootStackParamList } from '../../types/RootStackParamList';
import { User } from '../../types/User';
import { getInformationsFromStorage } from '../../utils/getInformationsFromStorage';
import { validateLogin } from '../../utils/validateLogin';
import { styles } from './styles';

type Props = NavigationStackScreenProps<RootStackParamList>

const Home: React.FC<Props> = ({ navigation }) => {

    const [ messages, setMessages ] = useState([] as Preview[]);
    const [ userInfos, setUserInfos ] = useState<User>({} as User);
    const { socket } = useContext(SocketContext);

    useEffect(() => {
        bootstrapAsync();
        
        asyncGetMessages();

        return () => {
            socket?.disconnect();
        }
    }, []);

    useEffect(() => {
        
        if(userInfos.email)
        {            
            socket?.emit(NEW_CHAT, userInfos.email);
        }
    }, [userInfos]);

    socket?.on(NEW_CHAT, (data: Preview[]) => {
        setMessages(data);
    });

    const asyncGetMessages= async () => {
        const userInfo = await getInformationsFromStorage('user');

        if(userInfo)
        {
            setUserInfos(JSON.parse(userInfo));

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
                Alert.alert('Ocorreu um erro inesperado', 'Por favor, tente fechar e abrir a aplica????o novamente');
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
        <View style={styles.container}>
            {
                messages.length
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
        </View>
    );
}

const NoMessages = () => (
    <View style={[ styles.wrapper, styles.noMessage ]}>
        <Text style={styles.noMessageText}>
            Voc?? ainda n??o possui nenhuma mensagem.
        </Text>
    </View>
)

export default Home;
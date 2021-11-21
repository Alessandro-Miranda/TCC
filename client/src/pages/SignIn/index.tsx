import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
    Text,
    TextInput,
    NativeSyntheticEvent,
    TextInputChangeEventData,
    View,
    Alert,
    ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../RootStackParamList';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { styles } from './styles';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { api } from '../../services/api';
import { colors } from '../../styles';
import MaskInput, { Masks } from 'react-native-mask-input';


type Props = NavigationStackScreenProps<RootStackParamList, 'SignIn'>
type ApiResponse = {
    auth: boolean;
    token: string;
    isAdmin: boolean;
};

const SignIn: React.FC<Props> = ({ navigation }) => {

    const [ loginInformation, setLoginInformation ] = useState({ user: '', pwd: '' });
    const [ isLoading, setIsLoading ] = useState(false);

    const handleChangeUserName = (phoneNumber: string) =>
    {
        setLoginInformation({
            ...loginInformation,
            user: phoneNumber
        });
    }
    const handleChangePwd = (event: NativeSyntheticEvent<TextInputChangeEventData>) =>
    {
        setLoginInformation({
            ...loginInformation,
            pwd: event.nativeEvent.text
        });
    }

    const onLogin = async () => {
        setIsLoading(!isLoading);
        if(loginInformation.user === '' || loginInformation.pwd === '')
        {
            setIsLoading(!isLoading);
            Alert.alert('Preencha todos os campos', 'Por favor, preencha o e-mail e a senha para continuar');
            return;
        }

        try
        {
            const unmaskedPhone = loginInformation.user.replace(/\D/g,'');
            const { data } = await api.post<ApiResponse>('/auth', {
                user: unmaskedPhone,
                password: loginInformation.pwd
            });
            
            await AsyncStorage.setItem('authToken', JSON.stringify(data));

            if(data.isAdmin)
            {
                setIsLoading(false);
                navigation.navigate('Admin');
            }
            else
            {
                setIsLoading(false);
                navigation.navigate('App');
            }
        }
        catch(err)
        {
            setIsLoading(false);
            Alert.alert("error", String(err));
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            <Text style={styles.labels}>Celular</Text>
            <MaskInput
                mask={Masks.BRL_PHONE}
                placeholder="(99) 99999-9999"
                value={loginInformation.user}
                onChangeText={(masked) => handleChangeUserName(masked)}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.inputs}
                keyboardType='phone-pad'
            />
            <Text style={[styles.labels, styles.emailLabel]}>Senha</Text>
            <TextInput
                placeholder="Senha"
                value={loginInformation.pwd}
                onChange={handleChangePwd}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.inputs}
            />
            <TouchableHighlight style={styles.loginButton} onPress={onLogin}>
                <Text style={styles.buttonText}>
                    {isLoading ? <ActivityIndicator size="small" color={colors.primary} /> : 'Entrar'}
                </Text>
            </TouchableHighlight>
        </View>
    );
};

export default SignIn;
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    NativeSyntheticEvent,
    Text,
    TextInput,
    TextInputChangeEventData,
    View
} from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { api } from '../../services/api';
import { colors } from '../../styles';
import { RootStackParamList } from '../../types/RootStackParamList';
import { styles } from './styles';

type Props = NavigationStackScreenProps<RootStackParamList, 'SignIn'>

type ApiResponse = {
    token: string;
    user: {
        first_name: string;
        last_name: string;
        password: string;
        email: string;
        department: string;
        admin: boolean;
    }
};

const SignIn: React.FC<Props> = ({ navigation }) => {

    const [ loginInformation, setLoginInformation ] = useState({ email: '', pwd: '' });
    const [ isLoading, setIsLoading ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState('');

    const handleChangeUserName = (event: NativeSyntheticEvent<TextInputChangeEventData>) =>
    {
        setLoginInformation({
            ...loginInformation,
            email: event.nativeEvent.text
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
        if(loginInformation.email === '' || loginInformation.pwd === '')
        {
            setIsLoading(!isLoading);
            Alert.alert('Preencha todos os campos', 'Por favor, preencha o e-mail e a senha para continuar');
            return;
        }

        try
        {
            const { data } = await api.post<ApiResponse>('/auth', {
                email: loginInformation.email,
                password: loginInformation.pwd
            });
            
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            await AsyncStorage.setItem('authToken', JSON.stringify(data.token));

            if(data.user.admin)
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
        catch(err: any)
        {
            const message = err.response.data.message as string;
            setIsLoading(false);
            setErrorMessage(message);
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            <Text style={styles.labels}>E-mail</Text>
            <TextInput
                placeholder="exemplo@gmail.com"
                value={loginInformation.email}
                onChange={handleChangeUserName}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.inputs}
                keyboardType='email-address'
            />
            <Text style={[styles.labels, styles.emailLabel]}>Senha</Text>
            <TextInput
                placeholder="Senha"
                value={loginInformation.pwd}
                onChange={handleChangePwd}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.inputs}
                textContentType='password'
                secureTextEntry={true}
            />
            { errorMessage !== '' && <Text style={styles.errorMessage}>{errorMessage}</Text> }
            <TouchableHighlight style={styles.loginButton} onPress={onLogin}>
                <Text style={styles.buttonText}>
                    {isLoading ? <ActivityIndicator size="small" color={colors.primary} /> : 'Entrar'}
                </Text>
            </TouchableHighlight>
        </View>
    );
};

export default SignIn;
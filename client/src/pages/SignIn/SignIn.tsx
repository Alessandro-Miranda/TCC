import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
    Text,
    TextInput,
    NativeSyntheticEvent,
    TextInputChangeEventData,
    View,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../RootStackParamList';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { styles } from './styles';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { api } from '../../services/api';

type Props = NavigationStackScreenProps<RootStackParamList, 'SignIn'>

const SignIn: React.FC<Props> = ({ navigation }) => {

    const [ loginInformation, setLoginInformation ] = useState({ user: '', pwd: '' });

    const handleChangeEmail = (event: NativeSyntheticEvent<TextInputChangeEventData>) =>
    {
        setLoginInformation({
            ...loginInformation,
            user: event.nativeEvent.text
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
        if(loginInformation.user === '' || loginInformation.pwd === '')
        {
            Alert.alert('Preencha todos os campos', 'Por favor, preencha o e-mail e a senha para continuar');
            return;
        }

        // Pega todo caracactere alfanumerico [A-Za-z0-9_] e não alfanumerico
        // antes do @ e checa se possui o dominio
        const pattern = /[\w\W]{5}@\D{2}.\D{2}/;
        const regex = new RegExp(pattern, 'i');

        if(!regex.test(loginInformation.user))
        {
            Alert.alert('Padrão de e-mail incorreto. Por favor, preencha corretamente');
            return;
        }

        const { data } = await api.post('/auth', {
            user: loginInformation.user,
            password: loginInformation.pwd
        });

        Alert.alert('dados vindos da api', data);
        AsyncStorage.setItem('authToken', JSON.stringify(data));
    }

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            <Text style={styles.labels}>E-mail</Text>
            <TextInput
                placeholder="E-mail"
                value={loginInformation.user}
                onChange={handleChangeEmail}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.inputs}
            />
            <Text style={[styles.labels, styles.emailLabel]}>Senha</Text>
            <TextInput
                placeholder="E-mail"
                value={loginInformation.pwd}
                onChange={handleChangePwd}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.inputs}
            />
            <TouchableHighlight style={styles.loginButton} onPress={onLogin}>
                <Text style={styles.buttonText}>
                    Entrar
                </Text>
            </TouchableHighlight>
        </View>
    );
};

export default SignIn;
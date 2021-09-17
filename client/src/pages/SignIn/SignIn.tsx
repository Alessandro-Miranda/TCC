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

    const handleChangeUserName = (event: NativeSyntheticEvent<TextInputChangeEventData>) =>
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

        try
        {
            const { data } = await api.post('/auth', {
                user: loginInformation.user,
                password: loginInformation.pwd
            });
            const { auth, token, isAdmin } = data;
            Alert.alert('dados vindos da api', JSON.stringify(data));
            AsyncStorage.setItem('authToken', JSON.stringify(data));
        }
        catch(err)
        {
            Alert.alert("erro", String(err));
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            <Text style={styles.labels}>Celular</Text>
            <TextInput
                placeholder="Celular"
                value={loginInformation.user}
                onChange={handleChangeUserName}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.inputs}
                keyboardType='phone-pad'
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
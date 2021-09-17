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

type Props = NavigationStackScreenProps<RootStackParamList, 'SignIn'>

const SignIn: React.FC<Props> = ({ navigation }) => {

    const [ loginInformation, setLoginInformation ] = useState({ user: '', pwd: '' });
    const [ isLoading, setIsLoading ] = useState(false);

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
        setIsLoading(!isLoading);
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
            
            Alert.alert('dados vindos da api', JSON.stringify(data));
            await AsyncStorage.setItem('authToken', JSON.stringify(data));

            navigation.navigate('App');
        }
        catch(err)
        {
            Alert.alert("erro", String(err));
        }

        setIsLoading(!isLoading);
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
                    {isLoading ? <ActivityIndicator size="small" color={colors.primary} /> : 'Entrar'}
                </Text>
            </TouchableHighlight>
        </View>
    );
};

export default SignIn;
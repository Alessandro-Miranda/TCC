import React, { useEffect, useState } from 'react';
import { View, StatusBar, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { colors } from '../../styles';
import { styles } from './styles';
import { RootStackParamList } from '../RootStackParamList';
import { NavigationStackScreenProps } from 'react-navigation-stack';

type Props = NavigationStackScreenProps<RootStackParamList, 'Auth'>

const AuthLoadingScreen: React.FC<Props> = ({ navigation }) => {
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        bootstrapAsync();
    }, []);

    // Busca o token de autenticação do storage e redireciona para a página devida
    const bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('userToken');
        
        userToken ?? setIsLoading(false);

        navigation.navigate(userToken ? 'App' : 'Auth');
    };

    return (
        <>
            <StatusBar hidden={true} />
            {
                isLoading && (
                    <View style={styles.container}>
                        <ActivityIndicator size="large" color={colors.secundary} />
                        <Text style={styles.loaderText}>Carregando...</Text>
                    </View>
                )
            }
        </>
    );
};

export default AuthLoadingScreen;
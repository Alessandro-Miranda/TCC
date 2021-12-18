import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, Text, View } from 'react-native';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { colors } from '../../styles';
import { RootStackParamList } from '../RootStackParamList';
import { styles } from './styles';


type Props = NavigationStackScreenProps<RootStackParamList, 'Auth'>

const AuthLoadingScreen: React.FC<Props> = ({ navigation }) => {
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        bootstrapAsync();
    }, []);

    // Busca o token de autenticação do storage e redireciona para a página devida
    const bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('authToken');
        
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, Text, View } from 'react-native';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { api } from '../../services/api';
import { colors } from '../../styles';
import { RootStackParamList } from '../RootStackParamList';
import { styles } from './styles';


type Props = NavigationStackScreenProps<RootStackParamList, 'Auth'>

const AuthLoadingScreen: React.FC<Props> = ({ navigation }) => {
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        bootstrapAsync();
    }, []);

    const bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('authToken');
        
        if(!userToken) navigation.navigate('Auth');

        const { data } = await api.get<{ auth: boolean }>('/auth/confirm-authentication', {
            headers: {
                "x-access-token": userToken
            }
        })
        
        data ?? setIsLoading(false);

        navigation.navigate(data.auth ? 'App' : 'Auth');
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
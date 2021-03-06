import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, Text, View } from 'react-native';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { colors } from '../../styles';
import { RootStackParamList } from '../../types/RootStackParamList';
import { getInformationsFromStorage } from '../../utils/getInformationsFromStorage';
import { validateLogin } from '../../utils/validateLogin';
import { styles } from './styles';

type Props = NavigationStackScreenProps<RootStackParamList, 'Auth'>

const AuthLoadingScreen: React.FC<Props> = ({ navigation }) => {
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        bootstrapAsync();
    }, []);

    const bootstrapAsync = async () => {
        const userToken = await getInformationsFromStorage('authToken');
        setIsLoading(false);
        await validateLogin(userToken, navigation, 'App');
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
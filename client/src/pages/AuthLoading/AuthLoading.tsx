import React, { useState } from 'react';
import { View, StatusBar, Text, ActivityIndicator } from 'react-native';
import { colors } from '../../styles';
import { styles } from './styles';

const AuthLoadingScreen: React.FC = () => {

    const [ isLoading, setIsLoading ] = useState(true)

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
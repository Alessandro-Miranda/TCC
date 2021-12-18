import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import {
    Image,
    Text,
    View
} from 'react-native';
import { NavigationParams, NavigationRoute } from "react-navigation";
import { StackNavigationProp } from "react-navigation-stack/lib/typescript/src/vendor/types";
import { styles } from "./styles";

type Props = {
    navigation: StackNavigationProp<NavigationRoute<NavigationParams>, NavigationParams>
}

const HomeHeader: React.FC<Props> = ({ navigation }) => {
    
    const onExit = async () => {
        await AsyncStorage.clear();
        navigation.navigate('Auth');
    }

    return (
        <View style={styles.container}>
            <Text style={styles.HeaderTitle}>Mensages</Text>
            <Image source={require('../../../assets/searchIcon.png')} />
            <Text onPress={onExit}>Sair</Text>
        </View>
    )
}

export default HomeHeader;
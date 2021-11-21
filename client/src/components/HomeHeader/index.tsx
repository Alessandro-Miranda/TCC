import React from "react";
import {
    View,
    Text,
    Image
} from 'react-native';
import { styles } from "./styles";

const HomeHeader: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.HeaderTitle}>Mensages</Text>
            <Image source={require('../../../assets/searchIcon.png')} />
        </View>
    )
}

export default HomeHeader;
import React from "react";
import {
    Image,
    Text,
    View
} from 'react-native';
import { styles } from "./styles";

const ContactsHeader: React.FC = () => (
    <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Contatos</Text>
        <Image
            source={require('../../../assets/searchIcon.png')}
            style={styles.headerIcon}
        />
    </View>
);

export default ContactsHeader;
import { StyleSheet } from 'react-native';
import { colors } from '../../styles';

export const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    wrapper: {
        minHeight: '100%'
    },
    showContactsIcon: {
        position: 'absolute',
        bottom: 50,
        right: 50,
    },
    showContactIconImage: {
        width: 70,
        height: 70,
    },
    noMessage: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
    },
    noMessageText: {
        textAlign: 'center',
        fontSize: 20,
        width: '80%',
        alignSelf: 'center',
        color: colors.secundary,
        letterSpacing: 2
    }
})
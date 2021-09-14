import { StyleSheet } from 'react-native';
import { colors } from '../../styles';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingRight: 25,
        paddingLeft: 25,
        paddingBottom: 100,
        justifyContent: 'flex-end',
        width: '100%'
    },
    loginButton: {
        width: 300,
        marginTop: 70,
        borderRadius: 50,
        backgroundColor: colors.secundary,
        paddingVertical: 20,
        paddingHorizontal: 20
    },
    buttonText: {
        color: colors.primary,
        textTransform: 'uppercase',
        textAlign: 'center',
        fontWeight: 'bold',
        letterSpacing: 1.5,
        fontSize: 16
    },
    inputs: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 50,
        borderColor: colors.secundary,
        fontSize: 16,
        paddingHorizontal: 22,
        paddingVertical: 15,
        color: colors.fontColor
    },
    labels: {
        fontWeight: 'bold',
        marginLeft: 22,
        marginBottom: 5,
        color: colors.fontColor,
        letterSpacing: 1.5,
        fontSize: 16
    },
    emailLabel: {
        marginTop: 20
    }
})
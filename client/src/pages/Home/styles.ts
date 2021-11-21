import { StyleSheet } from 'react-native';
import { colors } from '../../styles';

export const styles = StyleSheet.create({
    messageContainer: {
        paddingBottom: 20,
        paddingTop: 20,
        paddingLeft: 20,
        overflow: 'hidden',
        borderBottomWidth: 1,
        borderBottomColor: colors.secundary
    },
    messageContainerView: {
        flex: 1,
        flexDirection: 'row'
    },
    profileImage: {
        borderRadius: 50
    },
    contactNameAndMessage: {
        paddingLeft: 20
    },
    contactName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.secundary,
        letterSpacing: 2
    },
    messagePreview: {
        fontSize: 16,
        color: colors.fontColor
    }
})
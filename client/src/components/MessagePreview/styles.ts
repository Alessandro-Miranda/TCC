import { StyleSheet } from 'react-native';
import { colors } from '../../styles';

export const styles = StyleSheet.create({
    wrapper: {
        minHeight: '100%'
    },
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
        paddingLeft: 20,
    },
    contactName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.secundary,
        letterSpacing: 2,
        textTransform: 'capitalize'
    },
    messagePreviewContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    messagePreview: {
        fontSize: 16,
        color: colors.fontColor,
        width: '75%'
    },
    messageTime: {
        color: colors.fontColor
    }
})
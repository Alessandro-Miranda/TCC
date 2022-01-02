import { StyleSheet } from "react-native";
import { colors } from "../../styles";

export const styles = StyleSheet.create({
    messageWrapper: {
        maxWidth: '80%',
        minWidth: '24%',
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40
    },
    messageReceived: {
        backgroundColor: colors.fontColor,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        marginRight: 'auto'
    },
    messageSent: {
        backgroundColor: colors.secundary,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        marginLeft: 'auto'
    },
    messageSentWaiting: {
        opacity: .5
    },
    messageText: {
        color: colors.primary,
        fontSize: 18,
        letterSpacing: 2
    },
    messageContainerDetail: {
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderLeftWidth: 0,
        borderTopWidth: 12,
        borderRightWidth: 24,
        borderBottomWidth: 12,
        borderLeftColor: 'transparent',
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        position: 'absolute',
        transform: [{ rotate: '25deg' }]
    },
    messageContainerDetailReceived: {
        left: -15,
        top: -6,
        borderRightColor: colors.fontColor,
    },
    messageContainerDetailSent: {
        right: -10,
        top: -6,
        borderRightColor: colors.secundary,
        transform: [{ rotate: '-205deg' }]
    },
    messageHourAndStatusContainer: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        right: 20,
        bottom: 15,
    },
    messageHour: {
        fontSize: 15,
        color: colors.primary,
        letterSpacing: 2
    },
    messageStateIcon: {
        marginLeft: 5
    }
});
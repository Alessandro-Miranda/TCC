import { StyleSheet } from "react-native";
import { colors } from "../../styles";

export const styles = StyleSheet.create({
    messageWrapper: {
        maxWidth: '80%',
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderRadius: 20
    },
    messageReceived: {
        backgroundColor: colors.fontColor,
        marginRight: 'auto'
    },
    messageSent: {
        backgroundColor: colors.secundary,
        marginLeft: 'auto'
    },
    messageText: {
        color: colors.primary,
        fontSize: 18
    },
    messageContainerDetail: {
        backgroundColor: 'red',
        width: 15,
        height: 15,
        position: 'absolute'
    },
    messageContainerDetailReceived: {
        left: -15,
        transform: [{ rotate: '50deg' }]
    },
    messageContainerDetailSent: {},
});
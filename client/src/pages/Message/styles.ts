import { StyleSheet } from "react-native";
import { colors } from "../../styles";

export const styles = StyleSheet.create({
    messageContainer: {
        paddingHorizontal: 10,
        height: '100%',
    },
    messageWrapper: {
        maxHeight: '89%'
    },
    messageInputContainer: {
        flexDirection: 'row',
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        paddingHorizontal: 20,
        marginBottom: 20,
        width: '100%',
        backgroundColor: colors.primary,
    },
    messageInput: {
        borderStyle: 'solid',
        borderColor: colors.secundary,
        borderWidth: 1,
        borderRadius: 50,
        width: '90%',
        height: 50,
        paddingHorizontal: 20,
        marginRight: 10
    }
});
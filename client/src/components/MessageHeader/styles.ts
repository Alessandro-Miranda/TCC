import { StyleSheet } from "react-native";
import { colors } from "../../styles";

export const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.secundary,
        height: 60,
    },
    headerText: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 22,
        letterSpacing: 2,
        marginLeft: 40
    },
    goBackImage: {
        width: 15,
        height: 15,
        marginLeft: 20
    }
});
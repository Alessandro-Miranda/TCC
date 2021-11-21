import { StyleSheet } from "react-native";
import { colors } from "../../styles";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    HeaderTitle: {
        fontSize: 22,
        color: colors.primary,
        fontWeight: 'bold',
        letterSpacing: 2
    }
})
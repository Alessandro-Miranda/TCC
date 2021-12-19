import { StyleSheet } from "react-native";
import { colors } from "../../styles";

export const styles = StyleSheet.create({
    headerContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.primary
    },
    headerIcon: {
        marginRight: 30
    }
})
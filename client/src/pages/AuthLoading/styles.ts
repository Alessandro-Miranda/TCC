import { StyleSheet } from 'react-native';

import { colors } from '../../styles';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    loaderText: {
        fontSize: 18,
        color: colors.secundary,
        fontWeight: "bold"
    }
});
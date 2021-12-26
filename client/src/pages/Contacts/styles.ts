import { StyleSheet } from 'react-native';
import { colors } from '../../styles';

export const styles = StyleSheet.create({
    touchableArea: {
        borderBottomWidth: 1,
        borderBottomColor: colors.secundary
    },
    contactInfoContainer: {
        marginBottom: 15,
        marginTop: 15,
        marginLeft: 10,
        flex: 1,
        flexDirection: 'row'
    },
    profileImage: {
        borderRadius: 50,
        marginRight: 30
    },
    contactName: {
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 2,
        textTransform: 'uppercase',
        color: colors.secundary
    },
    contactDepartment: {
        color: colors.fontColor
    }
})
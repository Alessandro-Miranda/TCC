import React from "react";
import { Image, Text, View } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import { NavigationParams, NavigationRoute } from "react-navigation";
import { StackNavigationProp } from "react-navigation-stack/lib/typescript/src/vendor/types";
import { Contact } from "../../types/User";
import { styles } from "./styles";

type Props = {
    navigation: StackNavigationProp<NavigationRoute<NavigationParams>, NavigationParams>
};

const MessageHeader: React.FC<Props> = ({ navigation }) => {
    const onGoBackPress = () => {
        navigation.popToTop();
    }

    const renderContactName = () => {
        const { firstName, lastName, department } = navigation.state.params?.contact as Contact;
        const formatedName = cappitalizeOrchangeTextToUppercase(`${firstName} ${lastName}`);
        return `${formatedName} (${cappitalizeOrchangeTextToUppercase(department)})`;
    }

    const cappitalizeOrchangeTextToUppercase = (text: string) => {
        if(text.length <= 5)
        {
            return text.toUpperCase();
        }
        else
        {
            return text
                .split(" ")
                .map(word => word[0].toUpperCase() + word.slice(1))
                .join(" ");
        }
    }

    return (
        <View style={styles.headerContainer}>
            <TouchableHighlight
                onPress={onGoBackPress}
                underlayColor={'unset'}
            >
                <Image
                    style={styles.goBackImage}
                    source={require('../../../assets/arrow_left.png')}
                />
            </TouchableHighlight>
            <Text style={styles.headerText}>
                {renderContactName()}
            </Text>
        </View>
    )
}

export default MessageHeader;
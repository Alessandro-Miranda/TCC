import React, { FC } from 'react';
// import { StyleSheet, Text, View, Button, ScrollView, Image, TextInput } from 'react-native';
import Routes from './src/routes';

const App: FC = () => <Routes />;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         alignItems: 'center',
//         justifyContent: 'center'
//     },
// });

export default App;

/**
 * Exemplo de utilização da scrollView
 * 
 * <ScrollView>
            <Text>Some Text</Text>
            <View>
                <Text>Other text</Text>
                <Image source={{
                    uri: 'https://reactnative.dev/docs/assets/p_cat2.png'
                }}
                style={{ width: 200, height: 200 }} />
            </View>
            <TextInput
                style={{
                    height: 40,
                    borderColor: 'gray',
                    borderWidth: 1
                }}
            />
        </ScrollView>
 */
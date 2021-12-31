import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import ContactsHeader from './components/ContactsHeader';
import HomeHeader from './components/HomeHeader';
import MessageHeader from './components/MessageHeader';
import AdminHome from './pages/AdminHome';
import AuthLoadingScreen from './pages/AuthLoading';
import Contacts from './pages/Contacts';
import Home from './pages/Home';
import Message from './pages/Message';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import { colors } from './styles';


const AppStack = createStackNavigator(
    {
        Home: {
            screen: Home,
            navigationOptions: ({ navigation }) => ({
                headerTitle: () => <HomeHeader navigation={navigation} />
            })
        },
        Perfil: {
            screen: Profile
        },
        Contatos: {
            screen: Contacts,
            navigationOptions: () => ({
                headerTitle: () => <ContactsHeader />
            }) 
        },
        Mensagem: {
            screen: Message,
            navigationOptions: () => ({
                header: ({ navigation }) => (
                    <MessageHeader navigation={navigation} />
                )
            })
        },
    },
    {
        defaultNavigationOptions: {
            headerTitleAlign: 'left',
            headerTintColor: colors.primary,
            headerStyle: {
                backgroundColor: colors.secundary
            }
        }
    }
);

const AdminStack = createStackNavigator(
    {
        AdminHome: AdminHome,
        AdminPerfil: Profile
    },
    {
        defaultNavigationOptions: {
            headerTitleAlign: 'left',
            headerTintColor: colors.primary,
            headerStyle: {
                backgroundColor: colors.secundary
            }
        }
    }
);

const AuthStack = createStackNavigator(
    {
        Login: SignIn
    },
    {
        defaultNavigationOptions: {
            headerShown: false,
            headerTitleAlign: 'left',
            headerTintColor: colors.primary,
            headerStyle: {
                backgroundColor: colors.secundary
            }
        }
    }
)

const Routes = createAppContainer(
    createSwitchNavigator(
        {
            AuthLoading: AuthLoadingScreen,
            App: AppStack,
            Admin: AdminStack,
            Auth: AuthStack
        },
        {
            initialRouteName: 'AuthLoading'
        }
    )
);

export default Routes;
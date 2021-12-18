import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import HomeHeader from './components/HomeHeader';
import AdminHome from './pages/AdminHome';
import AuthLoadingScreen from './pages/AuthLoading';
import Home from './pages/Home';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import { colors } from './styles';


const AppStack = createStackNavigator(
    {
        Mensagens: {
            screen: Home,
            navigationOptions: ({ navigation }) => ({
                headerTitle: () => <HomeHeader navigation={navigation} />
            })
        },
        Perfil: {
            screen: Profile
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
import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Profile from './pages/Profile';
import AuthLoadingScreen from './pages/AuthLoading';
import AdminHome from './pages/AdminHome';
import { colors } from './styles';
import HomeHeader from './components/HomeHeader';

const AppStack = createStackNavigator(
    {
        Mensagens: {
            screen: Home,
            navigationOptions: () => ({
                headerTitle: () => <HomeHeader />
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
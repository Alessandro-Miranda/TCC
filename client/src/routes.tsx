import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import SignIn from './pages/SignIn/SignIn';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import AuthLoadingScreen from './pages/AuthLoading/AuthLoading';

const AppStack = createStackNavigator({ Home, Profile });
const AuthStack = createStackNavigator({ SignIn })

const Routes = createAppContainer(
    createSwitchNavigator(
        {
            AuthLoading: AuthLoadingScreen,
            App: AppStack,
            Auth: AuthStack
        },
        {
            initialRouteName: 'AuthLoading'
        }
    )
)

export default Routes;
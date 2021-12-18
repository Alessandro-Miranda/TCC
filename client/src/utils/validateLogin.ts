import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "react-navigation-stack/lib/typescript/src/vendor/types";
import { api } from "../services/api";

export async function validateLogin(
    token: string | null,
    dispatchFn: StackNavigationProp,
    route?: string,
)
{
    if(!token)
    {
        dispatchFn.navigate('Auth');
        return;
    }

    try
    {
        const { data } = await api.get<{ auth: boolean }>('/auth/confirm-authentication', {
            headers: {
                "x-access-token": token.replace(/"+/g, '')
            }
        });
        
        if(route && data.auth)
        {
            dispatchFn.navigate(route);
        }
        
        if(!data.auth)
        {
            await AsyncStorage.removeItem('authToken');
            dispatchFn.navigate('Auth');
        }
    }
    catch(err)
    {
        console.log(err);
        await AsyncStorage.removeItem('authToken');
        dispatchFn.navigate('Auth');
    }
}

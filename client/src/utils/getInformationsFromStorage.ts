import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getInformationsFromStorage(tokenName: string)
{
    const storageInformations = await AsyncStorage.getItem(tokenName);

    return storageInformations;
}
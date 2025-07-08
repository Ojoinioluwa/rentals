import AsyncStorage from '@react-native-async-storage/async-storage';



const getUserFromStorage = async () => {
    try {
        const data = await AsyncStorage.getItem('user');
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.log("Error getting user from storage", error);
        return null
    }
}

export default getUserFromStorage;
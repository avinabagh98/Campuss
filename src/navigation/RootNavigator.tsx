import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabs from './BottomTabs';
import LoginScreen from '../features/auth/LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { loadTokenFromStorage } from '../features/auth/authSlice';



export default function RootNavigator() {

    const token = useSelector((state: any) => state.auth.token);

    // use a typed dispatch so async thunks (AsyncThunkAction) are accepted
    const dispatch = useDispatch<any>();

    useEffect(() => {
        dispatch(loadTokenFromStorage());
    }, []);


    useEffect(() => {
        (async () => {
            try {
                const keys = await AsyncStorage.getAllKeys();

                keys.forEach(key => {
                    AsyncStorage.getItem(key)
                        .then(value => {
                            console.log('AS:', key, value);
                        })
                        .catch(err => {
                            console.error('Failed to read AsyncStorage key:', key, err);
                        });
                });

            } catch (err: any) {
                // clearer error output for easier debugging
                console.warn('Failed to read AsyncStorage:', err?.message ?? err);
                console.error(err && err.stack ? err.stack : err);
            }
        })();
    }, []);


    return (
        <NavigationContainer>
            {token ? <BottomTabs /> : <LoginScreen />}
        </NavigationContainer>
    );
}
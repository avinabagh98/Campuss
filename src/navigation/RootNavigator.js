import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabs from './BottomTabs';
import LoginScreen from '../features/auth/LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadTokenFromStorage } from '../features/auth/authSlice';

export default function RootNavigator() {

    const token = useSelector(state => state.auth.token);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadTokenFromStorage());
    }, [dispatch]);


    return (
        <NavigationContainer onStateChange={
            async () => {
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

                } catch (err) {
                    console.warn('Failed to read AsyncStorage:', err?.message ?? err);
                    console.error(err && err.stack ? err.stack : err);
                }
            }
        }>
            {token ? <BottomTabs /> : <LoginScreen />}
        </NavigationContainer>
    );
}
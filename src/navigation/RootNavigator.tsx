import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabs from './BottomTabs';
import LoginScreen from '../features/auth/LoginScreen';

export default function RootNavigator() {
    const token = useSelector((state: any) => state.auth.token);

    return (
        <NavigationContainer>
            {token ? <BottomTabs /> : <LoginScreen />}
        </NavigationContainer>
    );
}
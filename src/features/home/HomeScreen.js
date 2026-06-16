import React, { useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../profile/profileSlice';
import { fetchAttendance } from './homeSlice';
import { useCameraPermission } from 'react-native-vision-camera';

import UserView from '../../components/UserView';
import TeacherView from '../../components/TeacherView';

// Role constants
const ROLE_USER = '1';
const ROLE_TEACHER = '2';

export default function HomeScreen() {

    const dispatch = useDispatch();
    const { hasPermission, requestPermission } = useCameraPermission();

    const token = useSelector(state => state.auth.token);
    const role = useSelector(state => state.profile.role);

    // ── Initial data fetch ──
    useEffect(() => {
        if (token) {
            dispatch(fetchProfile(token));
            dispatch(fetchAttendance({
                token,
                date: new Date().toISOString().split('T')[0],
            }));
        }
    }, [token]);

    // ── Camera permission (for student barcode scanning) ──
    useEffect(() => {
        const handlePermission = async () => {
            if (!hasPermission) {
                const granted = await requestPermission();
                if (!granted) {
                    Alert.alert(
                        'Camera Permission Required',
                        'Please enable camera access to scan barcodes.',
                        [{ text: 'OK', onPress: () => Linking.openSettings() }]
                    );
                }
            }
        };
        handlePermission();
    }, [hasPermission]);

    // ── Role-based rendering ──
    const roleStr = String(role);

    if (roleStr === ROLE_TEACHER) {
        return <TeacherView />;
    }

    // Default → student / user view (role 1 or unknown)
    return <UserView />;
}
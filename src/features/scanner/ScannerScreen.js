import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, AppState, Linking } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { useDispatch, useSelector } from 'react-redux';
import { sendAttendance, setScannedData } from './scannerSlice';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';

export default function ScannerScreen() {
    const device = useCameraDevice('back');
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const navigate = useNavigation();

    const { hasPermission, requestPermission } = useCameraPermission();
    const token = useSelector(state => state.auth.token);
    const scanRes = useSelector(state => state.scanner.ScanResponse);
    const error = useSelector(state => state.scanner.error);

    const [isScanning, setIsScanning] = useState(false);
    const [appStateVisible, setAppStateVisible] = useState(AppState.currentState);


    const isActive = isFocused && appStateVisible === 'active' && isScanning;

    useEffect(() => {
        const subscription = AppState.addEventListener('change', setAppStateVisible);
        return () => subscription.remove();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            const handlePermission = async () => {
                if (!hasPermission) {
                    const granted = await requestPermission();
                    if (!granted) {
                        Alert.alert(
                            'Camera Permission Required',
                            'Please enable camera access to scan barcodes.',
                            [{ text: 'OK', onPress: () => Linking.openSettings() }]
                        );
                        return;
                    }
                }

                setIsScanning(true);
            };

            handlePermission();

            return () => {
                setIsScanning(false);
            };
        }, [hasPermission])
    );


    useEffect(() => {
        if (scanRes?.meta?.code === 200) {
            Alert.alert(`${scanRes.meta.message} for ${scanRes.data.Name}`);
        }
    }, [scanRes]);


    useEffect(() => {
        if (error) {
            Alert.alert(
                error.status === 404 ? 'Student Not Found' : 'Attendance Error',
                error.status === 404
                    ? 'No record found for this barcode.'
                    : error.message || 'Something went wrong.'
            );
        }
    }, [error]);

    const codeScanner = useCodeScanner({
        codeTypes: ['ean-13', 'qr', 'code-128', 'code-39', 'code-93', 'upc-a', 'upc-e', 'aztec', 'pdf-417', 'ean-8'],
        onCodeScanned: (codes) => {
            if (!isScanning) return;
            const idCode = codes[0].value;
            dispatch(setScannedData(idCode));
            dispatch(sendAttendance({ id: idCode, token }));
            setIsScanning(false);
            navigate.navigate('Home');
        },
    });

    if (!device) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Camera not available on this device.</Text>
            </View>
        );
    }

    return (
        <Camera
            resizeMode='contain'
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={isActive}
            codeScanner={codeScanner}
            androidPreviewViewType='surface-view'
            onError={(error) => console.error('Camera error:', error)}
        />
    );
}
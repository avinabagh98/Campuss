import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { useDispatch, useSelector } from 'react-redux';
import { setScannedData } from './scannerSlice';
import { useCodeScanner } from 'react-native-vision-camera';
import LottieView from 'lottie-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScannerScreen() {
    const device = useCameraDevice('back')
    const [isScanning, setIsScanning] = useState(false);
    const dispatch = useDispatch();
    const scanned = useSelector((state: any) => state.scanner.lastScanned);

    useEffect(() => {
        Camera.requestCameraPermission();
    }, []);

    const codeScanner = useCodeScanner({
        codeTypes: ['ean-13', 'qr', 'code-128', 'code-39', 'code-93', 'upc-a', 'upc-e', 'aztec', 'pdf-417', 'ean-8'],
        onCodeScanned: codes => {
            console.log("Scanned codes", codes);

            if (codes.length > 0) {
                dispatch(setScannedData(codes[0].value));
                setIsScanning(false); // stop scanning when a code is captured
            }
        },
    });

    if (!device) return <Text>Loading Camera...</Text>;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffffff' }}>

            {isScanning ? (
                <Camera
                    style={{ flex: 1 }}
                    device={device}
                    isActive={true}
                    codeScanner={isScanning ? codeScanner : undefined}
                />
            ) : (
                <View style={styles.previewContainer}>
                    <Text >Scan a barcode</Text>
                    <View style={styles.qrFrame}>
                        <LottieView
                            source={require('../scanner/Barcode Scanner.json')}
                            autoPlay
                            loop
                            style={styles.lottie}
                        />
                    </View>
                    {/* <Text style={styles.label}>Scanned Barcode</Text> */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.scanButton, isScanning ? styles.stopButton : styles.startButton]}
                            onPress={() => setIsScanning(prev => !prev)}
                        >
                            <Text style={styles.buttonText}>{isScanning ? 'Stop Scan' : 'Start Scan'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}


            {scanned && (
                <View style={{ padding: 20, backgroundColor: 'white' }}>
                    <Text>Scanned: {scanned}</Text>
                </View>
            )}

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    previewContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3cc79ff'
    },
    qrFrame: {
        width: 260,
        height: 260,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#f2c7d9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    lottie: {
        width: 220,
        height: 220
    },
    label: {
        color: '#ff2e6d',
        fontWeight: '600'
    },
    buttonContainer: {
        padding: 16,
        alignItems: 'center'
    },
    scanButton: {
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 30
    },
    startButton: {
        backgroundColor: '#ff2e6d'
    },
    stopButton: {
        backgroundColor: '#463636ff'
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600'
    }
});
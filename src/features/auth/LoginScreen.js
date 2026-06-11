import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, StyleSheet, Image, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from './authSlice';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import { Colours } from '../../theme/Colours';

export default function LoginScreen() {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth || {});

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        dispatch(loginUser({ username: username.trim(), password }));
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    <View style={styles.brand}>

                        <Image
                            source={require('../../../assets/enter_pass.png')}
                            style={{ width: 200, height: 140, resizeMode: 'contain', marginBottom: 12 }}
                        />

                        <Text style={styles.title}>Campuss</Text>
                        <Text style={styles.subtitle}>Welcome back — please login to continue</Text>

                    </View>

                    <Card style={styles.card}>

                        <Input
                            placeholder="Username"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            autoCorrect={false}
                            returnKeyType="next"
                        />

                        <View style={styles.spacer} />

                        <Input
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            returnKeyType="done"
                        />

                        {error ? <Text style={styles.error}>{error}</Text> : null}

                        <View style={styles.buttonWrap}>
                            <Button
                                title={loading ? 'Logging in...' : 'Login'}
                                onPress={handleLogin}
                                disabled={loading || !username || !password}
                            />
                        </View>

                    </Card>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Don't have an account? <Text style={styles.link}>Sign up</Text>
                        </Text>
                    </View>

                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f6f7fb' },

    scrollContainer: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center'
    },

    brand: {
        alignItems: 'center',
        marginBottom: 24
    },

    title: {
        fontSize: 28,
        fontWeight: '700',
        color: Colours.brand.primary
    },

    subtitle: {
        fontSize: 14,
        color: Colours.text.muted,
        marginTop: 6,
        textAlign: 'center'
    },

    card: {
        padding: 18
    },

    spacer: {
        height: 12
    },

    buttonWrap: {
        marginTop: 18
    },

    error: {
        color: '#d9534f',
        marginTop: 10,
        textAlign: 'center'
    },

    footer: {
        marginTop: 18,
        alignItems: 'center'
    },

    footerText: {
        color: Colours.text.muted
    },

    link: {
        color: Colours.brand.primary,
        fontWeight: '600'
    }
});
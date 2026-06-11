import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Card from '../../components/Card';
import { Colours } from '../../theme/Colours';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    faEnvelope,
    faMapMarkerAlt,
    faChevronRight,
    faSignOutAlt,
    faUser,
    faBell,
    faCog,
    faIdBadge
} from '@fortawesome/free-solid-svg-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../auth/authSlice';



const ProfileScreen = () => {
    const dispatch = useDispatch();
    const profile = useSelector(state => state.profile);
    console.log("==================>>>>", profile);



    const details = [
        { key: 'fullname', label: 'Full Name', value: profile.name, bg: '#EEF2FF', icon: faUser, iconColor: '#3B82F6' },
        { key: 'email', label: 'Email', value: profile.email, bg: '#FDF2F8', icon: faEnvelope, iconColor: '#EC4899' },
        { key: 'role', label: 'Role', value: profile.role == '1' ? 'User' : 'Role', bg: '#DCFCE7', icon: faMapMarkerAlt, iconColor: '#22C55E' },
        { key: 'employee', label: 'Employee ID', value: profile.employeeId, bg: '#FEF3C7', icon: faIdBadge, iconColor: '#F59E0B', mono: true },
    ];

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.phone}>

                {/* <View style={styles.appBar}></View> */}

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Avatar Section */}
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarRing}>
                            <View style={styles.avatarInner}>
                                <FontAwesomeIcon icon={faUser} size={40} color={Colours.brand.primary} />
                            </View>
                        </View>

                        <Text style={styles.avatarName}> {profile.name || "John Doe"}</Text>
                        <Text style={styles.avatarEmail}>{profile.email || "john.doe@example.com"}</Text>

                        <View style={styles.rolePill}>
                            <Text style={styles.rolePillText}>{profile.role == 1 ? 'User' : "Role"}</Text>
                        </View>
                    </View>

                    {/* Info Card */}
                    <Card style={styles.infoCard}>
                        <View style={styles.infoCardHeader}>
                            <Text style={styles.infoCardHeaderText}>Account Info</Text>
                        </View>

                        {details.map(d => (
                            <View key={d.key} style={styles.infoRow}>
                                <View style={[styles.infoIcon, { backgroundColor: d.bg }]}>
                                    <FontAwesomeIcon icon={d.icon} size={18} color={d.iconColor} />
                                </View>

                                <View style={styles.infoText}>
                                    <Text style={styles.infoLabel}>{d.label}</Text>
                                    <Text style={[styles.infoValue, d.mono && styles.mono]}>
                                        {d.value}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </Card>

                    {/* Settings */}
                    {/* <Card style={styles.settingsCard}>
                    <View style={styles.infoCardHeader}>
                        <Text style={styles.infoCardHeaderText}>Preferences</Text>
                    </View>

                    {settings.map(s => (
                        <TouchableOpacity key={s.key} style={styles.settingsRow} activeOpacity={0.8}>

                            <View style={[styles.settingsIcon, { backgroundColor: s.bg }]}>
                                <FontAwesomeIcon icon={s.icon} size={18} color={s.iconColor} />
                            </View>

                            <Text style={styles.settingsLabel}>{s.label}</Text>

                            <View style={styles.chevron}>
                                <FontAwesomeIcon icon={faChevronRight} size={16} color="#D1D5DB" />
                            </View>

                        </TouchableOpacity>
                    ))}
                </Card> */}

                    {/* Logout */}
                    <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.9} onPress={() => {
                        dispatch(logout());
                    }}>
                        <FontAwesomeIcon icon={faSignOutAlt} size={18} color="#fff" />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>

                    <View style={{ height: 32 }} />

                </ScrollView>

            </View>
        </SafeAreaView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({

    phone: { flex: 1, backgroundColor: '#f2f2f2' },

    appBar: {
        height: 56,
        backgroundColor: '#1E3A8A',
        justifyContent: 'flex-end',
        paddingBottom: 10,
        paddingHorizontal: 20
    },

    scrollContent: { paddingBottom: 20 },

    avatarSection: {
        alignItems: 'center',
        paddingBottom: 10,
        paddingTop: 10,
        backgroundColor: Colours.brand.primary
    },

    avatarRing: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: '#fff',
        padding: 3,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
        marginTop: 10
    },

    avatarInner: {
        flex: 1,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },

    avatarName: {
        fontSize: 20,
        fontWeight: '800',
        color: Colours.text.white,
        marginTop: 12
    },

    avatarEmail: {
        fontSize: 13,
        color: Colours.text.white,
        marginTop: 2,
        fontFamily: 'monospace'
    },

    rolePill: {
        marginTop: 8,
        backgroundColor: '#EEF2FF',
        borderColor: '#C7D2FE',
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: 4,
        paddingHorizontal: 14
    },

    rolePillText: {
        color: '#3730A3',
        fontWeight: '700',
        fontSize: 12,
        textTransform: 'uppercase'
    },

    infoCard: {
        marginTop: 20,
        marginHorizontal: 16,
        borderRadius: 20
    },

    infoCardHeader: {
        paddingHorizontal: 18,
        paddingTop: 14,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6'
    },

    infoCardHeaderText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#9CA3AF',
        textTransform: 'uppercase'
    },

    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#F9FAFB'
    },

    infoIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },

    infoText: {
        flex: 1,
        marginLeft: 12
    },

    infoLabel: {
        fontSize: 11,
        color: '#9CA3AF',
        fontWeight: '600',
        textTransform: 'uppercase'
    },

    infoValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827'
    },

    mono: {
        fontFamily: 'monospace',
        fontSize: 13
    },

    settingsCard: {
        marginTop: 14,
        marginHorizontal: 16,
        borderRadius: 20
    },

    settingsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#F9FAFB'
    },

    settingsIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },

    settingsLabel: {
        flex: 1,
        fontSize: 14,
        fontWeight: '700',
        color: '#111827'
    },

    chevron: {
        width: 24,
        alignItems: 'flex-end'
    },

    logoutBtn: {
        marginTop: 20,
        marginHorizontal: 16,
        backgroundColor: '#EF4444',
        borderRadius: 16,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        elevation: 8
    },

    logoutText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 15,
        marginLeft: 8
    }
});
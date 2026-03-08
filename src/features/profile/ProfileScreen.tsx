import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Card from '../../components/Card';
import { Colours } from '../../theme/Colours';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope, faPhone, faMapMarkerAlt, faChevronRight, faSignOutAlt, faUser, faBell, faCog, faIdBadge } from '@fortawesome/free-solid-svg-icons';

const ProfileScreen = () => {
    const details = [
        { key: 'fullname', label: 'Full Name', value: 'John Doe', bg: '#EEF2FF', icon: faUser, iconColor: '#3B82F6' },
        { key: 'email', label: 'Email', value: 'john.doe@example.com', bg: '#FDF2F8', icon: faEnvelope, iconColor: '#EC4899' },
        { key: 'role', label: 'Role', value: 'Superuser', bg: '#DCFCE7', icon: faMapMarkerAlt, iconColor: '#22C55E' },
        { key: 'employee', label: 'Employee ID', value: 'EMP-00142', bg: '#FEF3C7', icon: faIdBadge, iconColor: '#F59E0B', mono: true },
    ];

    const settings = [
        { key: 'notifications', label: 'Notifications', icon: faBell, bg: '#EEF2FF', iconColor: '#3B82F6' },
        { key: 'settings', label: 'Settings', icon: faCog, bg: '#F3F4F6', iconColor: '#6B7280' },
    ];

    return (
        <View style={styles.phone}>
            {/* Status bar + App bar area */}
            {/* <View style={styles.statusBar}>
                <Text style={styles.statusTime}>9:41</Text>
                <View style={styles.statusIcons} />
            </View> */}
            <View style={styles.appBar}></View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Avatar section */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarRing}>
                        <View style={styles.avatarInner}>
                            {/* <Text style={styles.avatarInitials}>JD</Text> */}
                            <FontAwesomeIcon icon={faUser as unknown as IconProp} size={40} color={Colours.brand.primary} />
                        </View>
                    </View>
                    <Text style={styles.avatarName}>John Doe</Text>
                    <Text style={styles.avatarEmail}>john.doe@example.com</Text>
                    <View style={styles.rolePill}><Text style={styles.rolePillText}>Superuser</Text></View>
                </View>

                {/* Info Card */}
                <Card style={styles.infoCard}>
                    <View style={styles.infoCardHeader}><Text style={styles.infoCardHeaderText}>Account Info</Text></View>

                    {details.map(d => (
                        <View key={d.key} style={styles.infoRow}>
                            <View style={[styles.infoIcon, { backgroundColor: d.bg }]}>
                                <FontAwesomeIcon icon={d.icon as unknown as IconProp} size={18} color={d.iconColor} />
                            </View>
                            <View style={styles.infoText}>
                                <Text style={styles.infoLabel}>{d.label}</Text>
                                <Text style={[styles.infoValue, d.mono && styles.mono]}>{d.value}</Text>
                            </View>
                        </View>
                    ))}
                </Card>

                {/* Settings Card */}
                <Card style={styles.settingsCard}>
                    <View style={styles.infoCardHeader}><Text style={styles.infoCardHeaderText}>Preferences</Text></View>

                    {settings.map(s => (
                        <TouchableOpacity key={s.key} style={styles.settingsRow} activeOpacity={0.8}>
                            <View style={[styles.settingsIcon, { backgroundColor: s.bg }]}>
                                <FontAwesomeIcon icon={s.icon as unknown as IconProp} size={18} color={s.iconColor} />
                            </View>
                            <Text style={styles.settingsLabel}>{s.label}</Text>
                            <View style={styles.chevron}><FontAwesomeIcon icon={faChevronRight as unknown as IconProp} size={16} color="#D1D5DB" /></View>
                        </TouchableOpacity>
                    ))}
                </Card>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.9}>
                    <FontAwesomeIcon icon={faSignOutAlt as unknown as IconProp} size={18} color="#fff" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                <View style={{ height: 32 }} />
            </ScrollView>

            {/* Bottom Tab simulation (static) */}
            <View style={styles.tabBar}>
                <View style={[styles.tabItem, { justifyContent: 'flex-end', paddingBottom: 6 }]}>
                    <View style={{ alignItems: 'center' }}>
                        <View style={styles.tabHomeBubble}><FontAwesomeIcon icon={faUser as unknown as IconProp} size={20} color="#9CA3AF" /></View>
                    </View>
                </View>
                <View style={styles.tabItem}>
                    <View style={styles.tabIconWrap}><FontAwesomeIcon icon={faIdBadge as unknown as IconProp} size={20} color="#9CA3AF" /></View>
                    <Text style={styles.tabLabel}>Scan</Text>
                </View>
                <View style={styles.tabItem}>
                    <View style={styles.tabIconWrapActive}><FontAwesomeIcon icon={faUser as unknown as IconProp} size={22} color="#F43F8A" /></View>
                    <Text style={[styles.tabLabel, styles.tabLabelActive]}>Profile</Text>
                    <View style={styles.tabActiveDot} />
                </View>
            </View>

        </View>
    );
}

export default ProfileScreen;

const styles = StyleSheet.create({
    phone: { flex: 1, backgroundColor: '#f2f2f2' },
    statusBar: { height: 44, backgroundColor: '#1E3A8A', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24 },
    statusTime: { color: '#fff', fontWeight: '700', fontSize: 15 },
    statusIcons: { flexDirection: 'row' },
    appBar: { height: 56, backgroundColor: '#1E3A8A', justifyContent: 'flex-end', paddingBottom: 10, paddingHorizontal: 20 },
    appBarTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },

    scrollContent: { paddingBottom: 20 },

    avatarSection: { backgroundColor: 'transparent', alignItems: 'center', paddingBottom: 10, paddingTop: 10 },
    avatarRing: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#fff', padding: 3, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 6, marginTop: 10 },
    avatarInner: { flex: 1, backgroundColor: 'linear-gradient(135deg,#F43F8A,#EC4899)', borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
    avatarInitials: { color: '#fff', fontSize: 28, fontWeight: '800' },
    avatarName: { fontSize: 20, fontWeight: '800', color: '#111827', marginTop: 12 },
    avatarEmail: { fontSize: 13, color: '#6B7280', marginTop: 2, fontFamily: 'monospace' },
    rolePill: { marginTop: 8, backgroundColor: '#EEF2FF', borderColor: '#C7D2FE', borderWidth: 1, borderRadius: 20, paddingVertical: 4, paddingHorizontal: 14 },
    rolePillText: { color: '#3730A3', fontWeight: '700', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.3 },

    infoCard: { marginTop: 20, marginHorizontal: 16, borderRadius: 20 },
    infoCardHeader: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    infoCardHeaderText: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8 },

    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 15, paddingHorizontal: 18, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
    infoIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    infoText: { flex: 1, marginLeft: 12 },
    infoLabel: { fontSize: 11, color: '#9CA3AF', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 2 },
    infoValue: { fontSize: 14, fontWeight: '700', color: '#111827' },
    mono: { fontFamily: 'monospace', fontSize: 13 },

    settingsCard: { marginTop: 14, marginHorizontal: 16, borderRadius: 20 },
    settingsRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 15, paddingHorizontal: 18, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
    settingsIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    settingsLabel: { flex: 1, fontSize: 14, fontWeight: '700', color: '#111827' },
    chevron: { width: 24, alignItems: 'flex-end' },

    logoutBtn: { marginTop: 20, marginHorizontal: 16, backgroundColor: '#EF4444', borderRadius: 16, height: 52, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10, elevation: 8 },
    logoutText: { color: '#fff', fontWeight: '800', fontSize: 15, marginLeft: 8 },

    tabBar: { height: 80, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F3F4F6', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 },
    tabItem: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    tabHomeBubble: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginTop: -28 },
    tabIconWrap: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
    tabIconWrapActive: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
    tabLabel: { fontSize: 11, fontWeight: '600', color: '#9CA3AF' },
    tabLabelActive: { color: '#F43F8A' },
    tabActiveDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#F43F8A', marginTop: 2 }
});
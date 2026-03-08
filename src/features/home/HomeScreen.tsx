import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Colours } from '../../theme/Colours';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCircleCheck, faCircleXmark, faPersonRifle, faS, faSquareArrowUpRight, faSquareUpRight, faSync, faUser } from '@fortawesome/free-solid-svg-icons';

const stats = [
    { key: 'total', label: 'TOTAL', value: 248, icon: faUser, color: Colours.brand.primary },
    { key: 'in', label: 'IN', value: 192, icon: faCircleCheck, color: Colours.status.success },
    { key: 'out', label: 'OUT', value: 38, icon: faSquareArrowUpRight, color: Colours.status.warning },
    { key: 'absent', label: 'ABSENT', value: 18, icon: faCircleXmark, color: Colours.status.error },
];

const attendance = [
    { id: 1, name: 'John Doe', code: 'ST123', course: 'Computer Science', status: 'Present-IN', time: '09:00 AM' },
    { id: 2, name: 'Jane Smith', code: 'ST124', course: 'Business Admin', status: 'Present-OUT', time: '12:30 PM' },
    { id: 3, name: 'Marcus Chen', code: 'ST125', course: 'Electrical Eng.', status: 'Present-IN', time: '08:47 AM' },
    { id: 4, name: 'Aisha Okafor', code: 'ST126', course: 'Biochemistry', status: 'Absent', time: '--' },
];

export default function HomeScreen() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.heading}>Good Morning,</Text>

            <Card style={styles.headerCard}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.greeting}>Guard</Text>
                        <View style={styles.rolePill}><Text style={styles.roleText}>GUARD</Text></View>
                    </View>

                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Logged in</Text>
                    </View>
                </View>

                <Text style={styles.dateText}>MON, 08 MAR 2026</Text>
            </Card>

            <View style={styles.statsRow}>
                {stats.map(s => (
                    <Card key={s.key} style={styles.statCard}>
                        <FontAwesomeIcon icon={s.icon as unknown as IconProp} size={24} color={s.color} />
                        <Text style={styles.statLabel}>{s.label}</Text>
                        <Text style={styles.statValue}>{s.value}</Text>
                    </Card>
                ))}
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Today's Attendance</Text>
                <Text style={styles.seeAll}>See all</Text>
            </View>

            <View style={{ paddingBottom: 120 }}>
                {attendance.map(item => (
                    <Card key={item.id} style={styles.attCard}>
                        <TouchableOpacity onPress={() => { /* Navigate to details */ }} activeOpacity={0.5}>
                            <View style={styles.attRow}>
                                <View style={styles.avatar}><Text style={styles.avatarText}>{item.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</Text></View>
                                <View style={styles.attInfo}>
                                    <Text style={styles.attName}>{item.name}</Text>
                                    <Text style={styles.attMeta}>{item.code} · {item.course}</Text>
                                </View>
                                <View style={styles.attRight}>
                                    <View style={[styles.statusPill, item.status.includes('IN') ? styles.statusIn : item.status.includes('OUT') ? styles.statusOut : styles.statusAbsent]}>
                                        <Text style={styles.statusText}>{item.status}</Text>
                                    </View>
                                    <Text style={styles.attTime}>{item.time}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Card>
                ))}
            </View>

            <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
                <FontAwesomeIcon icon={faSync as unknown as IconProp} color={Colours.text.white} />
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16, backgroundColor: '#f6f7fb' },
    heading: { fontSize: 18, color: Colours.text.primary, fontWeight: '600', marginBottom: 8 },
    headerCard: { padding: 18, borderRadius: 16, backgroundColor: Colours.brand.primary },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    greeting: { color: '#fff', fontSize: 26, fontWeight: '700' },
    rolePill: { marginTop: 8, backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    roleText: { color: '#ffdca8', fontWeight: '700', fontSize: 12 },
    badge: { backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
    badgeText: { color: '#fff', fontSize: 12 },
    dateText: { color: 'rgba(255,255,255,0.9)', marginTop: 12, textAlign: 'right' },

    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
    statCard: { flex: 1, marginRight: 12, padding: 16, borderRadius: 12 },
    statLabel: { color: Colours.text.muted, fontSize: 12 },
    statValue: { color: Colours.text.primary, fontSize: 22, fontWeight: '700', marginTop: 6 },

    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, marginBottom: 8 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: Colours.text.primary },
    seeAll: { color: Colours.brand.primary, fontWeight: '600' },

    attCard: { marginBottom: 12, padding: 12, borderRadius: 12 },
    attRow: { flexDirection: 'row', alignItems: 'center' },
    avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colours.brand.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    avatarText: { color: '#fff', fontWeight: '700' },
    attInfo: { flex: 1 },
    attName: { fontWeight: '700', color: Colours.text.primary },
    attMeta: { color: Colours.text.muted, marginTop: 4 },
    attRight: { alignItems: 'flex-end' },
    statusPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginBottom: 6 },
    statusText: { fontSize: 11, fontWeight: '700' },
    statusIn: { backgroundColor: '#dff6ea' },
    statusOut: { backgroundColor: '#fff4db' },
    statusAbsent: { backgroundColor: '#ffe8e8' },
    attTime: { color: Colours.text.muted },

    fab: { position: 'absolute', right: 22, bottom: 26, width: 56, height: 56, borderRadius: 28, backgroundColor: Colours.brand.accent, alignItems: 'center', justifyContent: 'center', elevation: 8 },
    // fabIcon: { color: '#fff', fontSize: 20 }
});
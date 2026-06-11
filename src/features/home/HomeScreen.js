
import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Alert,
    Linking
} from 'react-native';
import Card from '../../components/Card';
import { Colours } from '../../theme/Colours';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    faCircleCheck,
    faCircleXmark,
    faFilter,
    faSquareArrowUpRight,
    faSync,
    faUser
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../profile/profileSlice';
import { fetchAttendance } from './homeSlice';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import DatePicker from "react-native-date-picker";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCameraPermission } from 'react-native-vision-camera';








// ----------------------------------------------- UI --------------------------------------
export default function HomeScreen() {

    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [text, setText] = useState(null);

    const dispatch = useDispatch();
    const tabBarHeight = useBottomTabBarHeight();
    const { hasPermission, requestPermission } = useCameraPermission();

    const token = useSelector(state => state.auth.token);
    const loggedUser = useSelector(state => state.profile);
    const attendanceData = useSelector(state => state.home.data);

    const stats = [
        { key: 'total', label: 'TOTAL', value: attendanceData?.length || 248, icon: faUser, color: Colours.brand.primary },
        { key: 'in', label: 'IN', value: attendanceData?.filter(item => item.inTime && item.outTime == null).length || 0, icon: faCircleCheck, color: Colours.status.success },
        { key: 'out', label: 'OUT', value: attendanceData?.filter(item => item.outTime).length || 0, icon: faSquareArrowUpRight, color: Colours.status.warning },
        { key: 'absent', label: 'ABSENT', value: attendanceData?.filter(item => !item.inTime && !item.outTime).length || 0, icon: faCircleXmark, color: Colours.status.error },
    ];

    useEffect(() => {
        if (token) {
            const today = new Date().toISOString().split('T')[0];
            dispatch(fetchProfile(token));
            dispatch(fetchAttendance({
                token,
                date: '2026-03-08'
            }));
        }
    }, [token]);

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
                    return;
                }
            }
        };

        handlePermission();
    }, [hasPermission])





    function sync() {

        const today = new Date().toISOString().split('T')[0];
        dispatch(fetchAttendance({
            token,
            date: today
        }));
        setText(null);
    }

    const formatDate = (d) => {

        const weekday = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
        const day = String(d.getDate()).padStart(2, '0');

        const months = [
            'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
            'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
        ];

        const month = months[d.getMonth()];
        const year = d.getFullYear();

        return `${weekday}, ${day} ${month} ${year}`;
    };

    const todayStr = useMemo(() => formatDate(new Date()), []);

    const renderItem = ({ item }) => {

        const initials = item.Name
            ? item.Name.split(' ').map(n => n[0]).slice(0, 2).join('')
            : '--';

        return (
            <Card style={styles.attCard}>

                <TouchableOpacity activeOpacity={0.6}>

                    <View style={styles.attRow}>

                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{initials}</Text>
                        </View>

                        <View style={styles.attInfo}>
                            <Text style={styles.attName}>{item.Name}</Text>
                            <Text style={styles.attMeta}>
                                {item.Course}
                            </Text>
                        </View>

                        <View style={styles.attRight}>

                            <View
                                style={[
                                    styles.statusPill,
                                    item.inTime && !item.outTime
                                        ? styles.statusIn
                                        : item.inTime && item.outTime
                                            ? styles.statusOut
                                            : styles.statusAbsent
                                ]}
                            >
                                <Text style={styles.statusText}>
                                    {
                                        item.inTime && !item.outTime
                                            ? 'Present-IN'
                                            : item.inTime && item.outTime
                                                ? 'Present-OUT'
                                                : 'ABSENT'
                                    }
                                </Text>
                            </View>

                            <Text style={styles.attTime}>{
                                item.inTime
                                    ? new Date(item.inTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                    : '---'
                            }</Text>

                        </View>

                    </View>

                </TouchableOpacity>

            </Card>
        );
    };

    const ListHeader = () => (
        <>
            <Text style={styles.heading}>
                ABC College
            </Text>

            <Card style={styles.headerCard}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.greeting}>
                            {loggedUser.name
                                ? `Greetings, ${(loggedUser.name).split(" ")[0]}`
                                : "Greetings, User"}
                        </Text>

                        <View style={styles.rolePill}>
                            <Text style={styles.roleText}>User </Text>
                        </View>

                    </View>

                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Logged in</Text>
                    </View>

                </View>

                <Text style={styles.dateText}>{todayStr}</Text>

            </Card>

            <View style={styles.statsRow}>

                {stats.map(s => (

                    <Card key={s.key} style={styles.statCard}>

                        <FontAwesomeIcon
                            icon={s.icon}
                            size={24}
                            color={s.color}
                        />

                        <Text style={styles.statLabel}>
                            {s.label}
                        </Text>

                        <Text style={styles.statValue}>
                            {s.value}
                        </Text>

                    </Card>

                ))}

            </View>

            <View style={styles.sectionHeader}>

                <Text style={styles.sectionTitle}>
                    {text || "Today's Attendance"}
                </Text>

                <TouchableOpacity
                    style={styles.seeAll}
                    onPress={() => setOpen(true)}
                >
                    <FontAwesomeIcon
                        icon={faFilter}
                        color={Colours.brand.primaryLight}
                    />
                    <Text style={{ color: Colours.brand.primary, marginLeft: 6 }}>
                        Filter
                    </Text>
                </TouchableOpacity>

            </View>

        </>
    );

    return (


        <SafeAreaView style={{ flex: 1, backgroundColor: '#f6f7fb' }}>

            <FlatList
                data={attendanceData}
                keyExtractor={(item, index) => String(item.id || index)}
                renderItem={renderItem}
                ListHeaderComponent={ListHeader}
                contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
                showsVerticalScrollIndicator={false}
            />

            <DatePicker
                modal
                open={open}
                date={date}
                mode="date"
                onConfirm={(selectedDate) => {

                    setOpen(false);
                    setDate(selectedDate);

                    const formatted = selectedDate
                        .toISOString()
                        .split("T")[0];

                    dispatch(fetchAttendance({
                        token,
                        date: formatted
                    }));
                    setText(`Attendance for ${formatted}`);

                }}
                onCancel={() => {
                    setOpen(false);
                }}
            />

            <TouchableOpacity
                style={[styles.fab, { bottom: tabBarHeight + 20 }]}
                activeOpacity={0.8}
                onPress={sync}
            >
                <FontAwesomeIcon
                    icon={faSync}
                    color={Colours.text.white}
                />
            </TouchableOpacity>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    heading: {
        fontSize: 18,
        color: Colours.text.primary,
        fontWeight: '600',
        marginBottom: 8
    },

    headerCard: {
        padding: 18,
        borderRadius: 16,
        backgroundColor: Colours.brand.primary
    },

    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    greeting: {
        color: '#fff',
        fontSize: 26,
        fontWeight: '700'
    },

    rolePill: {
        marginTop: 8,
        backgroundColor: 'rgba(255,255,255,0.12)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8
    },

    roleText: {
        color: '#ffdca8',
        fontWeight: '700',
        fontSize: 12
    },

    badge: {
        backgroundColor: 'rgba(255,255,255,0.12)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20
    },

    badgeText: {
        color: '#fff',
        fontSize: 12
    },

    dateText: {
        color: 'rgba(255,255,255,0.9)',
        marginTop: 12,
        textAlign: 'right'
    },

    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16
    },

    statCard: {
        flex: 1,
        marginRight: 12,
        padding: 16,
        borderRadius: 12
    },

    statLabel: {
        color: Colours.text.muted,
        fontSize: 12
    },

    statValue: {
        color: Colours.text.primary,
        fontSize: 22,
        fontWeight: '700',
        marginTop: 6
    },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 18,
        marginBottom: 8
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colours.text.primary
    },

    seeAll: {
        color: Colours.brand.primary,
        fontWeight: '600',
        flexDirection: 'row',


    },

    attCard: {
        marginBottom: 12,
        padding: 12,
        borderRadius: 12
    },

    attRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colours.brand.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12
    },

    avatarText: {
        color: '#fff',
        fontWeight: '700'
    },

    attInfo: {
        flex: 1
    },

    attName: {
        fontWeight: '700',
        color: Colours.text.primary
    },

    attMeta: {
        color: Colours.text.muted,
        marginTop: 4
    },

    attRight: {
        alignItems: 'flex-end'
    },

    statusPill: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 6
    },

    statusText: {
        fontSize: 11,
        fontWeight: '700'
    },

    statusIn: {
        backgroundColor: '#dff6ea'
    },

    statusOut: {
        backgroundColor: '#fff4db'
    },

    statusAbsent: {
        backgroundColor: '#ffe8e8'
    },

    attTime: {
        color: Colours.text.muted
    },

    fab: {
        position: 'absolute',
        right: 22,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colours.brand.accent,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8
    }

});
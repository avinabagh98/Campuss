import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Alert,
    Platform,
    PermissionsAndroid,
} from 'react-native';
import Card from './Card';
import { Colours } from '../theme/Colours';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    faCircleCheck,
    faCircleXmark,
    faSquareArrowUpRight,
    faUser,
    faFilter,
    faSync,
    faFileExcel,
    faChartBar,
    faCalendarDays,
    faGraduationCap,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendance } from '../features/home/homeSlice';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import DatePicker from 'react-native-date-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

// ─── helpers ──────────────────────────────────────────────────────────────────

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function formatDate(d) {
    const weekday = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const day = String(d.getDate()).padStart(2, '0');
    const month = MONTHS[d.getMonth()];
    const year = d.getFullYear();
    return `${weekday}, ${day} ${month} ${year}`;
}

function toISODate(d) {
    return d.toISOString().split('T')[0];
}

function fmtTime(iso) {
    if (!iso) return '---';
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function escapeCSV(val) {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

// ─── Excel / CSV builder ──────────────────────────────────────────────────────

async function requestStoragePermission() {
    if (Platform.OS !== 'android') return true;
    if (Platform.Version >= 33) return true; // Android 13+ scoped storage
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: 'Storage Permission',
                message: 'App needs storage permission to save reports.',
                buttonPositive: 'Allow',
            }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
        return false;
    }
}

async function downloadCSV(data, dateLabel) {
    if (!data || data.length === 0) {
        Alert.alert('No Data', 'There is no attendance data to export.');
        return;
    }

    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
        Alert.alert('Permission Denied', 'Storage permission is required to download the report.');
        return;
    }

    // Build CSV rows
    const headers = ['Name', 'Course', 'Status', 'In Time', 'Out Time'];
    const rows = data.map(item => {
        const status = item.inTime && !item.outTime
            ? 'Present-IN'
            : item.inTime && item.outTime
                ? 'Present-OUT'
                : 'Absent';
        return [
            escapeCSV(item.Name),
            escapeCSV(item.Course),
            escapeCSV(status),
            escapeCSV(fmtTime(item.inTime)),
            escapeCSV(fmtTime(item.outTime)),
        ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const fileName = `Attendance_${dateLabel}.csv`;
    const filePath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

    try {
        await RNFS.writeFile(filePath, csv, 'utf8');
        Alert.alert(
            'Report Downloaded',
            `Saved to Downloads as "${fileName}". Open with Excel or any spreadsheet app.`,
            [
                {
                    text: 'Share',
                    onPress: () => Share.open({ url: `file://${filePath}`, type: 'text/csv', filename: fileName }),
                },
                { text: 'OK' },
            ]
        );
    } catch (err) {
        Alert.alert('Error', `Failed to save report: ${err.message}`);
    }
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, color }) {
    return (
        <Card style={styles.statCard}>
            <View style={[styles.statIconBg, { backgroundColor: color + '22' }]}>
                <FontAwesomeIcon icon={icon} size={20} color={color} />
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </Card>
    );
}

function ReportRow({ item }) {
    const initials = item.Name
        ? item.Name.split(' ').map(n => n[0]).slice(0, 2).join('')
        : '--';

    const isIn = item.inTime && !item.outTime;
    const isOut = item.inTime && item.outTime;

    return (
        <Card style={styles.reportRow}>
            <View style={styles.rowLeft}>
                <View style={[styles.avatar, isIn ? styles.avatarIn : isOut ? styles.avatarOut : styles.avatarAbsent]}>
                    <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <View style={styles.rowInfo}>
                    <Text style={styles.rowName}>{item.Name}</Text>
                    <View style={styles.rowMeta}>
                        <FontAwesomeIcon icon={faGraduationCap} size={11} color={Colours.text.muted} />
                        <Text style={styles.rowMetaText}>{item.Course}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.rowRight}>
                <View style={[styles.statusPill,
                isIn ? styles.pillIn : isOut ? styles.pillOut : styles.pillAbsent]}>
                    <Text style={[styles.pillText,
                    isIn ? styles.pillTextIn : isOut ? styles.pillTextOut : styles.pillTextAbsent]}>
                        {isIn ? 'Present-IN' : isOut ? 'Present-OUT' : 'Absent'}
                    </Text>
                </View>
                <Text style={styles.timeText}>{fmtTime(item.inTime)}</Text>
            </View>
        </Card>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TeacherView() {

    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [selectedDateLabel, setSelectedDateLabel] = useState("Today's Report");

    const dispatch = useDispatch();
    const tabBarHeight = useBottomTabBarHeight();

    const token = useSelector(state => state.auth.token);
    const loggedUser = useSelector(state => state.profile);
    const attendanceData = useSelector(state => state.home.data);

    const todayStr = useMemo(() => formatDate(new Date()), []);

    const stats = useMemo(() => [
        {
            key: 'total',
            label: 'Total Students',
            value: attendanceData?.length || 0,
            icon: faUser,
            color: Colours.brand.primary,
        },
        {
            key: 'in',
            label: 'Present IN',
            value: attendanceData?.filter(i => i.inTime && !i.outTime).length || 0,
            icon: faCircleCheck,
            color: '#10B981',
        },
        {
            key: 'out',
            label: 'Present OUT',
            value: attendanceData?.filter(i => i.outTime).length || 0,
            icon: faSquareArrowUpRight,
            color: '#F59E0B',
        },
        {
            key: 'absent',
            label: 'Absent',
            value: attendanceData?.filter(i => !i.inTime && !i.outTime).length || 0,
            icon: faCircleXmark,
            color: '#EF4444',
        },
    ], [attendanceData]);

    // Attendance rate percentage
    const attendanceRate = useMemo(() => {
        if (!attendanceData || attendanceData.length === 0) return 0;
        const present = attendanceData.filter(i => i.inTime).length;
        return Math.round((present / attendanceData.length) * 100);
    }, [attendanceData]);

    function sync() {
        const today = toISODate(new Date());
        dispatch(fetchAttendance({ token, date: today }));
        setSelectedDateLabel("Today's Report");
    }

    const renderItem = ({ item }) => <ReportRow item={item} />;

    const ListHeader = () => (
        <>
            {/* ── Header Card ── */}
            <View style={styles.headerCard}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.greeting}>
                            {loggedUser.name
                                ? `Hello, ${loggedUser.name.split(' ')[0]}`
                                : 'Hello, Admin'}
                        </Text>
                        <View style={styles.rolePill}>
                            <FontAwesomeIcon icon={faChartBar} size={10} color="#ffdca8" style={{ marginRight: 5 }} />
                            <Text style={styles.roleText}>Teacher / Admin</Text>
                        </View>
                    </View>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{todayStr}</Text>
                    </View>
                </View>

                {/* Attendance Rate bar */}
                <View style={styles.rateContainer}>
                    <View style={styles.rateHeader}>
                        <Text style={styles.rateLabel}>Attendance Rate</Text>
                        <Text style={styles.rateValue}>{attendanceRate}%</Text>
                    </View>
                    <View style={styles.rateBarBg}>
                        <View style={[styles.rateBarFill, { width: `${attendanceRate}%` }]} />
                    </View>
                </View>
            </View>

            {/* ── Stats Row ── */}
            <View style={styles.statsGrid}>
                {stats.map(s => (
                    <StatCard
                        key={s.key}
                        icon={s.icon}
                        label={s.label}
                        value={s.value}
                        color={s.color}
                    />
                ))}
            </View>

            {/* ── Reports Section Header ── */}
            <View style={styles.sectionHeader}>
                <View style={styles.sectionLeft}>
                    <FontAwesomeIcon icon={faChartBar} size={14} color={Colours.brand.primary} />
                    <Text style={styles.sectionTitle}>{selectedDateLabel}</Text>
                </View>

                <View style={styles.sectionActions}>
                    {/* Filter */}
                    <TouchableOpacity style={styles.actionBtn} onPress={() => setOpen(true)}>
                        <FontAwesomeIcon icon={faCalendarDays} size={13} color={Colours.brand.primary} />
                        <Text style={styles.actionBtnText}>Filter</Text>
                    </TouchableOpacity>

                    {/* Download CSV */}
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.actionBtnGreen]}
                        onPress={() => downloadCSV(attendanceData, toISODate(date))}
                    >
                        <FontAwesomeIcon icon={faFileExcel} size={13} color="#fff" />
                        <Text style={[styles.actionBtnText, { color: '#fff' }]}>Export</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );

    return (
        <SafeAreaView style={styles.safe}>

            <FlatList
                data={attendanceData}
                keyExtractor={(item, index) => String(item.id || index)}
                renderItem={renderItem}
                ListHeaderComponent={ListHeader}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <FontAwesomeIcon icon={faChartBar} size={48} color={Colours.text.muted} />
                        <Text style={styles.emptyText}>No attendance data found.</Text>
                        <Text style={styles.emptySubText}>Use filter to pick a date or sync to load today's data.</Text>
                    </View>
                }
                contentContainerStyle={{ padding: 16, paddingBottom: tabBarHeight + 90 }}
                showsVerticalScrollIndicator={false}
            />

            {/* Date Picker */}
            <DatePicker
                modal
                open={open}
                date={date}
                mode="date"
                onConfirm={(selectedDate) => {
                    setOpen(false);
                    setDate(selectedDate);
                    const formatted = toISODate(selectedDate);
                    dispatch(fetchAttendance({ token, date: formatted }));
                    setSelectedDateLabel(`Report — ${formatted}`);
                }}
                onCancel={() => setOpen(false)}
            />

            {/* Sync FAB */}
            <TouchableOpacity
                style={[styles.fab, { bottom: tabBarHeight + 20 }]}
                activeOpacity={0.8}
                onPress={sync}
            >
                <FontAwesomeIcon icon={faSync} color="#fff" size={18} />
            </TouchableOpacity>

        </SafeAreaView>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

    safe: {
        flex: 1,
        backgroundColor: '#F0F4FF',
    },

    // ── Header ──
    headerCard: {
        backgroundColor: '#1E3A5F',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        elevation: 4,
        shadowColor: '#1E3A5F',
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },

    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },

    greeting: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 6,
    },

    rolePill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.12)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },

    roleText: {
        color: '#ffdca8',
        fontWeight: '700',
        fontSize: 11,
    },

    badge: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        maxWidth: 130,
    },

    badgeText: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 11,
        textAlign: 'right',
    },

    // ── Rate Bar ──
    rateContainer: {
        marginTop: 18,
    },

    rateHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },

    rateLabel: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 12,
    },

    rateValue: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
    },

    rateBarBg: {
        height: 7,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 10,
        overflow: 'hidden',
    },

    rateBarFill: {
        height: '100%',
        backgroundColor: '#34D399',
        borderRadius: 10,
    },

    // ── Stats ──
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 16,
    },

    statCard: {
        width: '47%',
        padding: 14,
        borderRadius: 14,
        alignItems: 'flex-start',
    },

    statIconBg: {
        width: 38,
        height: 38,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },

    statValue: {
        fontSize: 26,
        fontWeight: '800',
        color: Colours.text.primary,
        marginBottom: 2,
    },

    statLabel: {
        fontSize: 11,
        color: Colours.text.muted,
        fontWeight: '500',
    },

    // ── Section Header ──
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },

    sectionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: Colours.text.primary,
    },

    sectionActions: {
        flexDirection: 'row',
        gap: 8,
    },

    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        borderWidth: 1,
        borderColor: Colours.brand.primary,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },

    actionBtnText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colours.brand.primary,
    },

    actionBtnGreen: {
        backgroundColor: '#10B981',
        borderColor: '#10B981',
    },

    // ── Report Rows ──
    reportRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 14,
        marginBottom: 10,
    },

    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    avatarIn: { backgroundColor: '#10B98122' },
    avatarOut: { backgroundColor: '#F59E0B22' },
    avatarAbsent: { backgroundColor: '#EF444422' },

    avatarText: {
        fontWeight: '800',
        fontSize: 14,
        color: Colours.text.primary,
    },

    rowInfo: { flex: 1 },

    rowName: {
        fontWeight: '700',
        fontSize: 14,
        color: Colours.text.primary,
        marginBottom: 3,
    },

    rowMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },

    rowMetaText: {
        fontSize: 12,
        color: Colours.text.muted,
    },

    rowRight: {
        alignItems: 'flex-end',
    },

    statusPill: {
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: 20,
        marginBottom: 4,
    },

    pillIn: { backgroundColor: '#D1FAE5' },
    pillOut: { backgroundColor: '#FEF3C7' },
    pillAbsent: { backgroundColor: '#FEE2E2' },

    pillText: { fontSize: 10, fontWeight: '700' },
    pillTextIn: { color: '#059669' },
    pillTextOut: { color: '#D97706' },
    pillTextAbsent: { color: '#DC2626' },

    timeText: {
        fontSize: 11,
        color: Colours.text.muted,
    },

    // ── Empty ──
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
        paddingHorizontal: 30,
    },

    emptyText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colours.text.primary,
        marginTop: 14,
    },

    emptySubText: {
        fontSize: 13,
        color: Colours.text.muted,
        textAlign: 'center',
        marginTop: 6,
        lineHeight: 20,
    },

    // ── FAB ──
    fab: {
        position: 'absolute',
        right: 22,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#1E3A5F',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        shadowColor: '#1E3A5F',
        shadowOpacity: 0.35,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
});

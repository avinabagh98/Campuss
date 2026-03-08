import React, { useRef, useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, Text, StyleSheet, Platform, Animated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faHome, faCamera, faUser, faBarcode } from '@fortawesome/free-solid-svg-icons';
import HomeScreen from '../features/home/HomeScreen';
import ScannerScreen from '../features/scanner/ScannerScreen';
import ProfileScreen from '../features/profile/ProfileScreen';
import { Colours } from '../theme/Colours';

const Tab = createBottomTabNavigator();

function MyTabBar({ state, descriptors, navigation }: any) {
    const [barWidth, setBarWidth] = useState(0);
    const indicatorX = useRef(new Animated.Value(0)).current;
    const centerScale = useRef(new Animated.Value(1)).current;
    const floatingX = useRef(new Animated.Value(0)).current;
    const bumpX = useRef(new Animated.Value(0)).current;
    const [tabCenters, setTabCenters] = useState<number[]>([]);

    useEffect(() => {
        const focusedIndex = state.index;
        const isCenterFocused = state.routes[focusedIndex]?.name === 'Scan';
        Animated.spring(centerScale, { toValue: isCenterFocused ? 1.08 : 1, useNativeDriver: true }).start();

        if (barWidth <= 0) return;
        const tabCount = state.routes.length;
        const tabW = barWidth / tabCount;

        // use measured centers when available for precise placement
        const center = tabCenters[focusedIndex];

        const indicatorTo = typeof center === 'number' ? center - 20 : tabW * focusedIndex + (tabW / 2) - 20;
        Animated.spring(indicatorX, { toValue: indicatorTo, useNativeDriver: true, stiffness: 250, damping: 18, mass: 1 }).start();

        // animate floating button X to stay above the active tab
        const floatingTo = typeof center === 'number' ? center - 32 : tabW * focusedIndex + (tabW / 2) - 32; // center of floating 64px button
        Animated.spring(floatingX, { toValue: floatingTo, useNativeDriver: true, stiffness: 220, damping: 20, mass: 1 }).start();

        // animate bump to sit under the active tab
        const bumpWidth = 120;
        const bumpTo = typeof center === 'number' ? center - (bumpWidth / 2) : tabW * focusedIndex + (tabW / 2) - (bumpWidth / 2);
        Animated.spring(bumpX, { toValue: bumpTo, useNativeDriver: true, stiffness: 200, damping: 18, mass: 1 }).start();
    }, [state.index, barWidth, tabCenters]);

    const renderBump = (w: number) => {
        const h = 80;
        const topY = 20;
        const bumpH = 36;
        return `M0,${topY} C${w * 0.25},${topY} ${w * 0.25},${topY - bumpH} ${w / 2},${topY - bumpH} C${w * 0.75},${topY - bumpH} ${w * 0.75},${topY} ${w},${topY} L${w},${h} L0,${h} Z`;
    };

    // compute svg path for top wave/bump
    const renderPath = (w: number) => {
        // flat top path (no centered bump) — bump is rendered separately and animated
        const h = 80;
        const left = 0;
        const right = w;
        const topY = 20;
        return `M${left},${topY} L${right},${topY} L${right},${h} L${left},${h} Z`;
    };

    return (
        <View style={styles.tabBarContainer} pointerEvents="box-none">
            <View style={styles.tabBar} onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}>
                {/* svg wave background (static) */}
                {barWidth > 0 && (
                    <Svg width={barWidth} height={80} style={{ position: 'absolute', left: 0, top: 0 }} pointerEvents="none">
                        <Path d={renderPath(barWidth)} fill={Colours.brand.primary} />
                    </Svg>
                )}
                {/* animated indicator */}
                {barWidth > 0 && (
                    <Animated.View
                        style={[
                            styles.indicator,
                            { transform: [{ translateX: indicatorX }] }
                        ]}
                    />
                )}
                {state.routes.map((route: any, index: number) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    // Regular tab items using FontAwesomeIcon
                    const icon = route.name === 'Home' ? (faHome as unknown as IconProp) : route.name === 'Scan' ? (faBarcode as unknown as IconProp) : route.name === 'Profile' ? (faUser as unknown as IconProp) : (faHome as unknown as IconProp);

                    return (
                        <TouchableOpacity
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            onPress={onPress}
                            style={styles.tabItem}
                            onLayout={(e) => {
                                const layout = e.nativeEvent.layout;
                                // layout.x is relative to tabBar
                                setTabCenters(prev => {
                                    const next = [...prev];
                                    next[index] = layout.x + layout.width / 2;
                                    return next;
                                });
                            }}
                        >
                            <FontAwesomeIcon icon={icon} size={20} color={isFocused ? Colours.brand.accent : 'rgba(255,255,255,0.85)'} />
                            <Text style={[styles.label, isFocused && styles.labelActive]}>{label}</Text>
                        </TouchableOpacity>
                    );
                })}

                {/* floating elevated button that follows active tab */}
                {barWidth > 0 && (
                    <Animated.View
                        style={[
                            styles.floatingButton,
                            { transform: [{ translateX: floatingX }, { translateY: -26 }, { scale: centerScale }] }
                        ]}
                        pointerEvents="none"
                    >
                        <View style={styles.floatingInner}>
                            {/* show active icon inside floating button */}
                            <FontAwesomeIcon icon={(state.routes[state.index].name === 'Home' ? faHome : state.routes[state.index].name === 'Scan' ? faBarcode : faUser) as unknown as IconProp} size={20} color="#fff" />
                        </View>
                    </Animated.View>
                )}

                {/* moving bump under active icon */}
                {barWidth > 0 && (
                    <Animated.View style={{ position: 'absolute', top: 0, left: 0, transform: [{ translateX: bumpX }] }} pointerEvents="none">
                        <Svg width={120} height={80}>
                            <Path d={renderBump(120)} fill={Colours.brand.primary} />
                        </Svg>
                    </Animated.View>
                )}
            </View>
        </View>
    );
}

export default function BottomTabs() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false, animation: 'shift' }} tabBar={(props) => <MyTabBar {...props} />}>
            <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
            <Tab.Screen name="Scan" component={ScannerScreen} options={{ tabBarLabel: 'Scan' }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBarContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: Platform.OS === 'ios' ? 36 : 30,
        alignItems: 'center',
        zIndex: 10,
        paddingHorizontal: 8,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        width: '96%',
        height: 80,
        borderRadius: 36,
        paddingHorizontal: 12,
        paddingTop: 18,
        alignItems: 'center',
        justifyContent: 'space-between',
        // no shadow as requested
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 64,
        maxWidth: 110,
        // paddingVertical: 6
    },
    icon: {
        fontSize: 20,
        color: '#8a8a8a'
    },
    iconActive: {
        color: '#ff2e6d'
    },
    label: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.85)',
        marginTop: 4
    },
    labelActive: {
        color: Colours.brand.accent,
        fontWeight: '600'
    },
    centerButtonContainer: {
        width: 78,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -32
    },
    centerButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#ff2e6d',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#ff2e6d',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 18,
        elevation: 8
    },
    centerButtonActive: {
        backgroundColor: '#ff587f'
    },
    centerIcon: {
        fontSize: 26,
        color: '#fff'
    },
    floatingButton: {
        position: 'absolute',
        bottom: 9,
        left: 0,
        width: 64,
        height: 64,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5
    },
    floatingInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Colours.brand.accent,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colours.brand.accent,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 18,
        elevation: 8
    },
    indicator: {
        position: 'absolute',
        bottom: 12,
        left: 0,
        width: 40,
        height: 4,
        borderRadius: 4,
        backgroundColor: Colours.brand.primaryLight,
        zIndex: 1
    }
});
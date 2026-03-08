import React from "react";
import { View, StyleSheet, ViewStyle, TouchableOpacity } from "react-native";
import { Colours } from "../theme/Colours";


interface CardProps {
    children?: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
    testID?: string;
    isTouchable?: boolean;
}

export default function Card({ children, style, testID, isTouchable }: CardProps) {
    return (

        isTouchable ?
            <TouchableOpacity activeOpacity={0.8}>
                <View style={[styles.card, style]} testID={testID}>
                    {children}
                </View>
            </TouchableOpacity>


            :
            <View style={[styles.card, style]} testID={testID}>
                {children}
            </View>


    );
}

const styles = StyleSheet.create({

    card: {
        backgroundColor: Colours.background.card,
        padding: 16,
        borderRadius: 12,

        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },

        elevation: 2
    }

})
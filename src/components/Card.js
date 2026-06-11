import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Colours } from "../theme/Colours";

export default function Card({ children, style, testID, isTouchable }) {

    const Container = isTouchable ? TouchableOpacity : View;

    return (
        <Container
            style={[styles.card, style]}
            testID={testID}
            {...(isTouchable && { activeOpacity: 0.8 })}
        >
            {children}
        </Container>
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
});
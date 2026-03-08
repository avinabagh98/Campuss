import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { Colours } from "../theme/Colours";

type ButtonType = "primary" | "secondary" | "outline";

interface ButtonProps {
    title: string;
    type?: ButtonType;
    onPress?: () => void;
    disabled?: boolean;
    style?: ViewStyle | ViewStyle[];
    textStyle?: TextStyle | TextStyle[];
}

export default function Button({ title, type = "primary", onPress, disabled = false, style, textStyle: customTextStyle }: ButtonProps) {

    const buttonStyle = [
        styles.button,
        type === "primary" && styles.primary,
        type === "secondary" && styles.secondary,
        type === "outline" && styles.outline,
        disabled && styles.disabled,
        style
    ] as any;

    const textStyle = [
        styles.text,
        type === "outline" ? styles.outlineText : styles.primaryText,
        disabled && styles.disabledText,
        customTextStyle
    ] as any;

    return (
        <TouchableOpacity
            style={buttonStyle}
            onPress={disabled ? undefined : onPress}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityState={{ disabled }}
            disabled={disabled}
        >
            <Text style={textStyle}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({

    button: {
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center"
    },

    primary: {
        backgroundColor: Colours.brand.primary
    },

    secondary: {
        backgroundColor: Colours.brand.primaryLight
    },

    outline: {
        borderWidth: 1,
        borderColor: Colours.brand.primary
    },

    text: {
        fontSize: 16,
        fontWeight: "600"
    },

    primaryText: {
        color: "#fff"
    },

    outlineText: {
        color: Colours.brand.primary
    },

    disabled: {
        opacity: 0.6
    },
    disabledText: {
        color: '#ccc'
    }

})
import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Colours } from '../theme/Colours'

export default function Input(props: React.ComponentProps<typeof TextInput>) {

    return (
        <View style={styles.container}>
            <TextInput
                placeholderTextColor={Colours.text.muted}
                style={styles.input}
                {...props}
            />
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        borderWidth: 1,
        borderColor: Colours.border.default,
        borderRadius: 10,
        paddingHorizontal: 12,
        backgroundColor: "#fff"
    },

    input: {
        height: 48,
        fontSize: 16,
        color: Colours.text.primary
    }

})
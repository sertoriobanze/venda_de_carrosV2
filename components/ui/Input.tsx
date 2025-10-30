import { TextInput, Text, View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type InputProps = {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    multiline?: boolean;
};

export function Input({ label, value, onChangeText, placeholder, multiline }: InputProps) {
    return (
        <ThemedView style={styles.container}>
            <ThemedText type="defaultSemiBold">{label}</ThemedText>
            <TextInput
                style={[styles.input, multiline && styles.multiline]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                multiline={multiline}
                numberOfLines={multiline ? 3 : 1}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { gap: 4, marginBottom: 16 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#fff',
    },
    multiline: { height: 80, textAlignVertical: 'top' },
});
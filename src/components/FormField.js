import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default function FormField({ label, error, ...inputProps }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor={colors.textMuted}
        {...inputProps}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: spacing.lg },
  label: { fontSize: 13, fontWeight: '700', color: colors.inkSoft, marginBottom: 6 },
  input: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, height: 46, fontSize: 15, color: colors.text },
  inputError: { borderColor: colors.danger, backgroundColor: colors.dangerBg },
  error: { color: colors.danger, fontSize: 12, marginTop: 4, fontWeight: '600' },
});
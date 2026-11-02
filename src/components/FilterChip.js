import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default function FilterChip({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.active]}>
      <Text style={[styles.text, active && styles.activeText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { paddingHorizontal: spacing.md, paddingVertical: 7, borderRadius: radius.pill, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, marginRight: spacing.sm },
  active: { backgroundColor: colors.ink, borderColor: colors.ink },
  text: { fontSize: 13, fontWeight: '600', color: colors.inkSoft },
  activeText: { color: colors.white },
});
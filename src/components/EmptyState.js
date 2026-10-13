import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';

export default function EmptyState({ icon = 'cube-outline', title, message, actionLabel, onAction }) {
  return (
    <View style={styles.box}>
      <View style={styles.icon}>
        <Ionicons name={icon} size={28} color={colors.inkSoft} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel ? (
        <Pressable onPress={onAction} style={styles.btn}>
          <Text style={styles.btnText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', padding: spacing.xxl, gap: spacing.sm },
  icon: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.signalSoft, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  title: { fontSize: 17, fontWeight: '700', color: colors.text, textAlign: 'center' },
  message: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
  btn: { marginTop: spacing.md, backgroundColor: colors.ink, paddingHorizontal: spacing.lg, paddingVertical: 10, borderRadius: radius.md },
  btnText: { color: colors.white, fontWeight: '700' },
});

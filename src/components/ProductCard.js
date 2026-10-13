import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StockBadge from './StockBadge';
import { CATEGORY_ICONS } from '../data/mockProducts';
import { getStockStatus, STATUS_META } from '../utils/stock';
import { formatPrice } from '../utils/format';
import { colors, radius, spacing } from '../theme';

export default function ProductCard({ product, onPress, onIncrement, onDecrement }) {
  const meta = STATUS_META[getStockStatus(product.quantity)];
  const empty = product.quantity === 0;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={[styles.stripe, { backgroundColor: meta.color }]} />
      <View style={styles.body}>
        <View style={styles.topRow}>
          <Ionicons name={CATEGORY_ICONS[product.category] || 'cube-outline'} size={14} color={colors.textMuted} />
          <Text style={styles.ref}>{product.reference}</Text>
        </View>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          <StockBadge quantity={product.quantity} />
        </View>
      </View>

      <View style={styles.stepper}>
        <Pressable onPress={onIncrement} hitSlop={6} style={styles.stepBtn} accessibilityLabel="Ajouter une unité">
          <Ionicons name="add" size={18} color={colors.ink} />
        </Pressable>
        <Text style={styles.qty}>{product.quantity}</Text>
        <Pressable onPress={onDecrement} disabled={empty} hitSlop={6} style={[styles.stepBtn, empty && styles.disabled]} accessibilityLabel="Retirer une unité">
          <Ionicons name="remove" size={18} color={colors.ink} />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: radius.md, marginBottom: spacing.sm, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  pressed: { opacity: 0.85 },
  stripe: { width: 5 },
  body: { flex: 1, padding: spacing.md, gap: 4 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ref: { fontSize: 12, fontWeight: '600', color: colors.textMuted, letterSpacing: 0.5 },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  price: { fontSize: 14, fontWeight: '600', color: colors.inkSoft },
  stepper: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.md, gap: 2, borderLeftWidth: 1, borderLeftColor: colors.border },
  stepBtn: { width: 30, height: 30, borderRadius: radius.sm, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.35 },
  qty: { fontSize: 16, fontWeight: '800', color: colors.text, minWidth: 30, textAlign: 'center' },
});

import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from './SearchBar';
import FilterChip from './FilterChip';
import { CATEGORIES } from '../data/mockProducts';
import { colors, radius, spacing } from '../theme';

const STATUSES = [
  { key: 'disponible', label: 'Disponible' },
  { key: 'bas', label: 'Stock bas' },
  { key: 'rupture', label: 'Rupture' },
];

const SORTS = [
  { key: 'name', label: 'Nom' },
  { key: 'price', label: 'Prix' },
  { key: 'quantity', label: 'Quantité' },
];

export default function FilterBar({ filters, onChange, onReset, count }) {
  const [open, setOpen] = useState(false);
  const { search, category, status, minPrice, maxPrice, sortBy } = filters;
  const activeCount = [category, status, minPrice, maxPrice].filter(Boolean).length;
  const set = (key) => (value) => onChange({ ...filters, [key]: value });

  return (
    <View style={styles.wrapper}>
      <View style={styles.searchRow}>
        <View style={{ flex: 1 }}>
          <SearchBar value={search} onChangeText={set('search')} />
        </View>
        <Pressable onPress={() => setOpen((v) => !v)} style={[styles.toggle, open && styles.toggleOn]}>
          <Ionicons name="options-outline" size={20} color={open ? colors.white : colors.ink} />
          {activeCount > 0 && (
            <View style={styles.dot}>
              <Text style={styles.dotText}>{activeCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {open && (
        <View style={styles.panel}>
          <Text style={styles.title}>Catégorie</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <FilterChip label="Toutes" active={!category} onPress={() => set('category')(null)} />
            {CATEGORIES.map((c) => (
              <FilterChip key={c} label={c} active={category === c} onPress={() => set('category')(category === c ? null : c)} />
            ))}
          </ScrollView>

          <Text style={styles.title}>Statut du stock</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <FilterChip label="Tous" active={!status} onPress={() => set('status')(null)} />
            {STATUSES.map((s) => (
              <FilterChip key={s.key} label={s.label} active={status === s.key} onPress={() => set('status')(status === s.key ? null : s.key)} />
            ))}
          </ScrollView>

          <Text style={styles.title}>Prix (DT)</Text>
          <View style={styles.priceRow}>
            <TextInput style={styles.priceInput} placeholder="Min" placeholderTextColor={colors.textMuted} keyboardType="numeric" value={minPrice} onChangeText={set('minPrice')} />
            <Text style={{ color: colors.textMuted }}>à</Text>
            <TextInput style={styles.priceInput} placeholder="Max" placeholderTextColor={colors.textMuted} keyboardType="numeric" value={maxPrice} onChangeText={set('maxPrice')} />
          </View>

          <Text style={styles.title}>Trier par</Text>
          <View style={{ flexDirection: 'row' }}>
            {SORTS.map((s) => (
              <FilterChip key={s.key} label={s.label} active={sortBy === s.key} onPress={() => set('sortBy')(s.key)} />
            ))}
          </View>
        </View>
      )}

      <View style={styles.countRow}>
        <Text style={styles.count}>{count} produit(s)</Text>
        {(activeCount > 0 || search) && (
          <Pressable onPress={onReset} hitSlop={8}>
            <Text style={styles.reset}>Réinitialiser</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.sm },
  searchRow: { flexDirection: 'row', gap: spacing.sm },
  toggle: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  toggleOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  dot: { position: 'absolute', top: -5, right: -5, backgroundColor: colors.signal, borderRadius: 9, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
  dotText: { fontSize: 11, fontWeight: '800', color: colors.ink },
  panel: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.sm, borderWidth: 1, borderColor: colors.border },
  title: { fontSize: 12, fontWeight: '700', color: colors.textMuted, marginTop: spacing.sm, marginBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  priceInput: { flex: 1, height: 40, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: spacing.md, color: colors.text, backgroundColor: colors.bg },
  countRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md },
  count: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  reset: { fontSize: 13, fontWeight: '700', color: colors.ink, textDecorationLine: 'underline' },
});
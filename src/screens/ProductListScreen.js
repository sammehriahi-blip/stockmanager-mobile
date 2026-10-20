import { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, Pressable, TextInput, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import FilterChip from '../components/FilterChip';
import EmptyState from '../components/EmptyState';
import { useProducts } from '../context/ProductsContext';
import { CATEGORIES } from '../data/mockProducts';
import { productService } from '../services/productService';
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

export default function ProductListScreen({ navigation }) {
  const { adjustStock, version } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(null);
  const [status, setStatus] = useState(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

  const [visible, setVisible] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const activeFilters = [category, status, minPrice, maxPrice].filter(Boolean).length;

  // Recherche, filtres et tri sont faits par l'API (query params)
  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await productService.getAll({
        search: search.trim(),
        category,
        status,
        minPrice,
        maxPrice,
        sort: sortBy,
      });
      setVisible(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, category, status, minPrice, maxPrice, sortBy]);

  // Attend 300 ms après la dernière frappe avant d'appeler l'API
  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [load, version]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const changeStock = (id, delta) => {
    setVisible((list) => list.map((p) => (p.id === id ? { ...p, quantity: Math.max(0, p.quantity + delta) } : p)));
    adjustStock(id, delta);
  };

  const resetFilters = () => {
    setSearch('');
    setCategory(null);
    setStatus(null);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('name');
  };

  const header = (
    <View style={styles.header}>
      <View style={styles.searchRow}>
        <View style={{ flex: 1 }}>
          <SearchBar value={search} onChangeText={setSearch} />
        </View>
        <Pressable onPress={() => setShowFilters((v) => !v)} style={[styles.filterBtn, showFilters && styles.filterBtnOn]} accessibilityLabel="Afficher les filtres">
          <Ionicons name="options-outline" size={20} color={showFilters ? colors.white : colors.ink} />
          {activeFilters > 0 && (
            <View style={styles.dot}>
              <Text style={styles.dotText}>{activeFilters}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {showFilters && (
        <View style={styles.filters}>
          <Text style={styles.filterTitle}>Catégorie</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <FilterChip label="Toutes" active={!category} onPress={() => setCategory(null)} />
            {CATEGORIES.map((c) => (
              <FilterChip key={c} label={c} active={category === c} onPress={() => setCategory(category === c ? null : c)} />
            ))}
          </ScrollView>

          <Text style={styles.filterTitle}>Statut du stock</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <FilterChip label="Tous" active={!status} onPress={() => setStatus(null)} />
            {STATUSES.map((s) => (
              <FilterChip key={s.key} label={s.label} active={status === s.key} onPress={() => setStatus(status === s.key ? null : s.key)} />
            ))}
          </ScrollView>

          <Text style={styles.filterTitle}>Prix (DT)</Text>
          <View style={styles.priceRow}>
            <TextInput style={styles.priceInput} placeholder="Min" placeholderTextColor={colors.textMuted} keyboardType="numeric" value={minPrice} onChangeText={setMinPrice} />
            <Text style={{ color: colors.textMuted }}>à</Text>
            <TextInput style={styles.priceInput} placeholder="Max" placeholderTextColor={colors.textMuted} keyboardType="numeric" value={maxPrice} onChangeText={setMaxPrice} />
          </View>

          <Text style={styles.filterTitle}>Trier par</Text>
          <View style={{ flexDirection: 'row' }}>
            {SORTS.map((s) => (
              <FilterChip key={s.key} label={s.label} active={sortBy === s.key} onPress={() => setSortBy(s.key)} />
            ))}
          </View>
        </View>
      )}

      <View style={styles.countRow}>
        <Text style={styles.count}>{visible.length} produit(s)</Text>
        {(activeFilters > 0 || search) && (
          <Pressable onPress={resetFilters} hitSlop={8}>
            <Text style={styles.reset}>Réinitialiser</Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={header}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
            onIncrement={() => changeStock(item.id, 1)}
            onDecrement={() => changeStock(item.id, -1)}
          />
        )}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color={colors.ink} style={{ marginTop: spacing.xxl }} />
          ) : error ? (
            <EmptyState icon="cloud-offline-outline" title="Connexion impossible" message={error} actionLabel="Réessayer" onAction={load} />
          ) : (
            <EmptyState
              icon="search-outline"
              title="Aucun produit trouvé"
              message="Modifiez votre recherche ou vos filtres."
              actionLabel="Réinitialiser les filtres"
              onAction={resetFilters}
            />
          )
        }
      />

      <Pressable onPress={() => navigation.navigate('ProductForm')} style={({ pressed }) => [styles.fab, pressed && { opacity: 0.85 }]} accessibilityLabel="Ajouter un produit">
        <Ionicons name="add" size={28} color={colors.ink} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  list: { padding: spacing.lg, paddingBottom: 100 },
  header: { marginBottom: spacing.sm },
  searchRow: { flexDirection: 'row', gap: spacing.sm },
  filterBtn: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  filterBtnOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  dot: { position: 'absolute', top: -5, right: -5, backgroundColor: colors.signal, borderRadius: 9, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
  dotText: { fontSize: 11, fontWeight: '800', color: colors.ink },
  filters: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.sm, borderWidth: 1, borderColor: colors.border },
  filterTitle: { fontSize: 12, fontWeight: '700', color: colors.textMuted, marginTop: spacing.sm, marginBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  priceInput: { flex: 1, height: 40, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: spacing.md, color: colors.text, backgroundColor: colors.bg },
  countRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md },
  count: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  reset: { fontSize: 13, fontWeight: '700', color: colors.ink, textDecorationLine: 'underline' },
  fab: { position: 'absolute', right: spacing.xl, bottom: spacing.xl, width: 58, height: 58, borderRadius: 29, backgroundColor: colors.signal, alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
});

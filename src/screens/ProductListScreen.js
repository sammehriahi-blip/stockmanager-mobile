import { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../components/ProductCard';
import FilterBar from '../components/FilterBar';
import EmptyState from '../components/EmptyState';
import { useProducts } from '../context/ProductsContext';
import { productService } from '../services/productService';
import { colors, spacing } from '../theme';

const DEFAULT_FILTERS = { search: '', category: null, status: null, minPrice: '', maxPrice: '', sortBy: 'name' };

export default function ProductListScreen({ navigation }) {
  const { adjustStock, version } = useProducts();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [visible, setVisible] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await productService.getAll({
        search: filters.search.trim(),
        category: filters.category,
        status: filters.status,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sort: filters.sortBy,
      });
      setVisible(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [load, version]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const changeStock = (id, delta) => {
    setVisible((list) => list.map((p) => (p.id === id ? { ...p, quantity: Math.max(0, p.quantity + delta) } : p)));
    adjustStock(id, delta);
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <FilterBar filters={filters} onChange={setFilters} onReset={resetFilters} count={visible.length} />
        }
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

      <Pressable onPress={() => navigation.navigate('ProductForm')} style={({ pressed }) => [styles.fab, pressed && { opacity: 0.85 }]}>
        <Ionicons name="add" size={28} color={colors.ink} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  list: { padding: spacing.lg, paddingBottom: 100 },
  fab: { position: 'absolute', right: spacing.xl, bottom: spacing.xl, width: 58, height: 58, borderRadius: 29, backgroundColor: colors.signal, alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
});
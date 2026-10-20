import { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import EmptyState from '../components/EmptyState';
import { productService } from '../services/productService';
import { formatDate } from '../utils/format';
import { colors, radius, spacing } from '../theme';

const TYPES = {
  entree: { label: 'Entrée', icon: 'arrow-down', color: colors.success, bg: colors.successBg },
  sortie: { label: 'Sortie', icon: 'arrow-up', color: colors.danger, bg: colors.dangerBg },
  creation: { label: 'Nouveau produit', icon: 'sparkles-outline', color: colors.ink, bg: colors.signalSoft },
};

export default function HistoryScreen() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setMovements(await productService.getMovements());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Recharge à chaque fois qu'on ouvre l'onglet
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <FlatList
      style={{ backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: spacing.lg, flexGrow: 1 }}
      data={movements}
      keyExtractor={(m) => m.id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      renderItem={({ item }) => {
        const t = TYPES[item.type] || TYPES.creation;
        return (
          <View style={styles.row}>
            <View style={[styles.icon, { backgroundColor: t.bg }]}>
              <Ionicons name={t.icon} size={18} color={t.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.productName}</Text>
              <Text style={styles.meta}>
                {t.label}, le {formatDate(item.date)}, stock : {item.quantityAfter}
              </Text>
            </View>
            <Text style={[styles.delta, { color: t.color }]}>{item.delta > 0 ? `+${item.delta}` : item.delta}</Text>
          </View>
        );
      }}
      ListEmptyComponent={
        loading ? (
          <ActivityIndicator size="large" color={colors.ink} style={{ marginTop: spacing.xxl }} />
        ) : error ? (
          <EmptyState icon="cloud-offline-outline" title="Connexion impossible" message={error} actionLabel="Réessayer" onAction={load} />
        ) : (
          <EmptyState icon="time-outline" title="Aucun mouvement pour l'instant" message="Utilisez + ou − sur un produit : chaque entrée et sortie de stock apparaîtra ici." />
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.card, padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border },
  icon: { width: 38, height: 38, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 15, fontWeight: '700', color: colors.text },
  meta: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  delta: { fontSize: 18, fontWeight: '800' },
});

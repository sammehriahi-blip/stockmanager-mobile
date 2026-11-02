import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import StatsWidget from '../components/StatsWidget';
import StockBadge from '../components/StockBadge';
import EmptyState from '../components/EmptyState';
import { useProducts } from '../context/ProductsContext';
import { formatPrice } from '../utils/format';
import { colors, radius, spacing, font } from '../theme';

export default function DashboardScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { stats, loading, error, refresh } = useProducts();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.ink} />
        <Text style={[font.small, { marginTop: spacing.md }]}>Chargement de l'inventaire…</Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.center}>
        <EmptyState icon="cloud-offline-outline" title="Connexion impossible" message={error} actionLabel="Réessayer" onAction={refresh} />
      </View>
    );
  }

  const alerts = [...stats.outOfStock, ...stats.lowStock];
  const maxValue = Math.max(...stats.byCategory.map((c) => c.value), 1);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: spacing.xxl }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.white} />}
    >
      <View style={[styles.hero, { paddingTop: insets.top + spacing.lg }]}>
        <View style={styles.brandRow}>
          <View style={styles.logo}>
            <Ionicons name="cube" size={18} color={colors.ink} />
          </View>
          <Text style={styles.brand}>StockManager</Text>
        </View>
        <Text style={styles.heroLabel}>Valeur totale de l'inventaire</Text>
        <View style={styles.valueRow}>
          <View style={styles.signalBar} />
          <Text style={styles.heroValue}>{formatPrice(stats.totalValue)}</Text>
        </View>
        <Text style={styles.heroSub}>
          {stats.totalUnits} unités réparties sur {stats.totalProducts} produits
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.grid}>
          <StatsWidget icon="layers-outline" label="Produits" value={stats.totalProducts} />
          <StatsWidget icon="cube-outline" label="Unités en stock" value={stats.totalUnits} />
        </View>
        <View style={styles.grid}>
          <StatsWidget icon="alert-circle-outline" label="Stock bas" value={stats.lowStock.length} color={colors.warning} bg={colors.warningBg} />
          <StatsWidget icon="close-circle-outline" label="En rupture" value={stats.outOfStock.length} color={colors.danger} bg={colors.dangerBg} />
        </View>

        <Text style={styles.section}>À réapprovisionner</Text>
        {alerts.length === 0 ? (
          <View style={styles.panel}>
            <Text style={font.small}>Tous les produits ont un stock suffisant.</Text>
          </View>
        ) : (
          <View style={styles.panel}>
            {alerts.map((p, i) => (
              <Pressable
                key={p.id}
                onPress={() => navigation.navigate('ProductDetail', { id: p.id })}
                style={[styles.alertRow, i < alerts.length - 1 && styles.divider]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.alertName}>{p.name}</Text>
                  <Text style={font.tiny}>{p.reference}, {p.quantity} restant(s)</Text>
                </View>
                <StockBadge quantity={p.quantity} />
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </Pressable>
            ))}
          </View>
        )}

        <Text style={styles.section}>Valeur par catégorie</Text>
        <View style={styles.panel}>
          {stats.byCategory.map((c) => (
            <View key={c.category} style={styles.barRow}>
              <View style={styles.barHeader}>
                <Text style={styles.barLabel}>{c.category}</Text>
                <Text style={styles.barValue}>{formatPrice(c.value)}</Text>
              </View>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${(c.value / maxValue) * 100}%` }]} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg, padding: spacing.xl },
  hero: { backgroundColor: colors.ink, paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl + spacing.lg },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xl },
  logo: { width: 30, height: 30, borderRadius: radius.sm, backgroundColor: colors.signal, alignItems: 'center', justifyContent: 'center' },
  brand: { color: colors.white, fontSize: 17, fontWeight: '800' },
  heroLabel: { color: '#AEB8CA', fontSize: 13, marginBottom: spacing.sm },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  signalBar: { width: 6, height: 38, backgroundColor: colors.signal, borderRadius: 2 },
  heroValue: { color: colors.white, fontSize: 36, fontWeight: '800', letterSpacing: -0.5 },
  heroSub: { color: '#AEB8CA', fontSize: 13, marginTop: spacing.sm },
  content: { paddingHorizontal: spacing.lg, marginTop: -spacing.xl },
  grid: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  section: { ...font.h2, marginTop: spacing.xl, marginBottom: spacing.sm },
  panel: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.md },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  alertName: { fontSize: 15, fontWeight: '700', color: colors.text },
  barRow: { marginBottom: spacing.md },
  barHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  barLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
  barValue: { fontSize: 13, color: colors.textMuted },
  barTrack: { height: 8, backgroundColor: colors.bg, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 8, backgroundColor: colors.ink, borderRadius: 4 },
});
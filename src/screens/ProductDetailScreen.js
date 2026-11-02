import { View, Text, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StockBadge from '../components/StockBadge';
import EmptyState from '../components/EmptyState';
import { useProducts } from '../context/ProductsContext';
import { CATEGORY_ICONS } from '../data/mockProducts';
import { formatPrice } from '../utils/format';
import { colors, radius, spacing } from '../theme';

function InfoRow({ icon, label, value, last }) {
  return (
    <View style={[styles.infoRow, !last && styles.divider]}>
      <Ionicons name={icon} size={18} color={colors.textMuted} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function ProductDetailScreen({ route, navigation }) {
  const { getProduct, adjustStock, deleteProduct } = useProducts();
  const product = getProduct(route.params.id);

  if (!product) {
    return <EmptyState icon="trash-outline" title="Produit introuvable" message="Ce produit a été supprimé." actionLabel="Retour" onAction={() => navigation.goBack()} />;
  }

  const confirmDelete = () => {
    Alert.alert('Supprimer ce produit ?', `« ${product.name} » sera supprimé définitivement.`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteProduct(product.id);
            navigation.goBack();
          } catch (err) {
            Alert.alert('Suppression impossible', err.message);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
      <View style={styles.head}>
        <View style={styles.catIcon}>
          <Ionicons name={CATEGORY_ICONS[product.category] || 'cube-outline'} size={24} color={colors.ink} />
        </View>
        <Text style={styles.ref}>{product.reference}</Text>
        <Text style={styles.name}>{product.name}</Text>
        <StockBadge quantity={product.quantity} />
      </View>

      <View style={styles.stockPanel}>
        <Text style={styles.stockLabel}>Quantité en stock</Text>
        <View style={styles.stockRow}>
          <Pressable
            onPress={() => adjustStock(product.id, -1)}
            disabled={product.quantity === 0}
            style={[styles.bigBtn, product.quantity === 0 && { opacity: 0.35 }]}
          >
            <Ionicons name="remove" size={26} color={colors.white} />
          </Pressable>
          <Text style={styles.bigQty}>{product.quantity}</Text>
          <Pressable onPress={() => adjustStock(product.id, 1)} style={[styles.bigBtn, styles.bigBtnPlus]}>
            <Ionicons name="add" size={26} color={colors.ink} />
          </Pressable>
        </View>
        <Text style={styles.stockValue}>Valeur : {formatPrice(product.quantity * product.price)}</Text>
      </View>

      <View style={styles.panel}>
        <InfoRow icon="pricetag-outline" label="Prix unitaire" value={formatPrice(product.price)} />
        <InfoRow icon="grid-outline" label="Catégorie" value={product.category} />
        <InfoRow icon="business-outline" label="Fournisseur" value={product.supplier} last={!product.barcode} />
        {product.barcode ? <InfoRow icon="barcode-outline" label="Code-barres" value={product.barcode} last /> : null}
      </View>

      <Pressable onPress={() => navigation.navigate('ProductForm', { id: product.id })} style={styles.editBtn}>
        <Ionicons name="create-outline" size={18} color={colors.white} />
        <Text style={styles.editText}>Modifier le produit</Text>
      </Pressable>
      <Pressable onPress={confirmDelete} style={styles.deleteBtn}>
        <Ionicons name="trash-outline" size={18} color={colors.danger} />
        <Text style={styles.deleteText}>Supprimer</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  head: { alignItems: 'center', gap: 6, marginBottom: spacing.lg },
  catIcon: { width: 56, height: 56, borderRadius: radius.lg, backgroundColor: colors.signalSoft, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  ref: { fontSize: 13, fontWeight: '700', color: colors.textMuted, letterSpacing: 1 },
  name: { fontSize: 24, fontWeight: '800', color: colors.text, textAlign: 'center' },
  stockPanel: { backgroundColor: colors.ink, borderRadius: radius.lg, padding: spacing.xl, alignItems: 'center', marginBottom: spacing.lg },
  stockLabel: { color: '#AEB8CA', fontSize: 13 },
  stockRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl, marginVertical: spacing.md },
  bigBtn: { width: 54, height: 54, borderRadius: 27, backgroundColor: colors.inkSoft, alignItems: 'center', justifyContent: 'center' },
  bigBtnPlus: { backgroundColor: colors.signal },
  bigQty: { fontSize: 52, fontWeight: '800', color: colors.white, minWidth: 90, textAlign: 'center' },
  stockValue: { color: '#AEB8CA', fontSize: 13 },
  panel: { backgroundColor: colors.card, borderRadius: radius.md, paddingHorizontal: spacing.lg, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.lg },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  infoLabel: { flex: 1, fontSize: 14, color: colors.textMuted },
  infoValue: { fontSize: 15, fontWeight: '700', color: colors.text },
  editBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.ink, height: 50, borderRadius: radius.md, marginBottom: spacing.sm },
  editText: { color: colors.white, fontSize: 15, fontWeight: '700' },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, height: 50, borderRadius: radius.md, borderWidth: 1, borderColor: colors.danger },
  deleteText: { color: colors.danger, fontSize: 15, fontWeight: '700' },
});
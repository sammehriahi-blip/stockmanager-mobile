import { useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import FormField from '../components/FormField';
import FilterChip from '../components/FilterChip';
import { useProducts } from '../context/ProductsContext';
import { CATEGORIES } from '../data/mockProducts';
import { validateProduct } from '../utils/validation';
import { colors, radius, spacing } from '../theme';

const EMPTY = { name: '', reference: '', category: '', quantity: '', price: '', supplier: '', barcode: '' };

export default function ProductFormScreen({ route, navigation }) {
  const { products, getProduct, addProduct, updateProduct } = useProducts();
  const editingId = route.params?.id;
  const existing = editingId ? getProduct(editingId) : null;

  const [values, setValues] = useState(
    existing
      ? { ...existing, quantity: String(existing.quantity), price: String(existing.price), barcode: existing.barcode || '' }
      : { ...EMPTY, barcode: route.params?.barcode || '' }
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: existing ? 'Modifier le produit' : 'Nouveau produit' });
  }, [navigation, existing]);

  const set = (field) => (text) => {
    setValues((v) => ({ ...v, [field]: text }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const save = async () => {
    const found = validateProduct(values, products, editingId);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const product = {
      name: values.name.trim(),
      reference: values.reference.trim().toUpperCase(),
      category: values.category,
      quantity: Number(values.quantity),
      price: Number(String(values.price).replace(',', '.')),
      supplier: values.supplier.trim(),
      barcode: (values.barcode || '').trim(),
    };

    setSaving(true);
    try {
      if (existing) await updateProduct(editingId, product);
      else await addProduct(product);
      navigation.goBack();
    } catch (err) {
      if (err.errors) setErrors(err.errors);
      else Alert.alert('Enregistrement impossible', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <ScrollView style={styles.screen} contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }} keyboardShouldPersistTaps="handled">
        <FormField label="Nom du produit" placeholder="Clavier Logitech K120" value={values.name} onChangeText={set('name')} error={errors.name} />
        <FormField label="Référence" placeholder="ELEC-004" autoCapitalize="characters" value={values.reference} onChangeText={set('reference')} error={errors.reference} />

        <Text style={styles.label}>Catégorie</Text>
        <View style={styles.chips}>
          {CATEGORIES.map((c) => (
            <View key={c} style={{ marginBottom: spacing.sm }}>
              <FilterChip label={c} active={values.category === c} onPress={() => set('category')(c)} />
            </View>
          ))}
        </View>
        {errors.category ? <Text style={styles.error}>{errors.category}</Text> : null}

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <FormField label="Quantité" placeholder="10" keyboardType="number-pad" value={values.quantity} onChangeText={set('quantity')} error={errors.quantity} />
          </View>
          <View style={{ flex: 1 }}>
            <FormField label="Prix unitaire (DT)" placeholder="45" keyboardType="decimal-pad" value={values.price} onChangeText={set('price')} error={errors.price} />
          </View>
        </View>

        <FormField label="Fournisseur" placeholder="TechPro" value={values.supplier} onChangeText={set('supplier')} error={errors.supplier} />
        <FormField
          label="Code-barres (optionnel)"
          placeholder="Scannez depuis l'onglet Scanner"
          keyboardType="number-pad"
          value={values.barcode}
          onChangeText={set('barcode')}
          error={errors.barcode}
        />

        <Pressable onPress={save} disabled={saving} style={({ pressed }) => [styles.saveBtn, (pressed || saving) && { opacity: 0.7 }]}>
          {saving ? (
            <ActivityIndicator color={colors.ink} />
          ) : (
            <Text style={styles.saveText}>{existing ? 'Enregistrer les modifications' : 'Ajouter le produit'}</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  label: { fontSize: 13, fontWeight: '700', color: colors.inkSoft, marginBottom: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  error: { color: colors.danger, fontSize: 12, fontWeight: '600', marginBottom: spacing.md },
  row: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  saveBtn: { backgroundColor: colors.signal, height: 52, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginTop: spacing.sm },
  saveText: { color: colors.ink, fontSize: 16, fontWeight: '800' },
});

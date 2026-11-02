import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import EmptyState from '../components/EmptyState';
import { productService } from '../services/productService';
import { colors, radius, spacing } from '../theme';

const BARCODE_TYPES = ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'qr'];

export default function ScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [locked, setLocked] = useState(false);
  const [searching, setSearching] = useState(false);
  const [torch, setTorch] = useState(false);
  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      setLocked(false);
    }, [])
  );

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.ink} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <EmptyState
          icon="camera-outline"
          title="Accès à la caméra"
          message="La caméra est nécessaire pour scanner les codes-barres des produits."
          actionLabel="Autoriser la caméra"
          onAction={requestPermission}
        />
      </View>
    );
  }

  const handleScan = async ({ data }) => {
    if (locked) return;
    setLocked(true);
    setSearching(true);
    try {
      const product = await productService.getByBarcode(data);
      navigation.navigate('ProductDetail', { id: product.id });
    } catch (err) {
      if (err.status === 404) {
        Alert.alert('Produit inconnu', `Aucun produit ne correspond au code ${data}.`, [
          { text: 'Annuler', style: 'cancel', onPress: () => setLocked(false) },
          { text: 'Créer le produit', onPress: () => navigation.navigate('ProductForm', { barcode: data }) },
        ]);
      } else {
        Alert.alert('Erreur', err.message, [{ text: 'OK', onPress: () => setLocked(false) }]);
      }
    } finally {
      setSearching(false);
    }
  };

  return (
    <View style={styles.screen}>
      {isFocused && (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          enableTorch={torch}
          barcodeScannerSettings={{ barcodeTypes: BARCODE_TYPES }}
          onBarcodeScanned={locked ? undefined : handleScan}
        />
      )}

      <View style={styles.overlay} pointerEvents="box-none">
        <Text style={styles.hint}>Placez le code-barres dans le cadre</Text>
        <View style={styles.frame}>
          <View style={[styles.corner, styles.tl]} />
          <View style={[styles.corner, styles.tr]} />
          <View style={[styles.corner, styles.bl]} />
          <View style={[styles.corner, styles.br]} />
          {searching && <ActivityIndicator size="large" color={colors.signal} />}
        </View>
        <Pressable onPress={() => setTorch((t) => !t)} style={styles.torch}>
          <Ionicons name={torch ? 'flashlight' : 'flashlight-outline'} size={22} color={colors.ink} />
          <Text style={styles.torchText}>{torch ? 'Éteindre la lampe' : 'Allumer la lampe'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const CORNER = 28;
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg, padding: spacing.xl },
  overlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', gap: spacing.xl },
  hint: { color: colors.white, fontSize: 15, fontWeight: '700', backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.pill, overflow: 'hidden' },
  frame: { width: 270, height: 170, alignItems: 'center', justifyContent: 'center' },
  corner: { position: 'absolute', width: CORNER, height: CORNER, borderColor: colors.signal },
  tl: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: radius.md },
  tr: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: radius.md },
  bl: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: radius.md },
  br: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: radius.md },
  torch: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.signal, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radius.pill },
  torchText: { color: colors.ink, fontWeight: '800' },
});
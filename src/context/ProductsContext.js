import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { productService } from '../services/productService';

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState(0); // change après chaque modification

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const [allProducts, dashboard] = await Promise.all([productService.getAll(), productService.getDashboard()]);
      setProducts(allProducts);
      setStats(dashboard);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const afterChange = useCallback(async () => {
    setVersion((v) => v + 1);
    await refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      products,
      stats,
      loading,
      error,
      version,
      refresh,
      getProduct: (id) => products.find((p) => p.id === id),

      addProduct: async (data) => {
        const created = await productService.create(data);
        await afterChange();
        return created;
      },

      updateProduct: async (id, data) => {
        const updated = await productService.update(id, data);
        await afterChange();
        return updated;
      },
      deleteProduct: async (id) => {
        await productService.remove(id);
        await afterChange();
      },

      // Mise à jour optimiste : l'écran change tout de suite, puis l'API confirme.
      adjustStock: async (id, delta) => {
        setProducts((list) => list.map((p) => (p.id === id ? { ...p, quantity: Math.max(0, p.quantity + delta) } : p)));
        try {
          await productService.updateStock(id, delta);
        } catch (err) {
          Alert.alert('Stock non modifié', err.message);
        }
        await afterChange();
      },
    }),
    [products, stats, loading, error, version, refresh, afterChange]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts doit être utilisé dans ProductsProvider');
  return ctx;
}

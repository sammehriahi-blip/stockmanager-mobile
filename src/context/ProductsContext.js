// State global : produits + historique des mouvements.
// En J9, ces actions appelleront l'API au lieu de modifier les données locales.
import { createContext, useContext, useMemo, useReducer } from 'react';
import { mockProducts, CATEGORIES } from '../data/mockProducts';
import { getStockStatus } from '../utils/stock';

const ProductsContext = createContext(null);

const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

function movement(product, delta, type) {
  return { id: newId(), productId: product.id, productName: product.name, delta, type, date: new Date().toISOString() };
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const product = { ...action.product, id: newId() };
      return {
        products: [product, ...state.products],
        movements: [movement(product, product.quantity, 'creation'), ...state.movements],
      };
    }
    case 'UPDATE':
      return {
        ...state,
        products: state.products.map((p) => (p.id === action.product.id ? action.product : p)),
      };
    case 'DELETE':
      return { ...state, products: state.products.filter((p) => p.id !== action.id) };
    case 'ADJUST': {
      const product = state.products.find((p) => p.id === action.id);
      if (!product) return state;
      const quantity = product.quantity + action.delta;
      if (quantity < 0) return state;
      return {
        products: state.products.map((p) => (p.id === action.id ? { ...p, quantity } : p)),
        movements: [movement(product, action.delta, action.delta > 0 ? 'entree' : 'sortie'), ...state.movements],
      };
    }
    default:
      return state;
  }
}

export function ProductsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { products: mockProducts, movements: [] });

  const stats = useMemo(() => {
    const { products } = state;
    const byCategory = CATEGORIES.map((category) => {
      const items = products.filter((p) => p.category === category);
      return {
        category,
        count: items.length,
        value: items.reduce((sum, p) => sum + p.quantity * p.price, 0),
      };
    });
    return {
      totalProducts: products.length,
      totalUnits: products.reduce((sum, p) => sum + p.quantity, 0),
      totalValue: products.reduce((sum, p) => sum + p.quantity * p.price, 0),
      lowStock: products.filter((p) => getStockStatus(p.quantity) === 'bas'),
      outOfStock: products.filter((p) => getStockStatus(p.quantity) === 'rupture'),
      byCategory,
    };
  }, [state]);

  const value = useMemo(
    () => ({
      products: state.products,
      movements: state.movements,
      stats,
      getProduct: (id) => state.products.find((p) => p.id === id),
      addProduct: (product) => dispatch({ type: 'ADD', product }),
      updateProduct: (product) => dispatch({ type: 'UPDATE', product }),
      deleteProduct: (id) => dispatch({ type: 'DELETE', id }),
      adjustStock: (id, delta) => dispatch({ type: 'ADJUST', id, delta }),
    }),
    [state, stats]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts doit être utilisé dans ProductsProvider');
  return ctx;
}

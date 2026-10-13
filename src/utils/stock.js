import { colors } from '../theme';

export const LOW_STOCK_THRESHOLD = 5;

export function getStockStatus(quantity) {
  if (quantity === 0) return 'rupture';
  if (quantity < LOW_STOCK_THRESHOLD) return 'bas';
  return 'disponible';
}

export const STATUS_META = {
  disponible: { label: 'Disponible', color: colors.success, bg: colors.successBg, icon: 'checkmark-circle' },
  bas: { label: 'Stock bas', color: colors.warning, bg: colors.warningBg, icon: 'alert-circle' },
  rupture: { label: 'Rupture', color: colors.danger, bg: colors.dangerBg, icon: 'close-circle' },
};

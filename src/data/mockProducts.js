// Données de test (remplacées par l'API MongoDB en J9)
export const CATEGORIES = ['Électronique', 'Mobilier', 'Consommable', 'Fournitures'];

export const CATEGORY_ICONS = {
  'Électronique': 'hardware-chip-outline',
  'Mobilier': 'bed-outline',
  'Consommable': 'document-outline',
  'Fournitures': 'pencil-outline',
};

export const mockProducts = [
  { id: '1', name: 'Clavier Logitech K120', reference: 'ELEC-001', category: 'Électronique', quantity: 25, price: 45, supplier: 'TechPro' },
  { id: '2', name: 'Écran Samsung 24"', reference: 'ELEC-002', category: 'Électronique', quantity: 8, price: 320, supplier: 'TechPro' },
  { id: '3', name: 'Souris sans fil', reference: 'ELEC-003', category: 'Électronique', quantity: 4, price: 30, supplier: 'TechPro' },
  { id: '4', name: 'Chaise de bureau', reference: 'MOB-001', category: 'Mobilier', quantity: 3, price: 180, supplier: 'OfficePlus' },
  { id: '5', name: 'Bureau 120 cm', reference: 'MOB-002', category: 'Mobilier', quantity: 6, price: 260, supplier: 'OfficePlus' },
  { id: '6', name: 'Ramette papier A4', reference: 'CONS-001', category: 'Consommable', quantity: 0, price: 12, supplier: 'PaperCo' },
  { id: '7', name: 'Cartouche encre noire', reference: 'CONS-002', category: 'Consommable', quantity: 14, price: 38, supplier: 'PaperCo' },
  { id: '8', name: 'Stylos bleus (boîte)', reference: 'FOUR-001', category: 'Fournitures', quantity: 2, price: 6, supplier: 'PaperCo' },
  { id: '9', name: 'Classeurs A4', reference: 'FOUR-002', category: 'Fournitures', quantity: 40, price: 4.5, supplier: 'PaperCo' },
];

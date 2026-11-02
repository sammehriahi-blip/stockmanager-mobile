export function validateProduct(values, products, editingId) {
  const errors = {};
  const quantity = Number(values.quantity);
  const price = Number(String(values.price).replace(',', '.'));

  if (!values.name.trim()) errors.name = 'Le nom est obligatoire';
  if (!values.reference.trim()) {
    errors.reference = 'La référence est obligatoire';
  } else {
    const ref = values.reference.trim().toUpperCase();
    const taken = products.some((p) => p.reference.toUpperCase() === ref && p.id !== editingId);
    if (taken) errors.reference = 'Cette référence existe déjà';
  }
  if (!values.category) errors.category = 'Choisissez une catégorie';
  if (values.quantity === '' || !Number.isInteger(quantity) || quantity < 0) {
    errors.quantity = 'La quantité doit être un entier positif';
  }
  if (values.price === '' || Number.isNaN(price) || price <= 0) {
    errors.price = 'Le prix doit être supérieur à 0';
  }
  if (!values.supplier.trim()) errors.supplier = 'Le fournisseur est obligatoire';

  return errors;
}

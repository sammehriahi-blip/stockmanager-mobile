export function formatPrice(value) {
  const [int, dec] = Number(value).toFixed(2).split('.');
  const withSpaces = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return dec === '00' ? `${withSpaces} DT` : `${withSpaces},${dec} DT`;
}

export function formatDate(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} à ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

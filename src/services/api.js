import { API_URL } from '../config';

const TIMEOUT_MS = 8000;

// Toutes les requêtes HTTP passent par ici : un seul endroit pour gérer les erreurs.
export async function request(path, { method = 'GET', body } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch {
    throw new Error("Serveur injoignable. Vérifiez que l'API est lancée et que le téléphone est sur le même Wi-Fi que le PC.");
  } finally {
    clearTimeout(timer);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || `Erreur ${res.status}`);
    error.status = res.status;
    error.errors = data.errors;
    throw error;
  }
  return data;
}

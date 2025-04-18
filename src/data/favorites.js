const API_URL = import.meta.env.VITE_BACKEND_URL;

if (!API_URL) {
  throw new Error('API URL is required. Did you forget to set VITE_BACKEND_URL in your .env?');
}

const baseURL = `${API_URL}/favorites/items`;

/**
 * Add a favorite item (product or recipe)
 * @param {Object} item - full item object
 */
export const addFavorite = async (item) => {
  const payload = {
    type: "product", // or "recipe", adjust if needed
    data: {
      referenceId: item.referenceId || item.id,
      name: item.name,
      brand: item.brand || "",
      category: item.category || "other",
      nutrition: item.nutrition || {},
      source: item.source || "usda",
    },
  };

  const res = await fetch(baseURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.error || 'Failed to add favorite item');
  }

  return res.json();
};

/**
 * Get all favorites (optionally filtered by type)
 * @param {string} type - optional, e.g. "product" or "recipe"
 */
export const getFavorites = async (type = "") => {
  const res = await fetch(`${baseURL}?type=${type}`, {
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.error || 'Failed to fetch favorite items');
  }

  return res.json();
};

/**
 * Remove all favorites by referenceId (and type)
 * @param {string|number} referenceId
 * @param {string} type
 */
export const removeFavoritesByReferenceId = async (referenceId, type) => {
  const res = await fetch(`${baseURL}/by-reference`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ referenceId, type }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.error || 'Failed to remove favorite');
  }
};

// src/services/openFoodFacts.js
const BASE = import.meta.env.VITE_OFF_BASE_URL || 'https://world.openfoodfacts.org';

const safeGet = (obj, path, fallback = null) => {
  try {
    return path.split('.').reduce((a, c) => a?.[c], obj) ?? fallback;
  } catch {
    return fallback;
  }
};

// Normalize OpenFoodFacts product
export const normalizeProduct = (p) => {
  const nutriments = p.nutriments || {};
  const servingSize = p.serving_size || '';
  const quantity = p.quantity || '';
  const image = p.image_front_url || p.image_url || '';
  const brand = (p.brands_tags && p.brands_tags[0]) || p.brands || '';
  const categories = (p.categories_tags || []).map((c) => c.split(':').pop());
  const additives = (p.additives_tags || []).map((a) => a.split(':').pop());
  const nutriScore = p.nutriscore_grade || p.nutri_score_grade || p.nutriscore_grade_fr || null;
  const ecoScore = p.ecoscore_grade || null;
  const ecoScoreScore = p.ecoscore_score || null;
  const carbonFootprint = safeGet(p, 'eco_score_data.carbon_footprint.packaging', null)
    ?? safeGet(p, 'carbon-footprint', null)
    ?? safeGet(p, 'carbon_footprint', null);

  return {
    code: p.code,
    name: p.product_name || p.product_name_en || p.generic_name || 'Unknown product',
    brand,
    image,
    quantity,
    servingSize,
    categories,
    additives,
    nutriScore,
    ecoScore,
    ecoScoreScore,
    nutriments: {
      energy_kcal_100g: nutriments['energy-kcal_100g'] ?? nutriments.energy_100g ?? null,
      fat_100g: nutriments.fat_100g ?? null,
      saturated_fat_100g: nutriments['saturated-fat_100g'] ?? null,
      carbohydrates_100g: nutriments.carbohydrates_100g ?? null,
      sugars_100g: nutriments.sugars_100g ?? null,
      fiber_100g: nutriments.fiber_100g ?? null,
      proteins_100g: nutriments.proteins_100g ?? null,
      salt_100g: nutriments.salt_100g ?? null,
      sodium_100g: nutriments.sodium_100g ?? null
    },
    carbonFootprint,
    raw: p
  };
};

export const fetchByBarcode = async (barcode) => {
  const url = `${BASE}/api/v0/product/${encodeURIComponent(barcode)}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch product');
  const json = await res.json();
  if (json.status !== 1 || !json.product) throw new Error('Product not found');
  return normalizeProduct(json.product);
};

export const searchProducts = async (query, page = 1, pageSize = 10) => {
  const url = `${BASE}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page=${page}&page_size=${pageSize}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Search failed');
  const json = await res.json();
  const products = (json.products || []).map(normalizeProduct);
  return { products, count: json.count || products.length };
};

// Simple alternatives: same main category, better nutri or eco score
export const fetchAlternatives = async (categories = [], currentNutri, currentEco, limit = 8) => {
  const primary = categories?.[0];
  if (!primary) return [];
  const { products } = await searchProducts(primary, 1, 100);
  const rankGrade = (g) => {
    const map = { a: 5, b: 4, c: 3, d: 2, e: 1 };
    return map[(g || '').toLowerCase()] ?? 0;
  };
  const currNutriRank = rankGrade(currentNutri);
  const currEcoRank = rankGrade(currentEco);

  const filtered = products
    .filter((p) => p.image && p.nutriScore && p.ecoScore)
    .filter((p) => rankGrade(p.nutriScore) >= currNutriRank || rankGrade(p.ecoScore) >= currEcoRank)
    .sort((a, b) => (rankGrade(b.nutriScore) + rankGrade(b.ecoScore)) - (rankGrade(a.nutriScore) + rankGrade(a.ecoScore)));

  return filtered.slice(0, limit);
};
// src/pages/Home.jsx
import React, { useState } from 'react';
import Scanner from '../components/scanner.jsx';
import ProductCard from '../components/ProductCard.jsx';
import AlternativesCarousel from '../components/AlternativesCarousel.jsx';
import EcoPoints from '../components/EcoPoints.jsx';
import { fetchByBarcode, searchProducts, fetchAlternatives } from '../services/openFoodFacts.js';

export default function Home() {
  const [product, setProduct] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLookup = async ({ barcode, query }) => {
    setError('');
    setLoading(true);
    try {
      let p = null;
      if (barcode) {
        p = await fetchByBarcode(barcode);
      } else if (query) {
        const res = await searchProducts(query, 1, 20);
        p = res.products[0] || null;
        if (!p) throw new Error('No products found for that query');
      }
      setProduct(p);
      const alts = await fetchAlternatives(p.categories, p.nutriScore, p.ecoScore, 8);
      setAlternatives(alts);
      // persist history
      const hist = JSON.parse(localStorage.getItem('history') || '[]');
      localStorage.setItem('history', JSON.stringify([{ ts: Date.now(), product: p }, ...hist].slice(0, 50)));
    } catch (e) {
      setError(e.message || 'Something went wrong');
      setProduct(null);
      setAlternatives([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Scanner onLookup={handleLookup} />
      {loading && <div className="card">Loading…</div>}
      {error && <div className="card error">{error}</div>}
      {product && (
        <>
          <ProductCard product={product} />
          <EcoPoints product={product} />
          <AlternativesCarousel
            current={product}
            alternatives={alternatives}
            onChoose={(alt) => {
              setProduct(alt);
              // award bonus points on choosing alternative
              const bonus = parseInt(localStorage.getItem('ecoPoints') || '0', 10) + 15;
              localStorage.setItem('ecoPoints', String(bonus));
            }}
          />
        </>
      )}
    </div>
  );
}
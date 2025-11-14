// src/components/ProductCard.jsx
import React from 'react';
import EcoScoreBadge from './EcoScoreBadge.jsx';
import AdditivesList from './AdditivesList.jsx';
import NutritionChart from './NutritionChart.jsx';
import { deriveHealthGrade, estimateCO2ePer100g } from '../utils/scoring.js';
import { formatKgCO2e, titleCase } from '../utils/format.js';

export default function ProductCard({ product }) {
  const { name, brand, image, quantity, servingSize, nutriments, nutriScore, ecoScore, carbonFootprint } = product;
  const health = deriveHealthGrade(nutriScore, nutriments);
  const co2 = estimateCO2ePer100g(ecoScore, carbonFootprint);

  return (
    <div className="card product">
      <div className="product-header">
        <img src={image} alt={name} />
        <div className="product-title">
          <h2>{name}</h2>
          <p>{brand ? brand : '—'} {quantity ? `• ${quantity}` : ''} {servingSize ? `• ${servingSize}` : ''}</p>
          <div className="badges">
            <EcoScoreBadge label="Nutri-Score" grade={nutriScore} />
            <EcoScoreBadge label="Eco-Score" grade={ecoScore} />
            <span className="health-pill" style={{ backgroundColor: health.color }}>
              Health grade: {health.label}
            </span>
            <span className="co2-pill">{formatKgCO2e(co2)}</span>
          </div>
        </div>
      </div>

      <div className="grid-two">
        <div className="panel">
          <h3>Nutrition overview (per 100g)</h3>
          <NutritionChart nutriments={nutriments} />
          <div className="nutri-table">
            {Object.entries(nutriments).map(([k, v]) => (
              v != null && (
                <div key={k} className="nutri-row">
                  <span>{titleCase(k.replace('_100g', ''))}</span>
                  <span>{v}</span>
                </div>
              )
            ))}
          </div>
        </div>

        <div className="panel">
          <h3>Additives</h3>
          <AdditivesList product={product} />
        </div>
      </div>
    </div>
  );
}
// src/components/AlternativesCarousel.jsx
import React from 'react';
import EcoScoreBadge from './EcoScoreBadge.jsx';
import { titleCase } from '../utils/format.js';

export default function AlternativesCarousel({ current, alternatives = [], onChoose }) {
  if (!alternatives.length) {
    return (
      <div className="card">
        <h3>Alternative suggestions</h3>
        <p>No close alternatives found. Try searching a broader category.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>Alternative suggestions</h3>
      <div className="carousel">
        {alternatives.map((p) => (
          <div key={p.code} className="alt-card">
            <img src={p.image} alt={p.name} />
            <div className="alt-body">
              <strong className="line-clamp">{p.name}</strong>
              <div className="alt-badges">
                <EcoScoreBadge label="Nutri" grade={p.nutriScore} />
                <EcoScoreBadge label="Eco" grade={p.ecoScore} />
              </div>
              <button className="secondary" onClick={() => onChoose(p)}>
                Choose this
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="note">
        Picks are filtered from the same category and ranked by better Nutri/Eco scores.
      </p>
    </div>
  );
}
// src/pages/History.jsx
import React from 'react';
import { titleCase } from '../utils/format.js';
import { gradeBadgeColor } from '../utils/scoring.js';

export default function History() {
  const history = JSON.parse(localStorage.getItem('history') || '[]');
  return (
    <div className="container">
      <div className="card">
        <h2>Scan history</h2>
        {!history.length && <p>No scans yet. Try scanning a barcode.</p>}
        <ul className="history-list">
          {history.map(({ ts, product }) => (
            <li key={ts} className="history-item">
              <img src={product.image} alt={product.name} />
              <div>
                <strong>{product.name}</strong>
                <div className="meta">
                  <span style={{ backgroundColor: gradeBadgeColor(product.nutriScore) }}>
                    Nutri: {titleCase(product.nutriScore)}
                  </span>
                  <span style={{ backgroundColor: gradeBadgeColor(product.ecoScore) }}>
                    Eco: {titleCase(product.ecoScore)}
                  </span>
                  <span>{new Date(ts).toLocaleString()}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

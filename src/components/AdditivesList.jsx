// src/components/AdditivesList.jsx
import React from 'react';
import { pluralize, titleCase } from '../utils/format.js';

const additiveInfo = (tag) => {
  // e.g., "en:e330" -> "E330"
  const code = tag.toUpperCase().replace(/^EN:/, '').replace(/^E/, 'E');
  return { code, risk: null };
};

export default function AdditivesList({ product }) {
  const additivesTags = product.raw.additives_tags || [];
  const count = additivesTags.length;

  return (
    <div>
      <p>
        {count ? `${count} ${pluralize('additive', count)} reported.` : 'No additives listed.'}
        {count ? ' Lower additives generally correlate with cleaner labels.' : ''}
      </p>
      {count > 0 && (
        <ul className="additives-list">
          {additivesTags.map((t) => {
            const { code } = additiveInfo(t);
            return (
              <li key={t}>
                <span className="additive-code">{code}</span>
                <span className="additive-name">{titleCase(t.split(':').pop())}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
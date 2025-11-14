// src/components/EcoScoreBadge.jsx
import React from 'react';
import { gradeBadgeColor } from '../utils/scoring.js';
import { titleCase } from '../utils/format.js';

export default function EcoScoreBadge({ label, grade }) {
  const color = gradeBadgeColor(grade);
  return (
    <span className="badge" style={{ backgroundColor: color }}>
      {label}: {grade ? titleCase(grade) : 'Unknown'}
    </span>
  );
}
// src/utils/format.js
export const formatKgCO2e = (value) => `${value.toFixed(2)} kg CO₂e / 100g`;
export const pluralize = (word, count) => `${word}${count === 1 ? '' : 's'}`;
export const titleCase = (str) => (str || '').split(/[_-]/).join(' ').replace(/\b\w/g, (c) => c.toUpperCase());

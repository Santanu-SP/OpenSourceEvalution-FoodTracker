// src/components/NutritionChart.jsx
import React, { useMemo } from 'react';
import { Doughnut, Radar } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler);

export default function NutritionChart({ nutriments }) {
  const macros = useMemo(() => {
    const carbs = nutriments.carbohydrates_100g ?? 0;
    const protein = nutriments.proteins_100g ?? 0;
    const fat = nutriments.fat_100g ?? 0;
    return { carbs, protein, fat };
  }, [nutriments]);

  const radarData = useMemo(() => ({
    labels: ['Sugars', 'Sat Fat', 'Fiber', 'Salt'],
    datasets: [{
      label: 'Nutrients (per 100g)',
      data: [
        nutriments.sugars_100g ?? 0,
        nutriments.saturated_fat_100g ?? 0,
        nutriments.fiber_100g ?? 0,
        nutriments.salt_100g ?? (nutriments.sodium_100g ? nutriments.sodium_100g * 2.5 : 0)
      ],
      backgroundColor: 'rgba(34,197,94,0.2)',
      borderColor: 'rgba(34,197,94,1)'
    }]
  }), [nutriments]);

  return (
    <div className="charts">
      <div className="chart">
        <Doughnut
          data={{
            labels: ['Carbs', 'Protein', 'Fat'],
            datasets: [{
              data: [macros.carbs, macros.protein, macros.fat],
              backgroundColor: ['#60a5fa', '#34d399', '#f59e0b']
            }]
          }}
          options={{ plugins: { legend: { position: 'bottom' } } }}
        />
      </div>
      <div className="chart">
        <Radar
          data={radarData}
          options={{
            scales: { r: { beginAtZero: true, suggestedMax: 15 } },
            plugins: { legend: { display: false } }
          }}
        />
      </div>
    </div>
  );
}
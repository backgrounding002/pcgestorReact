import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const EquiposChart = () => {
  const data = {
    labels: ['Activos', 'En mantenimiento', 'Dados de baja'],
    datasets: [
      {
        data: [120, 18, 8],
        backgroundColor: ['#2ecc71', '#f39c12', '#e74c3c'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="card shadow">
      <div className="card-header">Equipos por estado</div>
      <div className="card-body">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default EquiposChart;
import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const BarChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const maxExpense = Math.max(...data.datasets[0].data);

    const ctx = chartRef.current.getContext('2d');
    const chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: data.datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: maxExpense,
            ticks: {
              padding: 5,
              // Format the y-axis ticks
              callback: function(value) {
                if (value >= 1000) {
                  return (value / 1000).toFixed(0) + 'k'; // Converts 10000 to 10k
                }
                return value; // Returns the value as is for numbers less than 1000
              },
            },
          },
          x: {
            ticks: {
              padding: 5,
            },
          },
        },
      },
    });

    return () => {
      chartInstance.destroy();
    };
  }, [data]);

  return (
    <div className="chart-container">
      <canvas ref={chartRef} width={100} height={400} />
    </div>
  );
};

export default BarChart;

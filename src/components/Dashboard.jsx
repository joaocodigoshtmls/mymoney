import React from 'react';
import { loadData } from '../services/storage';
import styles from './Dashboard.module.css';
import {
  Chart as ChartJS,
  LineElement,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler // Plugin necessário para 'fill: true'
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  LineElement,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler // Registro do plugin Filler
);

export default function Dashboard() {
  const { transactions } = loadData();

  const hoje = new Date();
  const dias = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(hoje.getDate() - (29 - i));
    return d.toISOString().slice(0, 10);
  });

  const entradasPorDia = {};
  const saidasPorDia = {};

  dias.forEach(d => {
    entradasPorDia[d] = 0;
    saidasPorDia[d] = 0;
  });

  transactions.forEach(tx => {
    const data = new Date(tx.date).toISOString().slice(0, 10);
    if (dias.includes(data)) {
      if (tx.type === 'entrada') {
        entradasPorDia[data] += tx.value;
      } else if (tx.type === 'saida') {
        saidasPorDia[data] += tx.value;
      }
    }
  });

  const totalEntrada = Object.values(entradasPorDia).reduce((a, b) => a + b, 0);
  const totalSaida = Object.values(saidasPorDia).reduce((a, b) => a + b, 0);
  const saldo = totalEntrada - totalSaida;

  const lineChartData = {
    labels: dias.map((d, i) => {
      const data = new Date(d);
      return i % 5 === 0 ? data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : '';
    }),
    datasets: [
      {
        label: 'Entradas',
        data: dias.map(d => entradasPorDia[d]),
        borderColor: '#4ade80',
        backgroundColor: 'rgba(74, 222, 128, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 0
      },
      {
        label: 'Saídas',
        data: dias.map(d => saidasPorDia[d]),
        borderColor: '#f87171',
        backgroundColor: 'rgba(248, 113, 113, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 0
      }
    ]
  };

  const doughnutData = {
    labels: ['Entradas', 'Saídas', 'Saldo'],
    datasets: [
      {
        data: [totalEntrada, totalSaida, saldo],
        backgroundColor: ['#4ade80', '#f87171', '#7c3aed'],
        borderWidth: 1,
        cutout: '60%'
      }
    ]
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard</h1>

      <div className={styles.grid}>
        <div className={`${styles.card} ${styles.cardEntrada}`}>
          <h2>💸 Entradas</h2>
          <p>R$ {totalEntrada.toFixed(2)}</p>
        </div>

        <div className={`${styles.card} ${styles.cardSaida}`}>
          <h2>💰 Saídas</h2>
          <p>R$ {totalSaida.toFixed(2)}</p>
        </div>

        <div className={`${styles.card} ${styles.cardSaldo}`}>
          <h2>📊 Saldo</h2>
          <p>R$ {saldo.toFixed(2)}</p>
        </div>
      </div>

      <div className={styles.graphSection}>
        <div className={styles.lineBox}>
          <h2>📈 Entradas e Saídas (últimos 30 dias)</h2>
          <Line
            data={lineChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    color: '#333',
                    font: { size: 12, weight: 'bold' }
                  }
                }
              },
              scales: {
                x: {
                  ticks: { color: '#666' },
                  grid: { display: false }
                },
                y: {
                  ticks: { color: '#666' },
                  grid: { color: '#e0e0e0' }
                }
              }
            }}
          />
        </div>

        <div className={styles.donutBox}>
          <h2>📊 Distribuição</h2>
          <Doughnut
            data={doughnutData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    color: '#333',
                    font: { size: 12 }
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

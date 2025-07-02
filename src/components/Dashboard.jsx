import React, { useState } from 'react';
import { loadData } from '../services/storage';
import styles from './Dashboard.module.css';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Dashboard() {
  const { transactions } = loadData();

  const hoje = new Date();
  const dias = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(hoje.getDate() - (29 - i));
    return d.toISOString().slice(0, 10); // formato YYYY-MM-DD
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

  const chartData = {
    labels: dias.map(d => new Date(d).toLocaleDateString('pt-BR')),
    datasets: [
      {
        label: 'Entradas',
        data: dias.map(d => entradasPorDia[d]),
        backgroundColor: '#4ade80',
      },
      {
        label: 'Saídas',
        data: dias.map(d => saidasPorDia[d]),
        backgroundColor: '#f87171',
      },
    ],
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard</h1>

      <div className={styles.cardGrid}>
        <div className={`${styles.card} ${styles.entrada}`}>
          <h2>💸 Entradas</h2>
          <p>R$ {totalEntrada.toFixed(2)}</p>
        </div>
        <div className={`${styles.card} ${styles.saida}`}>
          <h2>💰 Saídas</h2>
          <p>R$ {totalSaida.toFixed(2)}</p>
        </div>
        <div className={`${styles.card} ${styles.saldo}`}>
          <h2>📊 Saldo</h2>
          <p>R$ {saldo.toFixed(2)}</p>
        </div>
      </div>

      <div className={styles.graphBox}>
        <h2 className={styles.graphTitle}>Entradas e saídas (últimos 30 dias)</h2>

        <div className={styles.chartWrapper}>
          <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
        </div>
      </div>
    </div>
  );
}

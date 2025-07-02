import React from 'react';
import { loadData } from '../services/storage';
import styles from './Dashboard.module.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const { transactions } = loadData();

  const totalEntrada = transactions
    .filter(tx => tx.type === 'entrada')
    .reduce((acc, tx) => acc + tx.value, 0);

  const totalSaida = transactions
    .filter(tx => tx.type === 'saida')
    .reduce((acc, tx) => acc + tx.value, 0);

  const saldo = totalEntrada - totalSaida;

  // Agrupar por categoria (só saídas)
  const categorias = {};
  transactions
    .filter(tx => tx.type === 'saida')
    .forEach(tx => {
      const cat = tx.category || 'Outros';
      categorias[cat] = (categorias[cat] || 0) + tx.value;
    });

  const chartData = {
    labels: Object.keys(categorias),
    datasets: [
      {
        label: 'Gastos por Categoria',
        data: Object.values(categorias),
        backgroundColor: [
          '#f87171',
          '#fb923c',
          '#facc15',
          '#4ade80',
          '#60a5fa',
          '#a78bfa',
          '#f472b6'
        ],
        borderWidth: 1,
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
        <div className={styles.card}>
          <h2>📊 Saldo</h2>
          <p>R$ {saldo.toFixed(2)}</p>
        </div>
      </div>

      <div className={styles.graphBox}>
        <h2 className={styles.graphTitle}>Gastos por categoria</h2>
        {Object.keys(categorias).length > 0 ? (
          <Pie data={chartData} />
        ) : (
          <p className={styles.semDados}>Nenhuma saída registrada.</p>
        )}
      </div>
    </div>
  );
}

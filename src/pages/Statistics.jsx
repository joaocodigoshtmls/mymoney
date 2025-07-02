import React, { useState } from 'react';
import { loadData } from '../services/storage';
import styles from './Statistics.module.css';
import buttonStyles from '../components/Buttons.module.css';

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

export default function Statistics() {
  const { transactions } = loadData();

  const [tipo, setTipo] = useState('saida');
  const [formato, setFormato] = useState('barra');

  const categorias = {};
  transactions
    .filter(tx => tx.type === tipo)
    .forEach(tx => {
      const cat = tx.category || 'Outros';
      categorias[cat] = (categorias[cat] || 0) + tx.value;
    });

  const chartData = {
    labels: Object.keys(categorias),
    datasets: [
      {
        label: tipo === 'entrada' ? 'Entradas por Categoria' : 'Saídas por Categoria',
        data: Object.values(categorias),
        backgroundColor: [
          '#4ade80',
          '#60a5fa',
          '#a78bfa',
          '#f472b6',
          '#f87171',
          '#facc15',
          '#fb923c',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Estatísticas</h1>

      <div className={styles.controls}>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className={`${styles.select} ${buttonStyles.botaoSecundario}`}
        >
          <option value="saida">Gasto por categoria</option>
          <option value="entrada">Entrada por categoria</option>
        </select>

        <select
          value={formato}
          onChange={(e) => setFormato(e.target.value)}
          className={`${styles.select} ${buttonStyles.botaoSecundario}`}
        >
          <option value="barra">Gráfico de barras</option>
          <option value="pizza">Gráfico de pizza</option>
        </select>
      </div>

      {Object.keys(categorias).length > 0 ? (
        <div className={styles.graphBox}>
          {formato === 'barra' ? (
            <Bar data={chartData} />
          ) : (
            <Pie data={chartData} />
          )}
        </div>
      ) : (
        <p className={styles.semDados}>
          Nenhuma {tipo === 'entrada' ? 'entrada' : 'saída'} registrada.
        </p>
      )}
    </div>
  );
}

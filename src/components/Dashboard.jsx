import React from 'react';
import { loadData } from '../services/storage';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { transactions, goals } = loadData();
  const balance = transactions.reduce((sum, tx) => sum + (tx.type === 'entrada' ? tx.value : -tx.value), 0);
  const income = transactions.filter(tx => tx.type === 'entrada').reduce((sum, tx) => sum + tx.value, 0);
  const expense = transactions.filter(tx => tx.type === 'saida').reduce((sum, tx) => sum + tx.value, 0);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard</h1>

      <div className={styles.cards}>
        <div className={`${styles.card} ${styles.green}`}>
          <h2>Saldo Atual</h2>
          <p>R$ {balance}</p>
        </div>
        <div className={`${styles.card} ${styles.blue}`}>
          <h2>Total de Entradas</h2>
          <p>R$ {income}</p>
        </div>
        <div className={`${styles.card} ${styles.red}`}>
          <h2>Total de Saídas</h2>
          <p>R$ {expense}</p>
        </div>
      </div>

      <h2 className={styles.subtitle}>Metas</h2>
      <div className={styles.goals}>
        {goals.map(goal => {
          const progress = Math.min((goal.saved / goal.amount) * 100, 100);
          return (
            <div key={goal.id} className={styles.goal}>
              <div className={styles.goalHeader}>
                <span>{goal.name}</span>
                <span>{progress.toFixed(0)}%</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
              </div>
              <p>R$ {goal.saved} de R$ {goal.amount}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

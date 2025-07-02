import React, { useState } from 'react';
import { loadData, saveData } from '../services/storage';
import styles from './Goals.module.css';

export default function Goals() {
  const { goals } = loadData();
  const [form, setForm] = useState({ name: '', amount: '', deadline: '' });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleCreate(e) {
    e.preventDefault();
    const goal = { id: Date.now(), ...form, amount: parseFloat(form.amount), saved: 0 };
    const data = loadData();
    data.goals.push(goal);
    saveData(data);
    window.location.reload();
  }

  function handleEdit(goalId) {
    const data = loadData();
    const g = data.goals.find(g => g.id === goalId);
    const newName = prompt('Novo nome da meta:', g.name);
    const newAmount = parseFloat(prompt('Novo valor desejado:', g.amount));
    const newDeadline = prompt('Novo prazo:', g.deadline);
    if (newName && !isNaN(newAmount) && newDeadline) {
      g.name = newName;
      g.amount = newAmount;
      g.deadline = newDeadline;
      saveData(data);
      window.location.reload();
    }
  }

  function addProgress(goalId) {
    const value = parseFloat(prompt('Valor para adicionar:'));
    if (!isNaN(value)) {
      const data = loadData();
      const g = data.goals.find(g => g.id === goalId);
      g.saved += value;
      saveData(data);
      window.location.reload();
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Metas</h1>
      <form className={styles.form} onSubmit={handleCreate}>
        <input name="name" placeholder="Nome da meta" value={form.name} onChange={handleChange} />
        <input name="amount" placeholder="Valor desejado" value={form.amount} onChange={handleChange} />
        <input name="deadline" type="date" value={form.deadline} onChange={handleChange} />
        <button type="submit">Criar meta</button>
      </form>
      <ul className={styles.list}>
        {goals.map(goal => {
          const progress = Math.min((goal.saved / goal.amount) * 100, 100);
          return (
            <li key={goal.id} className={styles.goalItem}>
              <div className={styles.goalHeader}>
                <span>{goal.name}</span>
                <span>{progress.toFixed(0)}%</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
              </div>
              <p>R$ {goal.saved} de R$ {goal.amount}</p>
              <button className={styles.addButton} onClick={() => addProgress(goal.id)}>Adicionar valor</button>
              <button className={styles.editButton} onClick={() => handleEdit(goal.id)}>Editar meta</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
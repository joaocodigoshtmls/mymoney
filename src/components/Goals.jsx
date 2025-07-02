import React, { useState } from 'react';
import { loadData, saveData } from '../services/storage';
import styles from './Goals.module.css';
import buttonStyles from './Buttons.module.css';

export default function Goals() {
  const { goals } = loadData();
  const [form, setForm] = useState({ name: '', target: '', date: '' });
  const [addValueMap, setAddValueMap] = useState({});

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.target || isNaN(parseFloat(form.target))) {
      alert('Preencha os dados corretamente.');
      return;
    }

    const goal = {
      ...form,
      target: parseFloat(form.target),
      current: 0,
      id: Date.now()
    };

    const data = loadData();
    data.goals.push(goal);
    saveData(data);
    window.location.reload();
  }

  function handleAddValue(id) {
    const value = parseFloat(addValueMap[id]);
    if (!value || isNaN(value)) return;

    const data = loadData();
    const goal = data.goals.find(g => g.id === id);
    if (!goal) return;

    goal.current += value;
    saveData(data);
    window.location.reload();
  }

  function handleDelete(id) {
    const data = loadData();
    data.goals = data.goals.filter(g => g.id !== id);
    saveData(data);
    window.location.reload();
  }

  function handleValueInputChange(id, e) {
    setAddValueMap(prev => ({ ...prev, [id]: e.target.value }));
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Metas</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Nome da meta"
          value={form.name}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          name="target"
          placeholder="Valor desejado"
          value={form.target}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className={styles.dateInput}
        />
        <div className={styles.botaoContainer}>
          <button type="submit" className={buttonStyles.botaoPrimario}>Criar meta</button>
        </div>
      </form>

      <ul className={styles.list}>
        {goals.map(goal => {
          const percentage = Math.min((goal.current / goal.target) * 100, 100);
          const completa = percentage >= 100;
          return (
            <li
              key={goal.id}
              className={`${styles.goalItem} ${completa ? styles.metaCompleta : ''}`}
            >
              <div className={styles.goalHeader}>
                <span className={styles.goalName}>🎯 {goal.name}</span>
                <span className={styles.goalValue}>
                  R$ {goal.current} de R$ {goal.target}
                </span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className={styles.goalFooter}>
                <span className={styles.goalDate}>
                  Prazo: {new Date(goal.date).toLocaleDateString('pt-BR')}
                </span>
                <div className={styles.footerButtons}>
                  <input
                    type="number"
                    placeholder="R$"
                    className={styles.inputAdd}
                    value={addValueMap[goal.id] || ''}
                    onChange={(e) => handleValueInputChange(goal.id, e)}
                  />
                  <button
                    onClick={() => handleAddValue(goal.id)}
                    type="button"
                    className={buttonStyles.botaoPrimario}
                  >
                    Adicionar
                  </button>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    type="button"
                    className={buttonStyles.botaoPerigo}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

import React, { useState } from 'react';
import { loadData, saveData } from '../services/storage';

export default function Goals() {
  const { transactions, goals } = loadData();
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
    <div>
      <h1>Metas</h1>
      <form onSubmit={handleCreate}>
        <input name="name" placeholder="Nome da meta" value={form.name} onChange={handleChange} />
        <input name="amount" placeholder="Valor desejado" value={form.amount} onChange={handleChange} />
        <input name="deadline" type="date" value={form.deadline} onChange={handleChange} />
        <button type="submit">Criar meta</button>
      </form>
      <ul>
        {goals.map(goal => {
          const progress = Math.min((goal.saved / goal.amount) * 100, 100);
          return (
            <li key={goal.id}>
              {goal.name} - {progress.toFixed(0)}% - R$ {goal.saved} de R$ {goal.amount}
              <button onClick={() => addProgress(goal.id)}>Adicionar valor</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
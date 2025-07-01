import React, { useState } from 'react';
import { loadData, saveData } from '../services/storage';

export default function Transactions() {
  const { transactions, goals } = loadData();
  const [form, setForm] = useState({ type: 'entrada', value: '', category: '', description: '', date: '' });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const tx = { ...form, value: parseFloat(form.value), id: Date.now() };
    const data = loadData();
    data.transactions.push(tx);
    saveData(data);
    window.location.reload();
  }

  return (
    <div>
      <h1>Transações</h1>
      <form onSubmit={handleSubmit}>
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>
        <input name="value" placeholder="Valor" value={form.value} onChange={handleChange} />
        <input name="category" placeholder="Categoria" value={form.category} onChange={handleChange} />
        <input name="description" placeholder="Descrição" value={form.description} onChange={handleChange} />
        <input name="date" type="date" value={form.date} onChange={handleChange} />
        <button type="submit">Salvar</button>
      </form>
      <ul>
        {transactions.map(tx => (
          <li key={tx.id}>{tx.date} - {tx.category} - R$ {tx.value} ({tx.type})</li>
        ))}
      </ul>
    </div>
  );
}
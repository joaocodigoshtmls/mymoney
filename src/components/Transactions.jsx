import React, { useState } from 'react';
import { loadData, saveData } from '../services/storage';
import styles from './Transactions.module.css';

export default function Transactions() {
  const { transactions } = loadData();
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

  function handleDelete(id) {
    const data = loadData();
    data.transactions = data.transactions.filter(tx => tx.id !== id);
    saveData(data);
    window.location.reload();
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Transações</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
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
      <ul className={styles.list}>
        {transactions.map(tx => (
          <li key={tx.id} className={styles.transactionItem}>
            <strong>{tx.date}</strong> - {tx.category} - R$ {tx.value} ({tx.type})
            <button onClick={() => handleDelete(tx.id)} className={styles.deleteButton}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
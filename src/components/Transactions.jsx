import React, { useState, useEffect } from 'react';
import { loadData, saveData } from '../services/storage';
import styles from './Transactions.module.css';
import buttonStyles from '../components/Buttons.module.css';

export default function Transactions() {
  const {
    transactions,
    categoriasEntrada = ['Outros'],
    categoriasSaida = ['Alimentação', 'Transporte', 'Lazer', 'Educação', 'Saúde', 'Outros'],
  } = loadData();

  const [form, setForm] = useState({
    type: 'entrada',
    value: '',
    category: '',
    description: '',
    date: ''
  });

  const [categoriasEntradaState, setCategoriasEntradaState] = useState(categoriasEntrada);
  const [categoriasSaidaState, setCategoriasSaidaState] = useState(categoriasSaida);

  useEffect(() => {
    const data = loadData();
    setCategoriasEntradaState(data.categoriasEntrada || []);
    setCategoriasSaidaState(data.categoriasSaida || []);
  }, []);

  const categoriasAtuais = form.type === 'entrada' ? categoriasEntradaState : categoriasSaidaState;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.value || isNaN(parseFloat(form.value))) {
      alert('Por favor, insira um valor válido.');
      return;
    }

    const tx = {
      ...form,
      value: parseFloat(form.value),
      date: new Date(form.date).toISOString(),
      id: Date.now()
    };

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
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>

        <input
          name="value"
          placeholder="Valor"
          value={form.value}
          onChange={handleChange}
          className={styles.input}
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="">Selecione uma categoria</option>
          {categoriasAtuais.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          name="description"
          placeholder="Descrição"
          value={form.description}
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
          <button type="submit" className={buttonStyles.botaoPrimario}>Salvar</button>
        </div>
      </form>

      <ul className={styles.list}>
        {transactions.map(tx => (
          <li
            key={tx.id}
            className={`${styles.transactionItem} ${tx.type === 'entrada' ? styles.bgEntrada : styles.bgSaida}`}
          >
            <div className={styles.transactionDate}>
              {new Date(tx.date).toLocaleDateString('pt-BR')}
            </div>

            <div className={styles.transactionValue}>
              {tx.type === 'entrada' ? '💸' : '💰'} R$ {Number(tx.value || 0).toFixed(2)}
            </div>

            <div className={styles.transactionDescription}>
              {tx.description || 'Sem descrição'}
            </div>

            <div className={styles.transactionFooter}>
              <span className={styles.categoryBadge}>
                {tx.category || 'Sem categoria'}
              </span>
              <button
                onClick={() => handleDelete(tx.id)}
                className={buttonStyles.botaoPerigo}
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

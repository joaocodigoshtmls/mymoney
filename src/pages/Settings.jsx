import React, { useEffect, useState } from 'react';
import { loadData, saveData } from '../services/storage';
import styles from './Settings.module.css';
import buttonStyles from '../components/Buttons.module.css'; // ✅ caminho ajustado

export default function Settings() {
  const data = loadData();
  const [moeda, setMoeda] = useState(data.moedaPadrao || 'BRL');
  const [novaEntrada, setNovaEntrada] = useState('');
  const [novaSaida, setNovaSaida] = useState('');
  const [categoriasEntrada, setCategoriasEntrada] = useState(data.categoriasEntrada || ['Outros']);
  const [categoriasSaida, setCategoriasSaida] = useState(data.categoriasSaida || ['Outros']);

  const moedasDisponiveis = [
    { code: 'BRL', label: 'Real (R$)' },
    { code: 'USD', label: 'Dólar (US$)' },
    { code: 'EUR', label: 'Euro (€)' },
    { code: 'GBP', label: 'Libra (£)' }
  ];

  function salvarMoedaPadrao(m) {
    const atual = loadData();
    atual.moedaPadrao = m;
    saveData(atual);
    setMoeda(m);
  }

  function adicionarCategoria(tipo) {
    const atual = loadData();
    if (tipo === 'entrada' && novaEntrada) {
      const novas = [...(atual.categoriasEntrada || ['Outros']), novaEntrada];
      atual.categoriasEntrada = novas;
      setCategoriasEntrada(novas);
      setNovaEntrada('');
    } else if (tipo === 'saida' && novaSaida) {
      const novas = [...(atual.categoriasSaida || ['Outros']), novaSaida];
      atual.categoriasSaida = novas;
      setCategoriasSaida(novas);
      setNovaSaida('');
    }
    saveData(atual);
  }

  function excluirCategoria(tipo, nome) {
    const atual = loadData();
    if (tipo === 'entrada') {
      const filtradas = (atual.categoriasEntrada || []).filter(c => c !== nome);
      atual.categoriasEntrada = filtradas;
      setCategoriasEntrada(filtradas);
    } else {
      const filtradas = (atual.categoriasSaida || []).filter(c => c !== nome);
      atual.categoriasSaida = filtradas;
      setCategoriasSaida(filtradas);
    }
    saveData(atual);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>⚙️ Configurações</h1>

      <div className={styles.section}>
        <h2>Moeda padrão</h2>
        <select
          value={moeda}
          onChange={e => salvarMoedaPadrao(e.target.value)}
          className={styles.select}
        >
          {moedasDisponiveis.map(m => (
            <option key={m.code} value={m.code}>{m.label}</option>
          ))}
        </select>
      </div>

      <div className={styles.section}>
        <h2>Categorias de Entrada</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            adicionarCategoria('entrada');
          }}
          className={styles.form}
        >
          <input
            value={novaEntrada}
            onChange={e => setNovaEntrada(e.target.value)}
            placeholder="Nova categoria"
            className={styles.input}
          />
          <button type="submit" className={buttonStyles.botaoPrimario}>Adicionar</button>
        </form>

        <ul className={styles.list}>
          {categoriasEntrada.map((c, i) => (
            <li key={i} className={styles.categoryBadge}>
              {c}
              <button
                onClick={() => excluirCategoria('entrada', c)}
                className={buttonStyles.botaoPerigo}
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.section}>
        <h2>Categorias de Saída</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            adicionarCategoria('saida');
          }}
          className={styles.form}
        >
          <input
            value={novaSaida}
            onChange={e => setNovaSaida(e.target.value)}
            placeholder="Nova categoria"
            className={styles.input}
          />
          <button type="submit" className={buttonStyles.botaoPrimario}>Adicionar</button>
        </form>

        <ul className={styles.list}>
          {categoriasSaida.map((c, i) => (
            <li key={i} className={styles.categoryBadge}>
              {c}
              <button
                onClick={() => excluirCategoria('saida', c)}
                className={buttonStyles.botaoPerigo}
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

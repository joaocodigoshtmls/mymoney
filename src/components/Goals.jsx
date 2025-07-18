import React, { useEffect, useState } from 'react';
import styles from './Goals.module.css';
import { loadData, saveData } from '../services/storage';

export default function Goals() {
  const { goals = [], transactions = [] } = loadData();

  const [novaMeta, setNovaMeta] = useState({ name: '', value: '', date: '', currency: 'R$' });
  const [valores, setValores] = useState({});
  const [lista, setLista] = useState(goals);
  const [cotacoes, setCotacoes] = useState({});
  const [metaParaExcluir, setMetaParaExcluir] = useState(null); // Nova state para controle do modal

  const salvarMetas = metas => {
    saveData({ ...loadData(), goals: metas });
    setLista(metas);
  };

  const buscarCotacoes = async () => {
    const moedas = [...new Set(lista.map(m => m.currency).filter(m => m !== 'R$'))];
    const novasCotacoes = {};

    await Promise.all(
      moedas.map(async (moeda) => {
        try {
          const res = await fetch(`https://api.exchangerate.host/latest?base=${moeda.replace('$', '')}&symbols=BRL`);
          const data = await res.json();
          novasCotacoes[moeda] = data.rates?.BRL || 1;
        } catch (e) {
          novasCotacoes[moeda] = 1;
        }
      })
    );

    setCotacoes({ ...novasCotacoes, 'R$': 1 });
  };

  useEffect(() => {
    if (lista.length > 0) {
      buscarCotacoes();
    }
  }, [lista]);

  const handleCreateGoal = () => {
    if (!novaMeta.name || !novaMeta.value || !novaMeta.date) return;
    const nova = { ...novaMeta, added: 0, done: false, id: Date.now() };
    const novas = [...lista, nova];
    salvarMetas(novas);
    setNovaMeta({ name: '', value: '', date: '', currency: 'R$' });
  };

  const handleAddValue = (metaId) => {
    const valor = parseFloat(valores[metaId]);
    if (isNaN(valor) || valor <= 0) return;

    const novasMetas = lista.map(m => {
      if (m.id === metaId) {
        return { ...m, added: (m.added || 0) + valor };
      }
      return m;
    });

    const novaTransacao = {
      id: Date.now(),
      type: 'entrada',
      category: 'Meta: ' + lista.find(m => m.id === metaId).name,
      value: valor,
      date: new Date().toISOString()
    };

    saveData({
      ...loadData(),
      goals: novasMetas,
      transactions: [...transactions, novaTransacao]
    });

    setLista(novasMetas);
    setValores({ ...valores, [metaId]: '' });
  };

  const handleConclude = (metaId) => {
    const novas = lista.map(m => m.id === metaId ? { ...m, done: true } : m);
    salvarMetas(novas);
  };

  const confirmarExclusao = () => {
    const novas = lista.filter(m => m.id !== metaParaExcluir.id);
    salvarMetas(novas);
    setMetaParaExcluir(null);
  };

  const metasAtivas = lista.filter(meta => !meta.done);
  const metasConcluidas = lista.filter(meta => meta.done);

  const renderMeta = (meta, isConcluida = false) => {
    const cotacao = cotacoes[meta.currency] || 1;
    const valorJurosConvertido = meta.value * 1.1268 * cotacao;

    return (
      <div key={meta.id} className={styles.metaBox}>
        <div className={styles.metaHeader}>
          <span>📱 <strong>{meta.name}</strong></span>
          <span>
            {meta.currency} {meta.added || 0} de {meta.value}
          </span>
        </div>

        <div className={styles.progress}>
          <div
            className={styles.progressBar}
            style={{ width: `${((meta.added || 0) / meta.value) * 100}%` }}
          ></div>
        </div>

        <div className={styles.metaFooter}>
          <span>Prazo: {meta.date}</span>
          <span>
            Cotação atual: {meta.currency} 1 = R$ {cotacao.toFixed(2)}
          </span>
          <span>Projeção com juros: R$ {valorJurosConvertido.toFixed(2)}</span>
        </div>

        <div className={styles.metaActions}>
          {!isConcluida ? (
            <>
              <select disabled>
                <option>{meta.currency}</option>
              </select>
              <input
                value={valores[meta.id] || ''}
                onChange={e => setValores({ ...valores, [meta.id]: e.target.value })}
                placeholder="Valor"
              />
              <button onClick={() => handleAddValue(meta.id)}>Adicionar</button>
              <button className={styles.btnConcluir} onClick={() => handleConclude(meta.id)}>Concluir</button>
            </>
          ) : (
            <button className={styles.btnExcluir} onClick={() => setMetaParaExcluir(meta)}>🗑️ Excluir</button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Metas</h1>

      <div className={styles.form}>
        <input
          placeholder="Nome da meta"
          value={novaMeta.name}
          onChange={e => setNovaMeta({ ...novaMeta, name: e.target.value })}
        />
        <select
          value={novaMeta.currency}
          onChange={e => setNovaMeta({ ...novaMeta, currency: e.target.value })}
        >
          <option>R$</option>
          <option>US$</option>
          <option>€</option>
        </select>
        <input
          placeholder="Valor desejado"
          value={novaMeta.value}
          onChange={e => setNovaMeta({ ...novaMeta, value: e.target.value })}
        />
        <input
          type="date"
          value={novaMeta.date}
          onChange={e => setNovaMeta({ ...novaMeta, date: e.target.value })}
        />
        <button onClick={handleCreateGoal}>Criar meta</button>
      </div>

      {metasAtivas.length > 0 && (
        <div>
          <h2 className={styles.subTitle}>Metas em andamento</h2>
          {metasAtivas.map(meta => renderMeta(meta))}
        </div>
      )}

      {metasConcluidas.length > 0 && (
        <div>
          <h2 className={styles.subTitle}>Metas Concluídas</h2>
          {metasConcluidas.map(meta => renderMeta(meta, true))}
        </div>
      )}

      {/* Modal de confirmação */}
      {metaParaExcluir && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p>Deseja realmente excluir esta meta concluída?</p>
            <div className={styles.modalButtons}>
              <button className={styles.btnConfirmar} onClick={confirmarExclusao}>OK</button>
              <button className={styles.btnCancelar} onClick={() => setMetaParaExcluir(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import styles from './Header.module.css';
import { FaChartPie, FaWallet, FaBullseye, FaChartLine, FaCog } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>💰 Finance Manager</div>
      <nav className={styles.nav}>
        <Link to="/dashboard"><FaChartPie /> Dashboard</Link>
        <Link to="/transactions"><FaWallet /> Transações</Link>
        <Link to="/goals"><FaBullseye /> Metas</Link>
        <Link to="/estatisticas"><FaChartLine /> Estatísticas</Link> {/* ⬅️ corrigido */}
        <Link to="/settings"><FaCog /> Configurações</Link>
      </nav>
    </header>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to="/dashboard" className={styles.link}>Dashboard</Link>
        <Link to="/transactions" className={styles.link}>Transações</Link>
        <Link to="/goals" className={styles.link}>Metas</Link>
        <Link to="/statistics" className={styles.link}>Estatísticas</Link>
        <Link to="/settings" className={styles.link}>Configurações</Link>
      </nav>
    </header> 
  );
}

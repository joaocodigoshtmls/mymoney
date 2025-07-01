import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Goals from './components/Goals';

export default function App() {
  return (
    <div>
      <nav className="nav-bar">
        <Link to="/">Dashboard</Link>
        <Link to="/transactions">Transações</Link>
        <Link to="/goals">Metas</Link>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/goals" element={<Goals />} />
        </Routes>
      </main>
    </div>
  );
}
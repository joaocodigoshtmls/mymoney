import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Goals from './components/Goals';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/goals" element={<Goals />} />
      </Routes>
    </>
  );
}

export default App;

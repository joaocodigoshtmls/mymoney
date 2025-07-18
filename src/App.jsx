import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';

import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Goals from './components/Goals';
import Settings from './pages/Settings';
import Estatisticas from './pages/Estatisticas';
import LoginRegister from './pages/LoginRegister';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCarregando(false);
    });
    return () => unsub();
  }, []);

  if (carregando) return <p>Carregando...</p>;

  // Páginas protegidas (exigem login)
  const Protegido = ({ children }) => {
    return usuario ? children : <Navigate to="/login" replace />;
  };

  // Ocultar o header na tela de login
  const exibirHeader = location.pathname !== '/login';

  return (
    <>
      {exibirHeader && <Header />}

      <Routes>
        <Route
          path="/"
          element={
            usuario ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />
        <Route path="/login" element={<LoginRegister />} />

        <Route
          path="/dashboard"
          element={
            <Protegido>
              <Dashboard />
            </Protegido>
          }
        />
        <Route
          path="/transactions"
          element={
            <Protegido>
              <Transactions />
            </Protegido>
          }
        />
        <Route
          path="/goals"
          element={
            <Protegido>
              <Goals />
            </Protegido>
          }
        />
        <Route
          path="/settings"
          element={
            <Protegido>
              <Settings />
            </Protegido>
          }
        />
        <Route
          path="/estatisticas"
          element={
            <Protegido>
              <Estatisticas />
            </Protegido>
          }
        />
      </Routes>
    </>
  );
}

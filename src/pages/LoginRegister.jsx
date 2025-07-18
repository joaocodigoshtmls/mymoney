import React, { useState } from 'react';
import styles from './LoginRegister.module.css';
import { auth, provider } from '../services/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', password: '' });
  const [erro, setErro] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    const { email, password } = form;
    if (!email || !password) {
      setErro('Preencha todos os campos');
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      setErro(error.message || 'Erro ao autenticar');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      setErro(error.message);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <img src="/coin_icon.png" alt="logo" />
          <h1>Finance Manager</h1>
        </div>

        <div className={styles.tabs}>
          <button
            className={isLogin ? styles.active : ''}
            onClick={() => setIsLogin(true)}
          >
            Entrar
          </button>
          <button
            className={!isLogin ? styles.active : ''}
            onClick={() => setIsLogin(false)}
          >
            Cadastrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={form.password}
            onChange={handleChange}
          />

          {erro && <p className={styles.error}>{erro}</p>}

          <button type="submit" className={styles.submit}>
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <div className={styles.divider}>ou</div>

        <button className={styles.google} onClick={handleGoogleLogin}>
          Entrar com Google
        </button>
      </div>
    </div>
  );
}

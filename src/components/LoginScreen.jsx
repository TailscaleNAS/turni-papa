import React, { useState } from 'react';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setError('Email o password errati. Riprova.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.logo}>T</div>
        <h1 style={styles.title}>I miei turni</h1>
        <p style={styles.sub}>Accedi per visualizzare il calendario</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Accesso...' : 'Accedi'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: '100vh',
    background: '#0f0f13',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    fontFamily: "'DM Sans', sans-serif",
  },
  card: {
    width: '100%',
    maxWidth: '360px',
    textAlign: 'center',
  },
  logo: {
    width: '64px',
    height: '64px',
    borderRadius: '20px',
    background: '#FFB830',
    color: '#0f0f13',
    fontSize: '28px',
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    fontFamily: "'Syne', sans-serif",
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: '28px',
    fontWeight: 800,
    color: '#fff',
    margin: '0 0 8px',
  },
  sub: {
    fontSize: '14px',
    color: '#888',
    margin: '0 0 32px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '14px',
    border: '1px solid #2a2a35',
    background: '#1a1a22',
    color: '#fff',
    fontSize: '15px',
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: 'border-box',
    outline: 'none',
  },
  error: {
    color: '#E24B4A',
    fontSize: '13px',
    margin: '0',
  },
  btn: {
    padding: '15px',
    borderRadius: '14px',
    border: 'none',
    background: '#fff',
    color: '#0f0f13',
    fontSize: '15px',
    fontWeight: 700,
    fontFamily: "'Syne', sans-serif",
    cursor: 'pointer',
    marginTop: '4px',
  },
};

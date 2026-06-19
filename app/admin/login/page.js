'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // In a real app, this would be a server action or API call to set a secure cookie
    // For this prototype, we'll just check against an environment variable (client-side for simplicity, but we'll also check server-side in API)
    
    // We'll set a simple localStorage item just to "remember" the session for the UI
    // The actual security is in the API routes where process.env.ADMIN_PASSWORD is checked
    localStorage.setItem('admin_password', password);
    router.push('/admin');
  };

  return (
    <main className={styles.main}>
      <h1>Admin Login</h1>
      <form onSubmit={handleLogin} className={styles.form}>
        <div className={styles.field}>
          <label>Admin Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.loginBtn}>Login</button>
      </form>
      <a href="/" className={styles.backLink}>Back to Home</a>
    </main>
  );
}

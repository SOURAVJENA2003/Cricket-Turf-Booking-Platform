'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Authenticated! Clean client-side localStorage.
        localStorage.removeItem('admin_password'); // Remove old insecure storage if it exists
        
        // Next.js middleware handles routing access now. Redirect to Admin.
        router.push('/admin');
        router.refresh(); // Refresh router state to ensure middleware picks up the new cookie
      } else {
        setError((data && data.message) || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <h1>Admin Login</h1>
      <form onSubmit={handleLogin} className={styles.form}>
        <div className={styles.field}>
          <label>Admin Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="e.g. admin@cricketturf.com"
            required 
          />
        </div>
        <div className={styles.field}>
          <label>Admin Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter password"
            required 
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" disabled={loading} className={styles.loginBtn}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <Link href="/" className={styles.backLink}>Back to Home</Link>
    </main>
  );
}

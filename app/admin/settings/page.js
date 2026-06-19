import Link from 'next/link';
import styles from './page.module.css';

export default async function AdminSettingsPage() {
  const adminEmail = process.env.ADMIN_EMAIL || 'Not Set';
  const upiId = process.env.UPI_ID || 'Not Set';
  const upiName = process.env.UPI_NAME || 'Not Set';

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>Admin Settings</h1>
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navLink}>Slot Manager</Link>
          <Link href="/admin/bookings" className={styles.navLink}>Bookings List</Link>
        </nav>
      </header>

      <section className={styles.section}>
        <div className={styles.card}>
          <h2>System Environment Configuration</h2>
          <p className={styles.description}>
            These settings are loaded from your system&apos;s environment variables (<code>.env</code> file). 
            To change these values in production, update your hosting provider environment variables.
          </p>

          <div className={styles.settingsGrid}>
            <div className={styles.label}>Admin Email:</div>
            <div className={styles.value}><code>{adminEmail}</code></div>

            <div className={styles.label}>UPI ID:</div>
            <div className={styles.value}><code>{upiId}</code></div>

            <div className={styles.label}>UPI Name:</div>
            <div className={styles.value}><code>{upiName}</code></div>

            <div className={styles.label}>Auth Method:</div>
            <div className={styles.value}>Secure HttpOnly Cookies & Bcrypt Hashed Passwords</div>
          </div>
        </div>
      </section>

      <Link href="/admin" className={styles.backLink}>Back to Dashboard</Link>
    </main>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Form states
  const [turfName, setTurfName] = useState('');
  const [turfAddress, setTurfAddress] = useState('');
  const [turfGoogleMaps, setTurfGoogleMaps] = useState('');
  const [turfPhone, setTurfPhone] = useState('');
  const [turfEmail, setTurfEmail] = useState('');
  const [openingTime, setOpeningTime] = useState('06:00');
  const [closingTime, setClosingTime] = useState('23:00');
  const [defaultSlotPrice, setDefaultSlotPrice] = useState('1000.00');
  const [paymentMode, setPaymentMode] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [upiName, setUpiName] = useState('');
  const [bookingEnabled, setBookingEnabled] = useState(true);
  const [turfDescription, setTurfDescription] = useState('');
  const [turfLogoUrl, setTurfLogoUrl] = useState('');
  const [turfBannerUrl, setTurfBannerUrl] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings');
        if (response.status === 401) {
          router.push('/admin/login');
          router.refresh();
          return;
        }
        const data = await response.json();
        if (response.ok && data.success) {
          const s = data.data;
          setTurfName(s.turf_name || '');
          setTurfAddress(s.turf_address || '');
          setTurfGoogleMaps(s.turf_google_maps || '');
          setTurfPhone(s.turf_phone || '');
          setTurfEmail(s.turf_email || '');
          setOpeningTime(s.opening_time || '06:00');
          setClosingTime(s.closing_time || '23:00');
          setDefaultSlotPrice(s.default_slot_price || '1000.00');
          setPaymentMode(s.payment_mode || 'upi');
          setUpiId(s.upi_id || '');
          setUpiName(s.upi_name || '');
          setBookingEnabled(s.booking_enabled !== false);
          setTurfDescription(s.turf_description || '');
          setTurfLogoUrl(s.turf_logo_url || '');
          setTurfBannerUrl(s.turf_banner_url || '');
          setWhatsappNumber(s.whatsapp_number || '');
          setInstagramUrl(s.instagram_url || '');
        } else {
          setError(data.message || 'Failed to load settings');
        }
      } catch (err) {
        setError('Network error: Failed to retrieve settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          turfName,
          turfAddress,
          turfGoogleMaps,
          turfPhone,
          turfEmail,
          openingTime,
          closingTime,
          defaultSlotPrice: parseFloat(defaultSlotPrice),
          upiId,
          upiName,
          paymentMode,
          bookingEnabled,
          turfDescription,
          turfLogoUrl,
          turfBannerUrl,
          whatsappNumber,
          instagramUrl
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('Settings updated successfully!');
      } else {
        setError(data.message || 'Failed to update settings');
        if (response.status === 401) {
          router.push('/admin/login');
          router.refresh();
        }
      }
    } catch (err) {
      setError('Network error: Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>Admin Settings</h1>
        </header>
        <p>Loading settings configuration...</p>
      </main>
    );
  }

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
          <h2>Update Turf Settings</h2>
          <p className={styles.description}>
            Modify operating hours, default pricing, payment modes, and branding metadata dynamically.
          </p>

          {success && <div className={styles.successMessage}>{success}</div>}
          {error && <div className={styles.errorMessage}>{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* GENERAL DETAILS */}
            <h3 className={styles.settingsSectionTitle}>General Profile</h3>
            <div className={styles.formGroup}>
              <label>Turf Name:</label>
              <input 
                type="text" 
                value={turfName} 
                onChange={(e) => setTurfName(e.target.value)} 
                className={styles.input} 
                required 
              />
            </div>
            <div className={styles.formGroup}>
              <label>Address:</label>
              <textarea 
                value={turfAddress} 
                onChange={(e) => setTurfAddress(e.target.value)} 
                className={styles.textarea} 
                required 
              />
            </div>
            <div className={styles.formGroup}>
              <label>Google Maps URL:</label>
              <input 
                type="url" 
                value={turfGoogleMaps} 
                onChange={(e) => setTurfGoogleMaps(e.target.value)} 
                className={styles.input} 
                required 
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Contact Phone:</label>
                <input 
                  type="text" 
                  value={turfPhone} 
                  onChange={(e) => setTurfPhone(e.target.value)} 
                  className={styles.input} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Contact Email:</label>
                <input 
                  type="email" 
                  value={turfEmail} 
                  onChange={(e) => setTurfEmail(e.target.value)} 
                  className={styles.input} 
                />
              </div>
            </div>

            {/* OPERATIONS CONFIG */}
            <h3 className={styles.settingsSectionTitle}>Operations & Pricing</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Opening Time (HH:MM):</label>
                <input 
                  type="text" 
                  value={openingTime} 
                  onChange={(e) => setOpeningTime(e.target.value)} 
                  placeholder="e.g. 06:00" 
                  className={styles.input} 
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Closing Time (HH:MM):</label>
                <input 
                  type="text" 
                  value={closingTime} 
                  onChange={(e) => setClosingTime(e.target.value)} 
                  placeholder="e.g. 23:00" 
                  className={styles.input} 
                  required 
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Default Price per Hour (₹):</label>
              <input 
                type="number" 
                value={defaultSlotPrice} 
                onChange={(e) => setDefaultSlotPrice(e.target.value)} 
                className={styles.input} 
                step="0.01" 
                required 
              />
            </div>

            {/* PAYMENT OPTIONS */}
            <h3 className={styles.settingsSectionTitle}>Payments</h3>
            <div className={styles.formGroup}>
              <label>Active Payment Mode:</label>
              <select 
                value={paymentMode} 
                onChange={(e) => setPaymentMode(e.target.value)} 
                className={styles.select}
              >
                <option value="upi">UPI Manual (Scan QR & Enter UTR)</option>
                <option value="razorpay">Razorpay Online Gateway</option>
              </select>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>UPI ID (For UPI Mode):</label>
                <input 
                  type="text" 
                  value={upiId} 
                  onChange={(e) => setUpiId(e.target.value)} 
                  className={styles.input} 
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label>UPI Name (For UPI Mode):</label>
                <input 
                  type="text" 
                  value={upiName} 
                  onChange={(e) => setUpiName(e.target.value)} 
                  className={styles.input} 
                  required 
                />
              </div>
            </div>

            {/* BRANDING & SOCIAL MEDIA (OPTIONAL) */}
            <h3 className={styles.settingsSectionTitle}>Branding & Socials (Optional)</h3>
            <div className={styles.formGroup}>
              <label>Turf Description:</label>
              <textarea 
                value={turfDescription} 
                onChange={(e) => setTurfDescription(e.target.value)} 
                className={styles.textarea} 
                placeholder="Brief description about the turf..." 
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Logo URL:</label>
                <input 
                  type="url" 
                  value={turfLogoUrl} 
                  onChange={(e) => setTurfLogoUrl(e.target.value)} 
                  placeholder="https://example.com/logo.png" 
                  className={styles.input} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Banner Image URL:</label>
                <input 
                  type="url" 
                  value={turfBannerUrl} 
                  onChange={(e) => setTurfBannerUrl(e.target.value)} 
                  placeholder="https://example.com/banner.jpg" 
                  className={styles.input} 
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>WhatsApp Contact Number:</label>
                <input 
                  type="text" 
                  value={whatsappNumber} 
                  onChange={(e) => setWhatsappNumber(e.target.value)} 
                  placeholder="e.g. 91XXXXXXXXXX" 
                  className={styles.input} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Instagram Page URL:</label>
                <input 
                  type="url" 
                  value={instagramUrl} 
                  onChange={(e) => setInstagramUrl(e.target.value)} 
                  placeholder="https://instagram.com/yourpage" 
                  className={styles.input} 
                />
              </div>
            </div>

            {/* PLATFORM CONFIG */}
            <h3 className={styles.settingsSectionTitle}>Platform Control</h3>
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  checked={bookingEnabled} 
                  onChange={(e) => setBookingEnabled(e.target.checked)} 
                />
                Enable Public Bookings
              </label>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                If unchecked, slot grids will be read-only and checkouts disabled for customers.
              </p>
            </div>

            <div style={{ marginTop: '30px' }}>
              <button type="submit" disabled={saving} className={styles.submitBtn}>
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </section>

      <Link href="/admin" className={styles.backLink}>Back to Dashboard</Link>
    </main>
  );
}

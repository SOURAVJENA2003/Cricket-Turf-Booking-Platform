'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminHeader from '@/components/AdminHeader';
import { LayoutDashboard, CalendarRange, Settings, Save, Sparkles, ChevronLeft } from 'lucide-react';

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
      <main className="min-h-screen bg-pitch-canvas text-pitch-slate-800 font-sans pb-12">
        <AdminHeader activePage="settings" />
        <div className="pt-28 max-w-xl mx-auto text-xs text-slate-400 font-sans italic animate-pulse py-12">
          Loading settings configuration...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-pitch-canvas text-pitch-slate-800 font-sans pb-12">
      {/* Navigation Header */}
      <AdminHeader activePage="settings" />

      {/* Main Settings Page content */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 space-y-6 text-left">
        
        {/* Title panel */}
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-premium-soft hover:border-emerald-500/25 transition-all duration-300">
          <div>
            <h2 className="text-lg font-display font-black text-pitch-charcoal leading-none">Console Settings</h2>
            <p className="text-xs text-pitch-slate-550 mt-1 font-sans">Modify operating timing structures, default prices, payment modes, and profile branding decals.</p>
          </div>
        </div>

        {/* Form panel card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-premium-tall p-6 md:p-8 hover:border-emerald-500/10 transition-all duration-300">
          
          {success && (
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-150 p-4 rounded-xl font-bold text-xs mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" /> {success}
            </div>
          )}
          {error && (
            <div className="bg-red-50 text-red-800 border border-red-150 p-4 rounded-xl font-bold text-xs mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* GENERAL PROFILE */}
            <div>
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider pb-2 border-b border-slate-100 mb-4">
                General Profile
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400">Turf Name</label>
                  <input 
                    type="text" 
                    value={turfName} 
                    onChange={(e) => setTurfName(e.target.value)} 
                    required 
                    className="p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 shadow-2xs w-full" 
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400">Address Location</label>
                  <textarea 
                    value={turfAddress} 
                    onChange={(e) => setTurfAddress(e.target.value)} 
                    required 
                    rows={3}
                    className="p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 shadow-2xs w-full font-sans" 
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400">Google Maps Navigation URL</label>
                  <input 
                    type="url" 
                    value={turfGoogleMaps} 
                    onChange={(e) => setTurfGoogleMaps(e.target.value)} 
                    required 
                    className="p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 shadow-2xs w-full font-mono" 
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400">Contact Phone</label>
                    <input 
                      type="text" 
                      value={turfPhone} 
                      onChange={(e) => setTurfPhone(e.target.value)} 
                      className="p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 shadow-2xs w-full font-mono" 
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400">Contact Email</label>
                    <input 
                      type="email" 
                      value={turfEmail} 
                      onChange={(e) => setTurfEmail(e.target.value)} 
                      className="p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 shadow-2xs w-full font-mono" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* OPERATIONS CONFIG */}
            <div>
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider pb-2 border-b border-slate-100 mb-4">
                Operations & Pricing
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400">Opening Hour (HH:MM)</label>
                    <input 
                      type="text" 
                      value={openingTime} 
                      onChange={(e) => setOpeningTime(e.target.value)} 
                      placeholder="e.g. 06:00" 
                      required 
                      className="p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 shadow-2xs w-full font-mono" 
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400">Closing Hour (HH:MM)</label>
                    <input 
                      type="text" 
                      value={closingTime} 
                      onChange={(e) => setClosingTime(e.target.value)} 
                      placeholder="e.g. 23:00" 
                      required 
                      className="p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 shadow-2xs w-full font-mono" 
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400">Default Price per Hour (₹)</label>
                  <input 
                    type="number" 
                    value={defaultSlotPrice} 
                    onChange={(e) => setDefaultSlotPrice(e.target.value)} 
                    step="0.01" 
                    required 
                    className="p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 shadow-2xs w-full font-mono" 
                  />
                </div>
              </div>
            </div>

            {/* PAYMENTS */}
            <div>
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider pb-2 border-b border-slate-100 mb-4">
                Payment Configurations
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400">Active Mode</label>
                  <select 
                    value={paymentMode} 
                    onChange={(e) => setPaymentMode(e.target.value)} 
                    className="p-3 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-emerald-500 bg-transparent cursor-pointer shadow-2xs w-full"
                  >
                    <option value="upi">Manual UPI (QR scan & UTR submission)</option>
                    <option value="razorpay">Online Razorpay Gateway (Test mode)</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400">UPI Address (For UPI Mode)</label>
                    <input 
                      type="text" 
                      value={upiId} 
                      onChange={(e) => setUpiId(e.target.value)} 
                      required 
                      className="p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 shadow-2xs w-full font-mono" 
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400">UPI Account Name (For UPI Mode)</label>
                    <input 
                      type="text" 
                      value={upiName} 
                      onChange={(e) => setUpiName(e.target.value)} 
                      required 
                      className="p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 shadow-2xs w-full" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* BRANDING (OPTIONAL) */}
            <div>
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider pb-2 border-b border-slate-100 mb-4">
                Branding & Social Links (Optional)
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400">Turf Description Decal</label>
                  <textarea 
                    value={turfDescription} 
                    onChange={(e) => setTurfDescription(e.target.value)} 
                    rows={2}
                    placeholder="e.g. built for ultimate performance..." 
                    className="p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 shadow-2xs w-full font-sans" 
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400">Branding Logo URL</label>
                    <input 
                      type="url" 
                      value={turfLogoUrl} 
                      onChange={(e) => setTurfLogoUrl(e.target.value)} 
                      placeholder="https://example.com/logo.png" 
                      className="p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 shadow-2xs w-full font-mono" 
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400">Branding Banner URL</label>
                    <input 
                      type="url" 
                      value={turfBannerUrl} 
                      onChange={(e) => setTurfBannerUrl(e.target.value)} 
                      placeholder="https://example.com/banner.jpg" 
                      className="p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 shadow-2xs w-full font-mono" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400">WhatsApp Mobile Contact</label>
                    <input 
                      type="text" 
                      value={whatsappNumber} 
                      onChange={(e) => setWhatsappNumber(e.target.value)} 
                      placeholder="e.g. 919876543210" 
                      className="p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 shadow-2xs w-full font-mono" 
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400">Instagram Profile Link</label>
                    <input 
                      type="url" 
                      value={instagramUrl} 
                      onChange={(e) => setInstagramUrl(e.target.value)} 
                      placeholder="https://instagram.com/profile" 
                      className="p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 shadow-2xs w-full font-mono" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* PLATFORM CONFIG */}
            <div>
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider pb-2 border-b border-slate-100 mb-4">
                Platform Access Control
              </h3>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start space-x-3 select-none">
                <input 
                  type="checkbox" 
                  checked={bookingEnabled} 
                  onChange={(e) => setBookingEnabled(e.target.checked)} 
                  className="w-4 h-4 rounded border-slate-350 text-emerald-500 focus:ring-emerald-500 cursor-pointer mt-0.5"
                />
                <div className="text-xs">
                  <label className="font-extrabold text-pitch-charcoal block cursor-pointer">Enable Public Web Bookings</label>
                  <span className="text-[10px] text-pitch-slate-500 leading-normal block mt-0.5">
                    If checked, customers can select timing slots and proceed to pay. If unchecked, checkout is disabled and slots are read-only.
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <Link href="/admin" className="text-xs font-semibold text-pitch-slate-500 hover:text-pitch-charcoal transition-colors flex items-center gap-1">
                <ChevronLeft className="w-3.5 h-3.5" /> Return to console
              </Link>
              <button 
                type="submit" 
                disabled={saving} 
                className="px-5 py-3 rounded-xl bg-pitch-charcoal hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>

          </form>

        </div>

      </section>
    </main>
  );
}

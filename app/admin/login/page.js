'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowLeft } from 'lucide-react';

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
    <main className="min-h-screen bg-pitch-canvas text-pitch-slate-800 font-sans py-12 md:py-20 flex flex-col justify-center items-center px-4">
      <div className="max-w-sm w-full bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl shadow-premium-tall p-6 md:p-8 relative overflow-hidden text-left animate-fade-in hover:border-emerald-500/20 transition-all duration-300">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
        
        {/* Navigation Return */}
        <div className="flex items-center space-x-2 text-xs text-pitch-slate-450 font-bold uppercase tracking-wider mb-6">
          <Link href="/" className="hover:text-pitch-charcoal transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Website
          </Link>
        </div>

        <div className="flex items-center space-x-2.5 mb-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600">
            <Lock className="w-4 h-4 text-emerald-600" />
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-black text-pitch-charcoal mt-1 tracking-tight leading-none">
            Admin Auth
          </h1>
        </div>
        <p className="text-[11px] text-pitch-slate-500 font-sans leading-relaxed mb-6">
          Sign in to modify pricing, approve payments, block slots, and verify customer bookings.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="e.g. admin@cricketturf.com"
              required 
              className="p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 shadow-2xs"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required 
              className="p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 shadow-2xs"
            />
          </div>

          {error && <p className="text-xs text-red-500 font-bold text-center mt-2">{error}</p>}

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-3.5 rounded-xl bg-pitch-charcoal hover:bg-emerald-600 text-white font-extrabold uppercase tracking-wider text-xs transition-colors cursor-pointer text-center shadow-sm mt-2"
          >
            {loading ? 'Verifying Credentials...' : 'Sign In'}
          </button>
        </form>
      </div>
    </main>
  );
}

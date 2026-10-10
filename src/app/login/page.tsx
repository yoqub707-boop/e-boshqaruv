'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Eye, EyeOff, LogIn, AlertCircle, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const currentYear = new Date().getFullYear();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Tizimga kirishda xatolik yuz berdi. Login yoki parolni tekshiring.');
        return;
      }

      router.push('/dashboard');
    } catch {
      setError('Tarmoq xatoligi yuz berdi. Qaytadan urinib ko\'ring.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-[#0a0f1d] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow decorations */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600 rounded-full filter blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600 rounded-full filter blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Logo and Brand Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 flex items-center justify-center shadow-2xl shadow-blue-500/30 border border-blue-400/30">
            <Building2 size={38} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mt-4">
            Raqamli hokimlik
          </h1>
          <p className="text-blue-200/80 text-xs font-medium uppercase tracking-wider mt-1">
            Angor tumani hokimligi boshqaruv portali
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/15 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Tizimga kirish</h2>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              <ShieldCheck size={12} />
              Himoyalangan tizim
            </span>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl mb-4 text-xs font-medium">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-blue-100 mb-1.5">
                Foydalanuvchi nomi
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Foydalanuvchi nomini kiriting"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-blue-100 mb-1.5">
                Maxfiy parol
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Parolni kiriting"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm pr-12 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-300/60 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  Kirish
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <p className="text-[11px] text-blue-200/60">
              Angor tumani hokimligi xodimlari va mutasaddi tashkilotlar uchun yopiq axborot tizimi.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-blue-300/50 text-xs mt-6 font-medium">
          &copy; {currentYear} Angor tuman hokimligi. Barcha huquqlar himoyalangan.
        </p>
      </div>
    </div>
  );
}

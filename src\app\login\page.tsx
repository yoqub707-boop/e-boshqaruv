'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        setError(data.error || 'Tizimga kirishda xatolik yuz berdi');
        return;
      }

      // Muvaffaqiyatli kirish
      router.push('/dashboard');
    } catch (err) {
      setError('Tarmoq xatoligi. Qaytadan urinib ko\'ring.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800 via-primary-900 to-[#0f172a] flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-500 rounded-full filter blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-2xl shadow-blue-500/30">
            <LayoutDashboard size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mt-4">E-Boshqaruv</h1>
          <p className="text-blue-200/70 mt-2">Elektron Hokimiyat Boshqaruv Tizimi</p>
        </div>

        {/* Login forma */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Tizimga kirish</h2>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-1.5">
                Foydalanuvchi nomi
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Foydalanuvchi nomingizni kiriting"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100 mb-1.5">
                Parol
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Parolingizni kiriting"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300/70 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
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

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-blue-200/50 text-center mb-3">
              Tizimga kirish uchun o'z parolingizdan foydalaning. Agar parolni unutgan bo'lsangiz, administratorga murojaat qiling.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-blue-200/30 text-xs mt-6">
          &copy; 2024 E-Boshqaruv. Barcha huquqlar himoyalangan.
        </p>
      </div>
    </div>
  );
}

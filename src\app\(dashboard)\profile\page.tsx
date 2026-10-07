'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Phone, Calendar, Save, Check } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState('Administrator');
  const [email, setEmail] = useState('admin@e-boshqaruv.uz');
  const [phone, setPhone] = useState('+998 90 123 45 67');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          setFullName(data.user.fullName);
          setEmail(data.user.email);
        }
      })
      .catch(console.error);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mening profilim</h1>
        <p className="text-sm text-gray-500 mt-1">Shaxsiy hisob ma&apos;lumotlari va sozlamalari</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center flex flex-col items-center justify-center p-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg shadow-primary-500/30">
            {fullName.charAt(0)}
          </div>
          <h2 className="text-lg font-bold text-gray-800">{fullName}</h2>
          <span className="badge badge-info mt-1.5">{user?.roleDisplayName || 'Moderator'}</span>
          <p className="text-xs text-gray-400 mt-2">ID: #{user?.id || 1}</p>
        </div>

        <div className="card md:col-span-2">
          <h3 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b">Profil ma&apos;lumotlarini tahrirlash</h3>
          {saved && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 text-sm">
              <Check size={16} /> Ma&apos;lumotlar muvaffaqiyatli saqlandi!
            </div>
          )}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="form-label flex items-center gap-2">
                <User size={16} className="text-gray-400" /> F.I.Sh. (To&apos;liq ism)
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="form-label flex items-center gap-2">
                <Mail size={16} className="text-gray-400" /> Elektron pochta
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="form-label flex items-center gap-2">
                <Phone size={16} className="text-gray-400" /> Telefon raqami
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label flex items-center gap-2">
                <Shield size={16} className="text-gray-400" /> Tizimdagi rol
              </label>
              <input
                type="text"
                value={user?.roleDisplayName || 'Moderator (Bosh administrator)'}
                disabled
                className="form-input bg-gray-100 cursor-not-allowed"
              />
            </div>

            <button type="submit" className="btn-primary mt-4">
              <Save size={16} /> O&apos;zgarishlarni saqlash
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

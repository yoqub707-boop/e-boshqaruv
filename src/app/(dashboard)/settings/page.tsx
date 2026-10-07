'use client';

import React, { useState } from 'react';
import { Settings, Lock, Bell, Moon, Globe, Database, Save, Check } from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tizim sozlamalari</h1>
        <p className="text-sm text-gray-500 mt-1">Xavfsizlik, bildirishnomalar va tizim konfiguratsiyasi</p>
      </div>

      {saved && (
        <div className="p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 text-sm">
          <Check size={16} /> Sozlamalar muvaffaqiyatli yangilandi!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Lock size={18} className="text-primary-500" /> Parolni yangilash
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="form-label">Joriy parol</label>
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Yangi parol</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Kamida 8 ta belgi"
                className="form-input"
              />
            </div>
            <button type="submit" className="btn-primary w-full mt-2">
              <Save size={16} /> Parolni o&apos;zgartirish
            </button>
          </form>
        </div>

        <div className="card space-y-6">
          <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <Bell size={18} className="text-primary-500" /> Bildirishnomalar va xavfsizlik
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Tizim xabarnomalari</p>
                <p className="text-xs text-gray-500">Muhim o&apos;zgarishlar haqida bildirishnoma olish</p>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={e => setNotifications(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Avtomatik zaxira nusxasi (Backup)</p>
                <p className="text-xs text-gray-500">Har 24 soatda ma&apos;lumotlarni arxivlash</p>
              </div>
              <input
                type="checkbox"
                checked={autoBackup}
                onChange={e => setAutoBackup(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

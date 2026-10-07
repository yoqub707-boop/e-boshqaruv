'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  Clock,
  Globe,
  ChevronDown,
  LogOut,
  User,
  Settings,
} from 'lucide-react';
import { clsx } from 'clsx';

interface HeaderProps {
  sidebarCollapsed?: boolean;
  user?: {
    fullName: string;
    role: string;
    roleDisplayName: string;
    avatar?: string | null;
  };
}

export default function Header({ sidebarCollapsed = false, user }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Soatni yangilash
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('uz-UZ', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setCurrentDate(
        now.toLocaleDateString('uz-UZ', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Tizimdan chiqish
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Chiqish xatolik:', error);
    }
  };

  return (
    <header
      className={clsx(
        'fixed top-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-30 transition-all duration-300',
        sidebarCollapsed ? 'left-[70px]' : 'left-[260px]',
        'max-lg:left-0'
      )}
    >
      {/* Chap tomon - Qidiruv */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 w-80">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Qidirish..."
            className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* O'ng tomon */}
      <div className="flex items-center gap-4">
        {/* Soat */}
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
          <Clock size={16} className="text-primary-500" />
          <div className="text-right">
            <div className="font-semibold text-gray-800">{currentTime}</div>
            <div className="text-xs text-gray-500">{currentDate}</div>
          </div>
        </div>

        {/* Til */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-sm text-gray-600"
          >
            <Globe size={16} />
            <span>UZ</span>
            <ChevronDown size={14} />
          </button>
          {showLangMenu && (
            <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border py-1 z-50">
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 font-medium text-primary-500">
                O&apos;zbek tili
              </button>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-gray-600">
                Русский
              </button>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-gray-600">
                English
              </button>
            </div>
          )}
        </div>

        {/* Bildirishnomalar */}
        <button className="relative p-2 rounded-lg hover:bg-gray-50 text-gray-600">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Foydalanuvchi profili */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 pl-4 border-l border-gray-200"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-bold">
              {user?.fullName?.charAt(0) || 'F'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-semibold text-gray-800">
                {user?.fullName || 'Foydalanuvchi'}
              </div>
              <div className="text-xs text-gray-500">
                {user?.roleDisplayName || 'Rol'}
              </div>
            </div>
            <ChevronDown size={16} className="text-gray-400 hidden md:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border py-2 z-50">
              <div className="px-4 py-2 border-b">
                <div className="text-sm font-semibold">{user?.fullName}</div>
                <div className="text-xs text-gray-500">{user?.roleDisplayName}</div>
              </div>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                <User size={16} />
                Profil
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                <Settings size={16} />
                Sozlamalar
              </button>
              <div className="border-t my-1" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
                Tizimdan chiqish
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

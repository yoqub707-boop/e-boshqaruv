'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  Search,
  Clock,
  Globe,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Sparkles,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useData } from '@/context/DataContext';
import AiDataIngestionModal from '@/components/common/AiDataIngestionModal';
import DraftReviewModal from '@/components/common/DraftReviewModal';

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
  const { pendingDraftsCount } = useData();
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Modals state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);

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

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Chiqish xatolik:', error);
      window.location.href = '/login';
    }
  };

  return (
    <>
      <header
        className={clsx(
          'fixed top-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-30 transition-all duration-300',
          sidebarCollapsed ? 'left-[70px]' : 'left-[260px]',
          'max-lg:left-0'
        )}
      >
        {/* Left: District Title & Search */}
        <div className="flex items-center gap-4">
          <div className="hidden xl:flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-gray-800 tracking-wide uppercase">
              Angor tumani hokimligi
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200/80 rounded-xl px-3 py-1.5 w-72">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Tizim bo'yicha qidirish..."
              className="bg-transparent border-none outline-none text-xs w-full text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Right: AI Ingestion, Drafts, Clock, User */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI File Ingestion Button */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
            title="Kunlik hisobotlarni AI orqali yuklash"
          >
            <Sparkles size={14} className="animate-pulse text-blue-200" />
            <span className="hidden sm:inline">AI Hisobot yuklash</span>
          </button>

          {/* Drafts Review Button with Badge */}
          <button
            onClick={() => setIsDraftModalOpen(true)}
            className="relative p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
            title="Tasdiqlash navbati (Qoralamalar)"
          >
            <ShieldCheck size={18} className={pendingDraftsCount > 0 ? "text-blue-600" : "text-gray-500"} />
            {pendingDraftsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {pendingDraftsCount}
              </span>
            )}
          </button>

          {/* Clock & Date */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-gray-600 border-l border-gray-200 pl-3">
            <Clock size={15} className="text-blue-600" />
            <div className="text-right">
              <div className="font-bold text-gray-800 text-xs">{currentTime}</div>
              <div className="text-[10px] text-gray-500 capitalize">{currentDate}</div>
            </div>
          </div>

          {/* User Profile dropdown */}
          <div className="relative border-l border-gray-200 pl-3">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className="w-full h-full rounded-lg object-cover" />
                ) : (
                  user?.fullName?.charAt(0) || 'H'
                )}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-gray-800 leading-tight truncate max-w-[130px]">
                  {user?.fullName || 'Tuman Hokimi'}
                </div>
                <div className="text-[10px] text-blue-600 font-medium leading-tight">
                  {user?.roleDisplayName || 'Bosh administrator'}
                </div>
              </div>
              <ChevronDown size={14} className="text-gray-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-fadeIn">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-800">{user?.fullName || 'Tuman Hokimi'}</p>
                  <p className="text-[11px] text-gray-500">{user?.roleDisplayName || 'Angor tumani hokimligi'}</p>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
                >
                  <User size={14} className="text-gray-400" />
                  Mening profilim
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
                >
                  <Settings size={14} className="text-gray-400" />
                  Tizim sozlamalari
                </Link>

                <div className="border-t border-gray-100 my-1" />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <LogOut size={14} />
                  Tizimdan chiqish
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* AI File Ingestion Modal */}
      <AiDataIngestionModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onSuccessReview={() => setIsDraftModalOpen(true)}
      />

      {/* Draft Review Modal */}
      <DraftReviewModal
        isOpen={isDraftModalOpen}
        onClose={() => setIsDraftModalOpen(false)}
      />
    </>
  );
}

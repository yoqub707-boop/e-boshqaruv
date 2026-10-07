'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { clsx } from 'clsx';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Foydalanuvchi ma'lumotlarini olish
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Foydalanuvchi ma\'lumotlarini olishda xatolik:', error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole={user?.role} />
      <Header sidebarCollapsed={sidebarCollapsed} user={user} />
      <main
        className={clsx(
          'pt-20 pb-8 px-6 transition-all duration-300 min-h-screen',
          sidebarCollapsed ? 'lg:ml-[70px]' : 'lg:ml-[260px]'
        )}
      >
        {children}
      </main>
    </div>
  );
}

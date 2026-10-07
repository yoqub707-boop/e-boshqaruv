'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Building2,
  Leaf,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Receipt,
  Briefcase,
  Store,
  ArrowLeftRight,
  Landmark,
  BarChart3,
  UserCheck,
  Globe,
  Home,
  GraduationCap,
  Heart,
  HardHat,
  Building,
  ShoppingBag,
  Sprout,
  Sun,
  Shield,
  Menu,
  X,
  User,
  Settings,
} from 'lucide-react';
import { clsx } from 'clsx';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: MenuItem[];
  requiredRole?: string[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Boshqaruv paneli',
    icon: <LayoutDashboard size={20} />,
    href: '/dashboard',
  },
  {
    id: 'economy',
    label: 'Iqtisodiyot',
    icon: <TrendingUp size={20} />,
    children: [
      {
        id: 'tax',
        label: 'Soliq tushumlari',
        icon: <Receipt size={16} />,
        href: '/economy/tax',
      },
      {
        id: 'employment',
        label: 'Bandlik',
        icon: <Briefcase size={16} />,
        href: '/economy/employment',
      },
      {
        id: 'business',
        label: 'Tadbirkorlik',
        icon: <Store size={16} />,
        href: '/economy/business',
      },
      {
        id: 'export-import',
        label: 'Eksport/Import',
        icon: <ArrowLeftRight size={16} />,
        href: '/economy/export-import',
      },
      {
        id: 'investment',
        label: 'Investitsiyalar',
        icon: <Landmark size={16} />,
        href: '/economy/investment',
      },
      {
        id: 'price-index',
        label: 'Narx indeksi',
        icon: <BarChart3 size={16} />,
        href: '/economy/price-index',
      },
    ],
  },
  {
    id: 'social',
    label: 'Ijtimoiy soha',
    icon: <Users size={20} />,
    children: [
      {
        id: 'demographics',
        label: 'Demografiya',
        icon: <UserCheck size={16} />,
        href: '/social/demographics',
      },
      {
        id: 'migration',
        label: 'Migratsiya',
        icon: <Globe size={16} />,
        href: '/social/migration',
      },
      {
        id: 'mahalla',
        label: 'Mahalla',
        icon: <Home size={16} />,
        href: '/social/mahalla',
      },
      {
        id: 'education',
        label: "Ta'lim",
        icon: <GraduationCap size={16} />,
        href: '/social/education',
      },
      {
        id: 'health',
        label: "Sog'liqni saqlash",
        icon: <Heart size={16} />,
        href: '/social/health',
      },
    ],
  },
  {
    id: 'construction',
    label: 'Qurilish',
    icon: <Building2 size={20} />,
    children: [
      {
        id: 'projects',
        label: 'Qurilish loyihalari',
        icon: <HardHat size={16} />,
        href: '/construction/projects',
      },
      {
        id: 'empty-buildings',
        label: "Bo'sh binolar",
        icon: <Building size={16} />,
        href: '/construction/empty-buildings',
      },
      {
        id: 'markets',
        label: 'Bozorlar',
        icon: <ShoppingBag size={16} />,
        href: '/construction/markets',
      },
    ],
  },
  {
    id: 'agriculture',
    label: "Qishloq xo'jaligi",
    icon: <Leaf size={20} />,
    children: [
      {
        id: 'crops',
        label: "Qishloq xo'jaligi",
        icon: <Sprout size={16} />,
        href: '/agriculture/crops',
      },
      {
        id: 'green-space',
        label: 'Yashil makon',
        icon: <Sun size={16} />,
        href: '/agriculture/green-space',
      },
    ],
  },
  {
    id: 'users',
    label: 'Foydalanuvchilar',
    icon: <Shield size={20} />,
    href: '/users',
  },
  {
    id: 'profile',
    label: 'Mening profilim',
    icon: <User size={20} />,
    href: '/profile',
  },
  {
    id: 'settings',
    label: 'Tizim sozlamalari',
    icon: <Settings size={20} />,
    href: '/settings',
  },
];

interface SidebarProps {
  userRole?: string;
}

export default function Sidebar({ userRole = 'MAYOR' }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['economy', 'social', 'construction', 'agriculture']);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const shouldShowItem = (item: MenuItem): boolean => {
    if (!item.requiredRole) return true;
    return item.requiredRole.includes(userRole);
  };

  const isActive = (href: string): boolean => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const renderMenuItem = (item: MenuItem, isChild = false) => {
    if (!shouldShowItem(item)) return null;

    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.id);
    const itemIsActive = item.href ? isActive(item.href) : false;

    if (hasChildren) {
      return (
        <div key={item.id} className="mb-1">
          <button
            onClick={() => toggleMenu(item.id)}
            className={clsx(
              'w-full sidebar-item',
              isExpanded && 'text-white bg-white/5'
            )}
          >
            {item.icon}
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                {isExpanded ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </>
            )}
          </button>
          {!collapsed && isExpanded && (
            <div className="ml-4 mt-1 space-y-0.5 border-l border-gray-700 pl-3">
              {item.children!.map(child => renderMenuItem(child, true))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        href={item.href || '#'}
        className={clsx(
          'sidebar-item',
          isChild ? 'py-2 text-xs' : '',
          itemIsActive && 'active'
        )}
        onClick={() => setMobileOpen(false)}
      >
        {item.icon}
        {!collapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  const sidebarContent = (
    <>
      <div className={clsx(
        'flex items-center gap-3 px-4 py-5 border-b border-gray-700/50',
        collapsed && 'justify-center px-2'
      )}>
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
          <LayoutDashboard size={22} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">E-Boshqaruv</h1>
            <p className="text-gray-400 text-[10px] leading-tight">Elektron Hokimiyat Tizimi</p>
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>

      <div className="p-3 border-t border-gray-700/50">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="sidebar-item w-full justify-center"
        >
          {collapsed ? (
            <ChevronRightIcon size={20} />
          ) : (
            <>
              <ChevronLeft size={20} />
              <span>Yig&apos;ish</span>
            </>
          )}
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-900 text-white shadow-lg"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={clsx(
          'fixed top-0 left-0 h-screen bg-[#0f172a] flex flex-col z-40 transition-all duration-300',
          collapsed ? 'w-[70px]' : 'w-[260px]',
          'hidden lg:flex'
        )}
      >
        {sidebarContent}
      </aside>

      <aside
        className={clsx(
          'fixed top-0 left-0 h-screen bg-[#0f172a] flex flex-col z-40 w-[260px] transition-transform duration-300 lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

'use client';

import React, { useState } from 'react';
import { Users, UserPlus, Shield, Trash2, Edit, Check, X, Key } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import KpiCard from '@/components/dashboard/KpiCard';

interface UserItem {
  id: number;
  fullName: string;
  username: string;
  email: string;
  role: string;
  roleDisplayName: string;
  isActive: boolean;
}

const initialUsers: UserItem[] = [
  { id: 1, fullName: "Moderator (Bosh admin)", username: "admin", email: "admin@e-boshqaruv.uz", role: "MODERATOR", roleDisplayName: "Moderator", isActive: true },
  { id: 2, fullName: "Tuman Hokimi", username: "hokim", email: "hokim@e-boshqaruv.uz", role: "MAYOR", roleDisplayName: "Tuman Hokimi", isActive: true },
  { id: 3, fullName: "Iqtisodiyot bo'yicha o'rinbosar", username: "orinbosar_iqtisod", email: "iqtisod@e-boshqaruv.uz", role: "DEPUTY_ECONOMY", roleDisplayName: "Iqtisodiyot o'rinbosari", isActive: true },
  { id: 4, fullName: "Ijtimoiy masalalar o'rinbosari", username: "orinbosar_ijtimoiy", email: "ijtimoiy@e-boshqaruv.uz", role: "DEPUTY_SOCIAL", roleDisplayName: "Ijtimoiy soha o'rinbosari", isActive: true },
  { id: 5, fullName: "Qurilish bo'yicha o'rinbosar", username: "orinbosar_qurilish", email: "qurilish@e-boshqaruv.uz", role: "DEPUTY_CONSTRUCTION", roleDisplayName: "Qurilish o'rinbosari", isActive: true },
  { id: 6, fullName: "Qishloq xo'jaligi o'rinbosari", username: "orinbosar_qishloq", email: "qishloq@e-boshqaruv.uz", role: "DEPUTY_AGRICULTURE", roleDisplayName: "Qishloq xo'jaligi o'rinbosari", isActive: true },
];

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState('DEPUTY_ECONOMY');

  const openAddModal = () => {
    setEditingUser(null);
    setFormName('');
    setFormUsername('');
    setFormEmail('');
    setFormPassword('');
    setFormRole('DEPUTY_ECONOMY');
    setShowModal(true);
  };

  const openEditModal = (user: UserItem) => {
    setEditingUser(user);
    setFormName(user.fullName);
    setFormUsername(user.username);
    setFormEmail(user.email);
    setFormPassword('');
    setFormRole(user.role);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Haqiqatan ham ushbu foydalanuvchini o'chirmoqchimisiz?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const roleNames: Record<string, string> = {
      MAYOR: "Tuman Hokimi",
      DEPUTY_ECONOMY: "Iqtisodiyot o'rinbosari",
      DEPUTY_SOCIAL: "Ijtimoiy soha o'rinbosari",
      DEPUTY_CONSTRUCTION: "Qurilish o'rinbosari",
      DEPUTY_AGRICULTURE: "Qishloq xo'jaligi o'rinbosari",
      MODERATOR: "Moderator",
    };

    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? {
        ...u,
        fullName: formName,
        username: formUsername,
        email: formEmail,
        role: formRole,
        roleDisplayName: roleNames[formRole] || formRole,
      } : u));
    } else {
      const newUser: UserItem = {
        id: Date.now(),
        fullName: formName,
        username: formUsername,
        email: formEmail,
        role: formRole,
        roleDisplayName: roleNames[formRole] || formRole,
        isActive: true,
      };
      setUsers([newUser, ...users]);
    }
    setShowModal(false);
  };

  const columns = [
    { key: 'fullName', label: 'F.I.Sh.', sortable: true },
    { key: 'username', label: 'Foydalanuvchi nomi', sortable: true },
    { key: 'email', label: 'Elektron pochta', sortable: true },
    {
      key: 'roleDisplayName',
      label: 'Tizimdagi roli',
      sortable: true,
      render: (val: string, row: UserItem) => (
        <span className={`badge ${row.role === 'MODERATOR' ? 'badge-danger' : row.role === 'MAYOR' ? 'badge-primary' : 'badge-info'}`}>
          {val}
        </span>
      ),
    },
    {
      key: 'isActive',
      label: 'Holati',
      render: (val: boolean) => (
        <span className={`badge ${val ? 'badge-success' : 'badge-danger'}`}>
          {val ? 'Faol' : 'Bloklangan'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Amallar',
      render: (_: any, row: UserItem) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditModal(row)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Tahrirlash"
          >
            <Edit size={16} />
          </button>
          {row.role !== 'MODERATOR' && (
            <button
              onClick={() => handleDelete(row.id)}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="O'chirish"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Foydalanuvchilar boshqaruvi</h1>
          <p className="text-sm text-gray-500 mt-1">Moderator boshqaruv paneli: Foydalanuvchilar va ularning rollarini boshqarish</p>
        </div>
        <button onClick={openAddModal} className="btn-primary">
          <UserPlus size={16} /> Yangi foydalanuvchi qo&apos;shish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard
          title="Jami foydalanuvchilar"
          value={users.length}
          subtitle="Tizimda ro'yxatda"
          icon={<Users size={24} />}
          color="blue"
        />
        <KpiCard
          title="Faol hisoblar"
          value={users.filter(u => u.isActive).length}
          subtitle="Ruxsat berilgan"
          icon={<Check size={24} />}
          color="green"
        />
        <KpiCard
          title="Boshqaruv rollari"
          value="6 ta"
          subtitle="RBAC ruxsatnomalar"
          icon={<Shield size={24} />}
          color="purple"
        />
      </div>

      <DataTable
        title="Foydalanuvchilar ro'yxati"
        columns={columns}
        data={users}
        searchPlaceholder="Ism yoki login bo'yicha qidirish..."
        onAdd={openAddModal}
        addLabel="Yangi xodim"
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">
                {editingUser ? "Foydalanuvchini tahrirlash" : "Yangi foydalanuvchi qo'shish"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">To&apos;liq F.I.Sh.</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="Masalan: Karim Aliyev"
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">Foydalanuvchi nomi (Login)</label>
                <input
                  type="text"
                  value={formUsername}
                  onChange={e => setFormUsername(e.target.value)}
                  placeholder="karim_aliyev"
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">Elektron pochta</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)}
                  placeholder="xodim@e-boshqaruv.uz"
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">
                  {editingUser ? "Yangi parol (o'zgartirish ixtiyoriy)" : "Parol"}
                </label>
                <input
                  type="password"
                  value={formPassword}
                  onChange={e => setFormPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input"
                  required={!editingUser}
                />
              </div>

              <div>
                <label className="form-label">Tizimdagi roli</label>
                <select
                  value={formRole}
                  onChange={e => setFormRole(e.target.value)}
                  className="form-input"
                >
                  <option value="MAYOR">Tuman Hokimi (Faqat ko&apos;rish)</option>
                  <option value="DEPUTY_ECONOMY">Iqtisodiyot bo&apos;yicha o&apos;rinbosar</option>
                  <option value="DEPUTY_SOCIAL">Ijtimoiy masalalar o&apos;rinbosari</option>
                  <option value="DEPUTY_CONSTRUCTION">Qurilish bo&apos;yicha o&apos;rinbosar</option>
                  <option value="DEPUTY_AGRICULTURE">Qishloq xo&apos;jaligi o&apos;rinbosari</option>
                  <option value="MODERATOR">Moderator (To&apos;liq huquq)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-outline flex-1"
                >
                  Bekor qilish
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

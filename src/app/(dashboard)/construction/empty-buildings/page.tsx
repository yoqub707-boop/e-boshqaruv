'use client';

import React, { useState } from 'react';
import { Building, MapPin, CheckCircle, Plus, Edit, Trash2, X } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import KpiCard from '@/components/dashboard/KpiCard';

interface BuildingItem {
  id: number;
  name: string;
  buildingType: string;
  area: number;
  address: string;
  ownerType: string;
  condition: string;
  proposedUse: string;
  isOccupied: boolean;
}

const initialData: BuildingItem[] = [
  { id: 1, name: "Eski poyabzal fabrikasi binosi", buildingType: "Sanoat", area: 3400, address: "Sanoat ko'chasi 14", ownerType: "Davlat", condition: "O'rtacha", proposedUse: "Kichik sanoat zonasi", isOccupied: false },
  { id: 2, name: "Sobiq ma'muriy bino", buildingType: "Ma'muriy", area: 1200, address: "Navoiy shoh ko'chasi 58", ownerType: "Davlat", condition: "Yaxshi", proposedUse: "IT park filiali", isOccupied: false },
  { id: 3, name: "Omborxona binosi", buildingType: "Logistika", area: 2100, address: "Temiryo'lchilar 2", ownerType: "Xususiy", condition: "Ta'mirtalab", proposedUse: "Agrologistika markazi", isOccupied: false },
  { id: 4, name: "Eski savdo majmuasi", buildingType: "Savdo", area: 4500, address: "Bozor ko'chasi 9", ownerType: "Xususiy", condition: "Yaxshi", proposedUse: "Hunarmandlar markazi", isOccupied: true },
];

export default function EmptyBuildingsPage() {
  const [data, setData] = useState<BuildingItem[]>(initialData);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<BuildingItem | null>(null);

  const [name, setName] = useState('');
  const [buildingType, setBuildingType] = useState('Sanoat');
  const [area, setArea] = useState(1000);
  const [address, setAddress] = useState('');
  const [ownerType, setOwnerType] = useState('Davlat');
  const [condition, setCondition] = useState('O\'rtacha');
  const [proposedUse, setProposedUse] = useState('');

  const openAdd = () => {
    setEditingItem(null);
    setName('');
    setBuildingType('Sanoat');
    setArea(1000);
    setAddress('');
    setOwnerType('Davlat');
    setCondition('O\'rtacha');
    setProposedUse('');
    setShowModal(true);
  };

  const openEdit = (item: BuildingItem) => {
    setEditingItem(item);
    setName(item.name);
    setBuildingType(item.buildingType);
    setArea(item.area);
    setAddress(item.address);
    setOwnerType(item.ownerType);
    setCondition(item.condition);
    setProposedUse(item.proposedUse);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu bo'sh binoni o'chirmoqchimisiz?")) {
      setData(data.filter(d => d.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setData(data.map(d => d.id === editingItem.id ? { ...d, name, buildingType, area, address, ownerType, condition, proposedUse } : d));
    } else {
      setData([{ id: Date.now(), name, buildingType, area, address, ownerType, condition, proposedUse, isOccupied: false }, ...data]);
    }
    setShowModal(false);
  };

  const columns = [
    { key: 'name', label: 'Bino / Obyekt nomi', sortable: true },
    { key: 'buildingType', label: 'Turi', sortable: true },
    { key: 'area', label: 'Maydoni (m²)', sortable: true, render: (val: number) => `${val.toLocaleString()} m²` },
    { key: 'address', label: 'Manzili', sortable: true },
    { key: 'ownerType', label: 'Mulkchilik', sortable: true },
    { key: 'proposedUse', label: 'Tavsiya etilgan maqsad', sortable: true },
    {
      key: 'isOccupied',
      label: 'Holati',
      sortable: true,
      render: (val: boolean) => (
        <span className={`badge ${val ? 'badge-success' : 'badge-warning'}`}>
          {val ? 'Faoliyat boshlangan' : "Bo'sh turibdi"}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Amallar',
      render: (_: any, row: BuildingItem) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(row)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
          <button onClick={() => handleDelete(row.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bo&apos;sh turgan bino va inshootlar</h1>
          <p className="text-sm text-gray-500 mt-1">Hududdagi samarasiz foydalanilayotgan bo&apos;sh ob&apos;ektlarni auksionga va tadbirkorlikka jalb etish</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Yangi bo&apos;sh bino kiritish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard title="Aniqlangan bo'sh binolar" value={`${data.length} ta`} subtitle="Monitoring natijasi" icon={<Building size={24} />} color="orange" />
        <KpiCard title="Jami bo'sh maydon" value="11,200 m²" subtitle="Foydalanilmayotgan" icon={<MapPin size={24} />} color="blue" />
        <KpiCard title="Auksionga chiqarilgan" value="5 ta" subtitle="E-auksion tizimida" icon={<CheckCircle size={24} />} color="green" />
        <KpiCard title="Ishga tushirilgan" value="3 ta" subtitle="Yangi korxonalar ochildi" icon={<CheckCircle size={24} />} color="teal" />
      </div>

      <DataTable
        title="Bo'sh binolar elektron bazasi"
        columns={columns}
        data={data}
        searchPlaceholder="Bino nomi yoki manzil bo'yicha qidirish..."
        onAdd={openAdd}
        addLabel="Yangi bino"
        onExport={() => alert("Excel ga eksport qilinmoqda...")}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">{editingItem ? "Binoni tahrirlash" : "Yangi bo'sh bino"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Bino / Inshoot nomi</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="form-input" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Bino turi</label>
                  <select value={buildingType} onChange={e => setBuildingType(e.target.value)} className="form-input">
                    <option value="Sanoat">Sanoat</option>
                    <option value="Ma'muriy">Ma&apos;muriy</option>
                    <option value="Savdo">Savdo</option>
                    <option value="Logistika">Logistika</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Maydoni (m²)</label>
                  <input type="number" value={area} onChange={e => setArea(Number(e.target.value))} className="form-input" required />
                </div>
              </div>
              <div>
                <label className="form-label">Manzili</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="form-input" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Mulkchilik shakli</label>
                  <select value={ownerType} onChange={e => setOwnerType(e.target.value)} className="form-input">
                    <option value="Davlat">Davlat</option>
                    <option value="Xususiy">Xususiy</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Holati</label>
                  <select value={condition} onChange={e => setCondition(e.target.value)} className="form-input">
                    <option value="Yaxshi">Yaxshi</option>
                    <option value="O'rtacha">O&apos;rtacha</option>
                    <option value="Ta'mirtalab">Ta&apos;mirtalab</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Tavsiya etilgan loyiha</label>
                <input type="text" value={proposedUse} onChange={e => setProposedUse(e.target.value)} className="form-input" required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">Bekor qilish</button>
                <button type="submit" className="btn-primary flex-1">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { DataTable } from '@/components/ui/data-table';
import { KpiCard } from '@/components/ui/kpi-card';

const data = [
  { id: 1, nomi: "20-maktab binosini ta'mirlash", pudratchi: "Qurilish Invest MCHJ", boshlanish: "2023-05-10", byudjet: "1.2 mlrd so'm", holati: "Jarayonda" },
  { id: 2, nomi: "Yangi poliklinika qurilishi", pudratchi: "Medical Build XK", boshlanish: "2023-01-15", byudjet: "3.5 mlrd so'm", holati: "Yakunlangan" },
  { id: 3, nomi: "Istirohat bog'i", pudratchi: "Green Park MCHJ", boshlanish: "2023-08-01", byudjet: "800 mln so'm", holati: "Kechikmoqda" },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Yakunlangan':
      return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">{status}</span>;
    case 'Jarayonda':
      return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">{status}</span>;
    case 'Kechikmoqda':
      return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">{status}</span>;
    default:
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>;
  }
};

const columns = [
  { header: "Obyekt nomi", accessorKey: "nomi" },
  { header: "Pudratchi", accessorKey: "pudratchi" },
  { header: "Boshlanish vaqti", accessorKey: "boshlanish" },
  { header: "Byudjet", accessorKey: "byudjet" },
  {
    header: "Holati",
    accessorKey: "holati",
    cell: ({ row }: any) => getStatusBadge(row.original.holati)
  }
];

export default function ConstructionProjectsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Qurilish obyektlari va loyihalar</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard title="Jami obyektlar" value="24" trend="+3" />
        <KpiCard title="Yakunlangan" value="8" trend="+2" />
        <KpiCard title="Umumiy byudjet" value="45.6 mlrd" trend="-2%" />
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}

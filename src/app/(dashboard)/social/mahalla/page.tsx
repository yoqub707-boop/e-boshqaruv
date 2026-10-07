import React from 'react';
import { DataTable } from '@/components/ui/data-table';
import { KpiCard } from '@/components/ui/kpi-card';
import { ProgressBar } from '@/components/ui/progress-bar';

const data = [
  { id: 1, nomi: "Navbahor", rais: "Azizov Alisher", aholi: 3500, xonadonlar: 750, muammoli: 45 },
  { id: 2, nomi: "Gulshan", rais: "Karimova Dildora", aholi: 4200, xonadonlar: 820, muammoli: 20 },
  { id: 3, nomi: "Do'stlik", rais: "Toshmatov Vali", aholi: 2800, xonadonlar: 600, muammoli: 60 },
  { id: 4, nomi: "Alisher Navoiy", rais: "Nazarov Bobur", aholi: 5100, xonadonlar: 1100, muammoli: 80 },
  { id: 5, nomi: "O'zbekiston", rais: "Eshmurodov Jasur", aholi: 3900, xonadonlar: 780, muammoli: 35 },
];

const columns = [
  { header: "Mahalla nomi", accessorKey: "nomi" },
  { header: "Rais", accessorKey: "rais" },
  { header: "Aholi soni", accessorKey: "aholi" },
  { header: "Xonadonlar", accessorKey: "xonadonlar" },
  {
    header: "Muammoli xonadonlar",
    accessorKey: "muammoli",
    cell: ({ row }: any) => (
      <div className="flex items-center gap-2">
        <span className="w-8 text-sm">{row.original.muammoli}%</span>
        <ProgressBar value={row.original.muammoli} />
      </div>
    )
  }
];

export default function MahallaPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Mahallalar kesimida ijtimoiy holat</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard title="Umumiy mahallalar" value="45" trend="+2%" />
        <KpiCard title="Jami aholi soni" value="125,400" trend="+1.5%" />
        <KpiCard title="Muammoli xonadonlar hal etildi" value="68%" trend="+5%" />
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}

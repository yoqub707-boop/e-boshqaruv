'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  Filter,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { clsx } from 'clsx';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  width?: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  title?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  onExport?: () => void;
  onAdd?: () => void;
  addLabel?: string;
  emptyMessage?: string;
}

export default function DataTable({
  columns,
  data,
  title,
  searchable = true,
  searchPlaceholder = "Qidirish...",
  pageSize = 10,
  onExport,
  onAdd,
  addLabel = "Qo'shish",
  emptyMessage = "Ma'lumot topilmadi",
}: DataTableProps) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Qidirish va filtrlash
  const filteredData = useMemo(() => {
    let result = [...data];

    // Qidirish
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(row =>
        columns.some(col => {
          const value = row[col.key];
          return value && String(value).toLowerCase().includes(searchLower);
        })
      );
    }

    // Saralash
    if (sortKey) {
      result.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, search, sortKey, sortDir, columns]);

  // Sahifalash
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Saralash
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className="card p-0">
      {/* Sarlavha va amallar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b">
        {title && <h3 className="text-base font-semibold text-gray-800">{title}</h3>}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {searchable && (
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 flex-1 sm:w-64">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
          )}
          {onExport && (
            <button onClick={onExport} className="btn-outline text-xs">
              <Download size={14} />
              Excel
            </button>
          )}
          {onAdd && (
            <button onClick={onAdd} className="btn-primary text-xs">
              <Plus size={14} />
              {addLabel}
            </button>
          )}
        </div>
      </div>

      {/* Jadval */}
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-12">#</th>
              {columns.map(col => (
                <th
                  key={col.key}
                  className={clsx(col.sortable && 'cursor-pointer select-none')}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-8 text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr key={row.id || idx}>
                  <td className="text-gray-400 font-mono text-xs">
                    {(currentPage - 1) * pageSize + idx + 1}
                  </td>
                  {columns.map(col => (
                    <td key={col.key}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Sahifalash */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t">
          <p className="text-sm text-gray-500">
            Jami: {filteredData.length} ta yozuv | Sahifa {currentPage} / {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page: number;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={clsx(
                    'w-8 h-8 rounded-lg text-sm font-medium',
                    currentPage === page
                      ? 'bg-primary-500 text-white'
                      : 'hover:bg-gray-100 text-gray-600'
                  )}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

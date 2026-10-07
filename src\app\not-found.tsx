import Link from 'next/link';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-yellow-50 flex items-center justify-center mb-6">
          <AlertTriangle size={40} className="text-yellow-500" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Sahifa topilmadi</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          Siz qidirayotgan sahifa mavjud emas yoki ko&apos;chirilgan.
        </p>
        <Link
          href="/dashboard"
          className="btn-primary inline-flex items-center gap-2"
        >
          <Home size={18} />
          Bosh sahifaga qaytish
        </Link>
      </div>
    </div>
  );
}

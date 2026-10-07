import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'E-Boshqaruv | Elektron Hokimiyat Boshqaruv Tizimi',
  description: 'Tuman hokimligi uchun elektron boshqaruv tizimi - ijtimoiy-iqtisodiy ko\'rsatkichlarni monitoring qilish va tahlil etish platformasi',
  keywords: 'e-boshqaruv, elektron hokimiyat, tuman hokimligi, boshqaruv tizimi',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

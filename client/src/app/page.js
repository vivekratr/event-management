'use client';
import Dashboard from '@/components/page/Dashboard';
import ToasterProvider from '@/providers/ToasterProvider';

export default function Home() {
  return (
    <>
      <Dashboard />
      <ToasterProvider />
    </>
  );
}

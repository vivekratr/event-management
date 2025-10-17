'use client';
import EventManagementDashboard from '@/components/events/Dashboard';
import ToasterProvider from '@/providers/ToasterProvider';

export default function Home() {
  return (
    <>
      <Dashboard />
      <ToasterProvider />
    </>
  );
}

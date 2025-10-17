import './globals.css';

export const metadata = {
  title: 'Event Management Dashboard',
  description: 'Manage events across timezones',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}

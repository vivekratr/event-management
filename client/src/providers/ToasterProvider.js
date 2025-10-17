// components/ToasterProvider.jsx
'use client';

import { Toaster } from 'sonner';

export default function ToasterProvider() {
    return <Toaster position="top-right" expand={true} richColors />;
}
// src/providers/ToasterProvider.jsx
'use client';
import React from 'react';
import { Toaster } from 'sonner';

export default function ToasterProvider() {
    return <Toaster position="top-right" expand richColors />;
}

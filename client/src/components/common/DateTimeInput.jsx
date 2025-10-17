'use client';
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { getTodayDateString } from '@/utils/dateUtils';


export default function DateTimeInput({ label, dateValue, timeValue, onDateChange, onTimeChange, minDate }) {
    return (
        <div>
            <Label>{label}</Label>
            <div className="flex gap-2 mt-2">
                <Input type="date" value={dateValue} onChange={(e) => onDateChange(e.target.value)} min={minDate || getTodayDateString()} />
                <Input type="time" value={timeValue} onChange={(e) => onTimeChange(e.target.value)} className="w-32" />
            </div>
        </div>
    );
}
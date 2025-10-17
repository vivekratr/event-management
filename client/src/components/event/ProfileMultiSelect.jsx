'use client';
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { ChevronDown } from 'lucide-react';


export default function ProfileMultiSelect({ selectedIds = [], onChange, profiles = [], label = 'Profiles' }) {
    const [isOpen, setIsOpen] = useState(false);


    return (
        <div>
            <Label>{label}</Label>
            <div className="mt-2 relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-left"
                >
                    <span className="text-sm text-gray-700">
                        {selectedIds.length > 0 ? `${selectedIds.length} profile(s) selected` : 'Select profiles...'}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>


                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                            {profiles.length === 0 ? (
                                <div className="px-3 py-2 text-sm text-gray-500">No profiles available</div>
                            ) : (
                                profiles.map((profile) => (
                                    <label
                                        key={profile._id}
                                        className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(profile._id)}
                                            onChange={(e) => {
                                                const newIds = e.target.checked ? [...selectedIds, profile._id] : selectedIds.filter((id) => id !== profile._id);
                                                onChange(newIds);
                                            }}
                                            className="mr-3 h-4 w-4 text-blue-600 rounded border-gray-300"
                                        />
                                        <span className="text-sm text-gray-700">{profile.name}</span>
                                    </label>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
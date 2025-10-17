'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Edit2, Users } from 'lucide-react';
import { formatDateTime } from '@/utils/timezoneUtils';
import { getUsernameById } from '@/utils/userUtils';

export default function EventCard({ event, profiles, viewTimezone, onEdit }) {
    const start = formatDateTime(event.start, event.timezone, viewTimezone);
    const end = formatDateTime(event.end, event.timezone, viewTimezone);

    const participantNames = (event.profiles || [])
        .map((id) => getUsernameById(id, profiles))
        .join(', ');

    return (
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all">
            <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800 text-lg">
                        {participantNames || 'Untitled Event'}
                    </h3>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(event)}
                        className="text-gray-500 hover:text-blue-600"
                        title="Edit Event"
                    >
                        <Edit2 className="h-4 w-4" />
                    </Button>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>
                            <strong>Participants:</strong> {participantNames || '—'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>
                            <strong>Timezone:</strong> {event.timezone}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>
                            <strong>Start:</strong> {start}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>
                            <strong>End:</strong> {end}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

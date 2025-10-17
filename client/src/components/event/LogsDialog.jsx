'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { getUsernameById } from '@/utils/userUtils';
import { formatDateTime } from '@/utils/timezoneUtils';
import { useStore } from '@/hooks/useStore';

export default function LogsDialog({ logs = [], children, profiles = [] }) {
      const {
          
           
            viewTimezone,
           
        } = useStore();
    const renderProfileArray = (value, profiles) => {
      
        if (!Array.isArray(value)) return JSON.stringify(value);
        return value.map(id => getUsernameById(id, profiles) || id).join(', ');
    };

    const renderChange = (change, profiles) => {
        if (!change) return null;

       
            if (change.field === 'profiles') {
            return (
                <div className="text-sm">
                    <span className="font-medium">{change.field}:</span>
                    <div className="ml-2 mt-1">
                        <div className="font-medium">Old:</div>
                        <div className="ml-2">{renderProfileArray(change.oldValue, profiles)}</div>
                        <div className="font-medium mt-1">New:</div>
                        <div className="ml-2">{renderProfileArray(change.newValue, profiles)}</div>
                    </div>
                </div>
            );
        }
            else if (change.field === 'startDateTime' || change.field === 'endDateTime') {
                const start = formatDateTime(change.oldValue, 'UTC', viewTimezone);
                const end = formatDateTime(change.newValue, 'UTC', viewTimezone);
                return (
                    <div className="text-sm">
                        <span className="font-medium">{change.field}:</span>
                        <div className="ml-2 mt-1">
                            <div className="font-medium">Old:</div>
                            <div className="ml-2">{start}</div>
                            <div className="font-medium mt-1">New:</div>
                            <div className="ml-2">{end}</div>
                        </div>
                    </div>
                );
            }

        return (
            <div  className="text-sm">
                <span className="font-medium">{change.field}:</span> 
                <div className="ml-2 mt-1">
                    <div className="font-medium">Old: {change.oldValue}</div>
                    <div className="font-medium mt-1">New: {change.newValue}</div>
                </div>
            </div>
        );
        
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children || <Button variant="outline">Show Logs</Button>}
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Event Logs</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {logs.length === 0 ? (
                        <p className="text-gray-500">No logs available</p>
                    ) : (
                        <div className="space-y-4">
                            {logs.map((log, index) => {
                                const username = log.updatedBy ?
                                    getUsernameById(log.updatedBy, profiles) :
                                    'System';

                                return (
                                    <div key={index} className="p-4 border rounded-lg bg-white shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-sm text-gray-600">
                                                {format(new Date(log.timestamp), 'PPpp')}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Updated by: <span className="font-medium">{username}</span>
                                            </div>
                                        </div>

                                        {log.changes?.map((change, changeIndex) => (
                                            <div key={changeIndex} className="mt-2 p-3 bg-gray-50 rounded border">
                                                <div className="font-medium text-gray-800 mb-1">Changes:</div>
                                                {renderChange(change, profiles)}
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
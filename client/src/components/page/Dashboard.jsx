'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Edit, FileText, Plus, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

import { useStore } from '@/hooks/useStore';
import { TIMEZONES } from '@/lib/constants';
import { formatDateTime } from '@/utils/timezoneUtils';
import { valiDate} from '@/utils/validation';
import { getUsernameById } from '@/utils/userUtils';
import DateTimeInput from '@/components/common/DateTimeInput';
import ProfileMultiSelect from '@/components/event/ProfileMultiSelect';
import EventCard from '@/components/event/EventCard';
import EventForm from '@/components/event/EventForm';

export default function EventDashboard() {
    const {
        profiles,
        events,
        currentUser,
        viewTimezone,
        loading,
        error,
        setCurrentUser,
        setViewTimezone,
        fetchProfiles,
        fetchEvents,
        createProfile,
        createEvent,
        updateEvent,
    } = useStore();

    const [showCreateProfile, setShowCreateProfile] = useState(false);
    const [showCreateEvent, setShowCreateEvent] = useState(false);
    const [showEditEvent, setShowEditEvent] = useState(false);
    const [showLogs, setShowLogs] = useState(false);

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newProfileName, setNewProfileName] = useState('');

    const [createEventForm, setCreateEventForm] = useState({
        profiles: [],
        timezone: 'America/New_York',
        startDate: '',
        startTime: '09:00',
        endDate: '',
        endTime: '10:00',
    });

    const [editEventForm, setEditEventForm] = useState({
        profiles: [],
        timezone: 'America/New_York',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
    });

    const [formError, setFormError] = useState('');
    const [eventLogs, setEventLogs] = useState([]);

    useEffect(() => {
        fetchProfiles();
    }, []);

    useEffect(() => {
        if (currentUser) fetchEvents(currentUser);
       
    }, [currentUser]);

    const handleCreateProfile = async () => {
        if (!newProfileName.trim()) return;
        try {
            await createProfile(newProfileName, currentUser);
            toast.success(`New profile: ${newProfileName}`);
            setNewProfileName('');
            setShowCreateProfile(false);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleCreateEvent = async () => {
        const validationError = valiDate(createEventForm);
        if (validationError) {
            setFormError(validationError);
            return;
        }

        const createISODate = (dateStr, timeStr) => {
            const [year, month, day] = dateStr.split('-').map(Number);
            const [hours, minutes] = timeStr.split(':').map(Number);
            const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
            return date.toISOString();
        };

        const payload = {
            profiles: createEventForm.profiles,
            timezone: createEventForm.timezone,
            start: createISODate(createEventForm.startDate, createEventForm.startTime),
            end: createISODate(createEventForm.endDate, createEventForm.endTime),
            createdBy: currentUser,
        };

        console.log('Creating event with payload:', payload);

        try {
            await createEvent(payload);
            toast.success('Your event has been added successfully.');
            setCreateEventForm({
                profiles: [],
                timezone: 'America/New_York',
                startDate: '',
                startTime: '09:00',
                endDate: '',
                endTime: '10:00',
            });
            setShowCreateEvent(false);
            fetchEvents(currentUser);
        } catch (error) {
            toast('Unauthorized Action',"Only Admin can create users")
            setFormError(error.message || 'Failed to create event');
        }
    };

    const handleUpdateEvent = async () => {
        if (!selectedEvent) return;

        const validationError = valiDate(editEventForm);
        if (validationError) {
            setFormError(validationError);
            return;
        }

        const createISODate = (dateStr, timeStr) => {
            const [year, month, day] = dateStr.split('-').map(Number);
            const [hours, minutes] = timeStr.split(':').map(Number);
            const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
            return date.toISOString();
        };

        const payload = {
            requesterId:currentUser,
            profiles: editEventForm.profiles,
            timezone: editEventForm.timezone,
            start: createISODate(editEventForm.startDate, editEventForm.startTime),
            end: createISODate(editEventForm.endDate, editEventForm.endTime),
        };

        console.log('Updating event with payload:', payload);

        try {
            await updateEvent(selectedEvent._id, payload);
            toast.success('Changes saved successfully.');
            setShowEditEvent(false);
            fetchEvents(currentUser);
        } catch (error) {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
            setFormError(error.message || 'Failed to update event');
        }
    };

    const openCreateEventDialog = () => {
        setCreateEventForm({
            profiles: [],
            timezone: 'America/New_York',
            startDate: '',
            startTime: '09:00',
            endDate: '',
            endTime: '10:00',
        });
        setFormError('');
        setShowCreateEvent(true);
    };

    const openEditDialog = (event) => {
        try {
            const parseDate = (dateString) => {
                if (!dateString) return new Date();
                const normalized = dateString.replace(' ', 'T');
                const date = new Date(normalized);
                if (isNaN(date.getTime())) throw new Error('Invalid date format');
                return date;
            };

            const startDate = parseDate(event.startUTC);
            const endDate = parseDate(event.endUTC);

            const pad = (num) => num.toString().padStart(2, '0');
            const formatDate = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
            const formatTime = (date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`;

            setSelectedEvent(event);
            setEditEventForm({
                profiles: event.profiles || [],
                timezone: event.timezone || 'America/New_York',
                startDate: formatDate(startDate),
                startTime: formatTime(startDate),
                endDate: formatDate(endDate),
                endTime: formatTime(endDate),
            });

            setFormError('');
            setShowEditEvent(true);
        } catch (error) {
            console.error('Error parsing event dates:', error);
            toast.error('Error loading event data. Please try again.');
        }
    };
      

    const userEvents = events.filter((e) => e.profiles?.includes(currentUser));

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
                        <p className="text-gray-600 mt-1">Create and manage events across timezones</p>
                    </div>

                    <Select value={currentUser || ''} onValueChange={setCurrentUser}>
                        <SelectTrigger className="w-64">
                            <SelectValue placeholder="Select profile" />
                        </SelectTrigger>
                        <SelectContent>
                            {profiles.map((p) => (
                                <SelectItem key={p._id} value={p._id}>
                                    {p.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Create Event</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ProfileMultiSelect
                                selectedIds={createEventForm.profiles}
                                onChange={(ids) => setCreateEventForm({ ...createEventForm, profiles: ids })}
                                profiles={profiles}
                            />

                            {profiles.find((obj)=>obj?.role === 'admin')?._id === currentUser &&  <Dialog open={showCreateProfile} onOpenChange={setShowCreateProfile}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="w-full">
                                        <Plus className="mr-2 h-4 w-4" /> New Profile
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Create New Profile</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 pt-4">
                                        <Label>Profile Name</Label>
                                        <Input
                                            value={newProfileName}
                                            onChange={(e) => setNewProfileName(e.target.value)}
                                            placeholder="Enter name"
                                        />
                                        <Button onClick={handleCreateProfile} disabled={loading} className="w-full">
                                            {loading ? 'Creating...' : 'Create'}
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>}

                            <div>
                                <Label>Timezone</Label>
                                <Select
                                    value={createEventForm.timezone}
                                    onValueChange={(v) => setCreateEventForm({ ...createEventForm, timezone: v })}
                                >
                                    <SelectTrigger className="mt-2">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TIMEZONES.map((tz) => (
                                            <SelectItem key={tz.value} value={tz.value}>
                                                {tz.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <DateTimeInput
                                label="Start Date & Time"
                                dateValue={createEventForm.startDate}
                                timeValue={createEventForm.startTime}
                                onDateChange={(d) => setCreateEventForm({ ...createEventForm, startDate: d })}
                                onTimeChange={(t) => setCreateEventForm({ ...createEventForm, startTime: t })}
                            />

                            <DateTimeInput
                                label="End Date & Time"
                                dateValue={createEventForm.endDate}
                                timeValue={createEventForm.endTime}
                                onDateChange={(d) => setCreateEventForm({ ...createEventForm, endDate: d })}
                                onTimeChange={(t) => setCreateEventForm({ ...createEventForm, endTime: t })}
                            />

                            {formError && (
                                <Alert variant="destructive">
                                    <AlertDescription>{formError}</AlertDescription>
                                </Alert>
                            )}

                            <Button 
                                onClick={openCreateEventDialog} 
                                className="w-full"
                            >
                                <Plus className="mr-2 h-4 w-4" /> Create New Event
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Events</CardTitle>
                            <div className="pt-2">
                                <Label>View in Timezone</Label>
                                <Select value={viewTimezone} onValueChange={setViewTimezone}>
                                    <SelectTrigger className="mt-2">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TIMEZONES.map((tz) => (
                                            <SelectItem key={tz.value} value={tz.value}>
                                                {tz.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="text-center py-12 text-gray-500">
                                    <Clock className="mx-auto h-12 w-12 mb-4 animate-spin opacity-50" />
                                    <p>Loading events...</p>
                                </div>
                            ) : userEvents.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                    <p>No events yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                    {userEvents.map((event) => (
                                        <EventCard
                                            key={event._id}
                                            event={event}
                                            profiles={profiles}
                                            viewTimezone={viewTimezone}
                                            onEdit={openEditDialog}
                                        />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Create Event dialog */}
                <Dialog  open={showCreateEvent} onOpenChange={setShowCreateEvent}>
                    <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Event</DialogTitle>
                        </DialogHeader>
                        <EventForm 
                            formData={createEventForm}
                            setFormData={setCreateEventForm}
                            profiles={profiles}
                            formError={formError}
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowCreateEvent(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreateEvent} disabled={loading}>
                                {loading ? 'Creating...' : 'Create Event'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Edit evebt dialog */}
                <Dialog open={showEditEvent} onOpenChange={setShowEditEvent}>
                    <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit Event</DialogTitle>
                        </DialogHeader>
                        <EventForm 
                            formData={editEventForm}
                            setFormData={setEditEventForm}
                            profiles={profiles}
                            formError={formError}
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowEditEvent(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleUpdateEvent} disabled={loading}>
                                {loading ? 'Updating...' : 'Save Changes'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

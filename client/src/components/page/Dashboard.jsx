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
import { toast } from '@/components/ui/use-toast';

import { useStore } from '@/hooks/useStore';
import { TIMEZONES } from '@/lib/constants';
import { formatDateTime } from '@/utils/timezoneUtils';
import { validateEventForm } from '@/utils/validationUtils';
import { getUsernameById } from '@/utils/userUtils';
import DateTimeInput from '@/components/common/DateTimeInput';
import ProfileMultiSelect from './ProfileMultiSelect';
import EventCard from './EventCard';

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
    const [showEditEvent, setShowEditEvent] = useState(false);
    const [showLogs, setShowLogs] = useState(false);

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newProfileName, setNewProfileName] = useState('');
    const [eventForm, setEventForm] = useState({
        profiles: [],
        timezone: 'America/New_York',
        startDate: '',
        startTime: '09:00',
        endDate: '',
        endTime: '09:00',
    });
    const [formError, setFormError] = useState('');
    const [eventLogs, setEventLogs] = useState([]);

    // Fetch initial data
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
            toast({ title: 'Profile Created', description: `New profile: ${newProfileName}` });
            setNewProfileName('');
            setShowCreateProfile(false);
        } catch (error) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    };

    const handleCreateEvent = async () => {
        const payload = {
            profiles: eventForm.profiles,
            timezone: eventForm.timezone,
            start: `${eventForm.startDate}T${eventForm.startTime}:00`,
            end: `${eventForm.endDate}T${eventForm.endTime}:00`,
            createdBy: currentUser,
        };

        const validationError = validateEventForm(eventForm);
        if (validationError) {
            setFormError(validationError);
            return;
        }

        try {
            await createEvent(payload);
            toast({ title: 'Event Created', description: 'Your event has been added successfully.' });
            setEventForm({
                profiles: [],
                timezone: 'America/New_York',
                startDate: '',
                startTime: '09:00',
                endDate: '',
                endTime: '09:00',
            });
            fetchEvents(currentUser);
        } catch (error) {
            setFormError(error.message || 'Failed to create event');
        }
    };

    const handleUpdateEvent = async () => {
        if (!selectedEvent) return;
        const payload = {
            profiles: eventForm.profiles,
            timezone: eventForm.timezone,
            start: `${eventForm.startDate}T${eventForm.startTime}:00`,
            end: `${eventForm.endDate}T${eventForm.endTime}:00`,
            requesterId: currentUser,
        };

        const validationError = validateEventForm(eventForm);
        if (validationError) {
            setFormError(validationError);
            return;
        }

        try {
            await updateEvent(selectedEvent._id, payload);
            toast({ title: 'Event Updated', description: 'Changes saved successfully.' });
            setShowEditEvent(false);
            fetchEvents(currentUser);
        } catch (error) {
            setFormError(error.message || 'Failed to update event');
        }
    };

    const openEditDialog = (event) => {
        const startDate = new Date(event.start);
        const endDate = new Date(event.end);
        setSelectedEvent(event);
        setEventForm({
            profiles: event.profiles || [],
            timezone: event.timezone || 'America/New_York',
            startDate: startDate.toISOString().split('T')[0],
            startTime: startDate.toTimeString().slice(0, 5),
            endDate: endDate.toISOString().split('T')[0],
            endTime: endDate.toTimeString().slice(0, 5),
        });
        setFormError('');
        setShowEditEvent(true);
    };

    const userEvents = events.filter((e) => e.profiles?.includes(currentUser));

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
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
                    {/* Left: Create Event */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Create Event</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ProfileMultiSelect
                                selectedIds={eventForm.profiles}
                                onChange={(ids) => setEventForm({ ...eventForm, profiles: ids })}
                                profiles={profiles}
                            />

                            <Dialog open={showCreateProfile} onOpenChange={setShowCreateProfile}>
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
                            </Dialog>

                            <div>
                                <Label>Timezone</Label>
                                <Select
                                    value={eventForm.timezone}
                                    onValueChange={(v) => setEventForm({ ...eventForm, timezone: v })}
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
                                dateValue={eventForm.startDate}
                                timeValue={eventForm.startTime}
                                onDateChange={(d) => setEventForm({ ...eventForm, startDate: d })}
                                onTimeChange={(t) => setEventForm({ ...eventForm, startTime: t })}
                            />

                            <DateTimeInput
                                label="End Date & Time"
                                dateValue={eventForm.endDate}
                                timeValue={eventForm.endTime}
                                onDateChange={(d) => setEventForm({ ...eventForm, endDate: d })}
                                onTimeChange={(t) => setEventForm({ ...eventForm, endTime: t })}
                            />

                            {formError && (
                                <Alert variant="destructive">
                                    <AlertDescription>{formError}</AlertDescription>
                                </Alert>
                            )}

                            <Button onClick={handleCreateEvent} disabled={loading} className="w-full">
                                <Plus className="mr-2 h-4 w-4" /> {loading ? 'Creating...' : 'Create Event'}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Right: Event List */}
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

                {/* Edit Event Dialog */}
                <Dialog open={showEditEvent} onOpenChange={setShowEditEvent}>
                    <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit Event</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <ProfileMultiSelect
                                selectedIds={eventForm.profiles}
                                onChange={(ids) => setEventForm({ ...eventForm, profiles: ids })}
                                profiles={profiles}
                            />
                            <Label>Timezone</Label>
                            <Select
                                value={eventForm.timezone}
                                onValueChange={(v) => setEventForm({ ...eventForm, timezone: v })}
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

                            <DateTimeInput
                                label="Start Date & Time"
                                dateValue={eventForm.startDate}
                                timeValue={eventForm.startTime}
                                onDateChange={(d) => setEventForm({ ...eventForm, startDate: d })}
                                onTimeChange={(t) => setEventForm({ ...eventForm, startTime: t })}
                            />

                            <DateTimeInput
                                label="End Date & Time"
                                dateValue={eventForm.endDate}
                                timeValue={eventForm.endTime}
                                onDateChange={(d) => setEventForm({ ...eventForm, endDate: d })}
                                onTimeChange={(t) => setEventForm({ ...eventForm, endTime: t })}
                            />

                            {formError && (
                                <Alert variant="destructive">
                                    <AlertDescription>{formError}</AlertDescription>
                                </Alert>
                            )}

                            <Button onClick={handleUpdateEvent} disabled={loading} className="w-full">
                                {loading ? 'Updating...' : 'Update Event'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

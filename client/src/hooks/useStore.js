import { create } from 'zustand';
import axiosClient from '@/lib/axiosClient';

export const useStore = create((set, get) => ({
    profiles: [],
    events: [],
    currentUser: null,
    viewTimezone: 'America/New_York',
    loading: false,
    error: null,

    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setCurrentUser: (userId) => set({ currentUser: userId }),
    setViewTimezone: (tz) => set({ viewTimezone: tz }),

    fetchProfiles: async () => {
        set({ loading: true });
        try {
            const { data } = await axiosClient.get('/profiles');
            set({ profiles: data, loading: false });
            if (!get().currentUser && data.length) set({ currentUser: data[0]._id });
        } catch (e) {
            set({ error: e.message, loading: false });
        }
    },

    fetchEvents: async (profileId) => {
        if (!profileId) return;
        set({ loading: true });
        try {
            const { data } = await axiosClient.get(`/events?profile=${profileId}`);
            set({ events: data, loading: false });
        } catch (e) {
            set({ error: e.message, loading: false });
        }
    },

    createProfile: async (name, adminId) => {
        try {
            const { data } = await axiosClient.post('/profiles', { name, adminProfileId: adminId });
            set({ profiles: [...get().profiles, data] });
            return data;
        } catch (e) {
            throw new Error(e.message);
        }
    },

    createEvent: async (payload) => {
        try {
            const { data } = await axiosClient.post('/events', payload);
            set({ events: [...get().events, data] });
            return data;
        } catch (e) {
            throw new Error(e.message);
        }
    },

    updateEvent: async (id, payload) => {
        try {
            const { data } = await axiosClient.patch(`/events/${id}`, payload);
            set({
                events: get().events.map((e) => (e._id === id ? data : e)),
            });
            return data;
        } catch (e) {
            throw new Error(e.message);
        }
    },
}));

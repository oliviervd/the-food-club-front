'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const UserContext = createContext();

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || '';

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);         // current logged-in user or null
    const [loading, setLoading] = useState(true);   // true while checking session on mount
    const [error, setError] = useState(null);

    // Check if there's an active session on mount
    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await fetch(`${PAYLOAD_URL}/api/users/me`, {
                    credentials: 'include', // sends the Payload session cookie
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user || null);
                } else {
                    setUser(null);
                }
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchMe();
    }, []);

    const login = useCallback(async (email, password) => {
        setError(null);
        try {
            const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.errors?.[0]?.message || 'Login failed');
                return false;
            }
            setUser(data.user);
            return true;
        } catch {
            setError('Something went wrong. Please try again.');
            return false;
        }
    }, []);

    const register = useCallback(async (email, password, firstName) => {
        setError(null);
        try {
            const res = await fetch(`${PAYLOAD_URL}/api/users`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    firstName,
                    role: ['user'],
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.errors?.[0]?.message || 'Registration failed');
                return false;
            }
            // Auto-login after register
            return await login(email, password);
        } catch {
            setError('Something went wrong. Please try again.');
            return false;
        }
    }, [login]);

    const logout = useCallback(async () => {
        try {
            await fetch(`${PAYLOAD_URL}/api/users/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } finally {
            setUser(null);
        }
    }, []);

    // Save or update a venue in the user's savedVenues list
    const saveVenue = useCallback(async (venueId, status) => {
        if (!user) return false;

        const currentSaved = user.savedVenues || [];

        // Check if already saved — update status if so, add if not
        const exists = currentSaved.find(
            (s) => (typeof s.venue === 'object' ? s.venue.id : s.venue) === venueId
        );

        let updatedSaved;
        if (exists) {
            // Toggle off if same status clicked again
            if (exists.status === status) {
                updatedSaved = currentSaved.filter(
                    (s) => (typeof s.venue === 'object' ? s.venue.id : s.venue) !== venueId
                );
            } else {
                // Switch status
                updatedSaved = currentSaved.map((s) =>
                    (typeof s.venue === 'object' ? s.venue.id : s.venue) === venueId
                        ? { ...s, status }
                        : s
                );
            }
        } else {
            updatedSaved = [...currentSaved, { venue: venueId, status }];
        }

        try {
            const res = await fetch(`${PAYLOAD_URL}/api/users/${user.id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    savedVenues: updatedSaved.map((s) => ({
                        venue: typeof s.venue === 'object' ? s.venue.id : s.venue,
                        status: s.status,
                    })),
                }),
            });

            if (!res.ok) return false;

            const data = await res.json();
            setUser(data.doc);
            return true;
        } catch {
            return false;
        }
    }, [user]);

    // Get the saved status for a specific venue
    const getSavedStatus = useCallback((venueId) => {
        if (!user?.savedVenues) return null;
        const entry = user.savedVenues.find(
            (s) => (typeof s.venue === 'object' ? s.venue.id : s.venue) === venueId
        );
        return entry?.status || null;
    }, [user]);

    return (
        <UserContext.Provider value={{
            user,
            loading,
            error,
            setError,
            login,
            register,
            logout,
            saveVenue,
            getSavedStatus,
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
'use client'

import {useQuery} from "@tanstack/react-query";
import {terraceIsSunny} from "./isSunny.tsx";

export const useSunnyVenues = (venues) => {
    return useQuery({
        // Unique query key that includes current date and time (to refresh every 5 minutes)
        queryKey: ['sunnyVenues', Math.floor(Date.now() / (5 * 60 * 1000))],

        // Query function to calculate sunny venues
        queryFn: () => {
            const sunnyVenues = new Set();

            venues.forEach(venue => {
                if (!venue.information?.hasTerrace || !venue.information?.orientation) return;

                try {
                    const sunHere = terraceIsSunny(venue);
                    if (sunHere) sunnyVenues.add(venue.id);
                } catch (error) {
                    console.error(`Sun calculation error for venue ${venue.id}:`, error);
                }
            });

            return sunnyVenues;
        },

        // Only run when venues are available
        enabled: venues.length > 0,

        // Refresh every 5 minutes
        staleTime: 1000 * 60 * 5,

        // Keep previous data while refetching
        keepPreviousData: true,

        // Refetch in the background
        refetchInterval: 1000 * 60 * 5

    });
};

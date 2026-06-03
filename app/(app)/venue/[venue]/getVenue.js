import { cache } from 'react';

const SERVER_URL =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.PAYLOAD_PUBLIC_SERVER_URL ||
    'https://thefoodclub.be';

export const getVenue = cache(async (venueSlug) => {
    const res = await fetch(
        `${SERVER_URL}/api/venues?where[url][equals]=${venueSlug}&depth=2`,
        { next: { revalidate: 60 } }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data.docs?.[0] || null;
});
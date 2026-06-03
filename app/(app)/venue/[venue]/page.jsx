import VenueClient from "./venueClient.jsx";
import { getVenue } from "./getVenue";

export async function generateMetadata({ params }) {
    const venue = await getVenue(params.venue);

    if (!venue) return {};

    const seo = venue.meta || {};
    const title = seo.title || venue.venueName || 'Venue';
    const description = seo.description || '';
    const image = seo.image?.url || '';

    const noIndex = Boolean(process.env.NEXT_PUBLIC_ROBOTS_META);

    return {
        title,
        description,
        keywords: [
            venue.venueName,
            venue.information?.address?.city,
            venue.information?.address?.street,
            venue.information?.address?.postalCode,
            'food', 'restaurant', 'thefoodclub', 'thefoodclub.be',
            'foodclub', 'foodclub.be', 'the food club',
        ].filter(Boolean),
        openGraph: {
            title,
            description,
            images: image ? [{ url: image }] : [],
            url: `https://www.thefoodclub.be/venue/${params.venue}`,
            type: 'website',
            site_name: 'The Food Club',
            locale: 'en_GB',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: image ? [{ url: image }] : [],
        },
        robots: {
            index: !noIndex,
            follow: !noIndex,
            googleBot: {
                index: !noIndex,
                follow: !noIndex,
                noImageIndex: false,
            },
        },
        alternates: {
            canonical: `https://www.thefoodclub.be/venue/${params.venue}`,
        },
    };
}

export default async function VenuePage({ params }) {
    const venue = await getVenue(params.venue);

    if (!venue) {
        return <div>Venue not found.</div>;
    }

    const address = venue.information?.address || {};
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "name": venue.venueName,
        "url": `https://www.thefoodclub.be/venue/${params.venue}`,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": address.street || '',
            "addressLocality": address.city || '',
            "postalCode": address.postalCode || '',
            "addressCountry": "BE",
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <VenueClient initialVenue={venue} />
        </>
    );
}
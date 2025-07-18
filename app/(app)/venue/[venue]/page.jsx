import VenueClient from "./venueClient.jsx";
import Head from 'next/head';

export async function generateMetadata({ params }) {
    const res = await fetch(
        `https://thefoodclub.be/api/venues?where[url][equals]=${params.venue}&depth=2`,
        { next: { revalidate: 60 } }
    );
    const data = await res.json();
    const venue = data.docs[0];

    if (!venue) return {};

    const seo = venue.meta || {};
    const title = seo.title || venue.venueName || 'Venue';
    const description = seo.description || '';
    const image = seo.image?.url || '';

    return {
        title: title,
        description: description,
        keywords: [venue.venueName, venue.information.address?.city, venue.information.address?.street, venue.information.address?.postalCode, 'food', 'restaurant', 'thefoodclub', 'thefoodclub.be', 'foodclub', 'foodclub.be', 'the food club'],
        openGraph: {
            title,
            description,
            images: [{ url: image }],
            url: `https://thefoodclub.be/venue/${params.venue}`,
            type: 'website',
            site_name: 'The Food Club',
            locale: 'en_GB',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [{ url: image }],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                noImageIndex: false,
            },
        },
        alternates: {
            canonical: `https://www.thefoodclub.be/venue/${params.venue}`,
        },
    };
}

export default async function VenuePage({ params }) {
    const res = await fetch(
        `https://thefoodclub.be/api/venues?where[url][equals]=${params.venue}&depth=2`,
        { next: { revalidate: 60 } }
    );
    const data = await res.json();
    const venue = data.docs[0] || null;

    if (!venue) {
        return <div>Venue not found.</div>;
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "name": venue.venueName,
        "url": `https://www.thefoodclub.be/venue/${params.venue}`,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": venue.information.address?.street || '',
            "addressLocality": venue.information.address?.city || '',
            "postalCode": venue.information.address?.postalCode || '',
            "addressCountry": "BE"
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
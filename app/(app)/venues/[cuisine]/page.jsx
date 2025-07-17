import { Suspense } from 'react';
import VenuesClient from './venuesClient.jsx'; // or adjust path if needed

export async function generateMetadata({ params }) {
    return {
        title: `The Food Club - ${params.cuisine}`,
        description: `Discover the best ${params.cuisine} spots.`,
        images:[{url:"https://d3nidktcupd88v.cloudfront.net/HERO-map-2387x1554.jpg", alt:"hero image for the Food Club Map"}],
        openGraph: {
            title: `The Food Club - ${params.cuisine}`,
            description: `Discover the best ${params.cuisine} spots.`,
            images:[{url:"https://d3nidktcupd88v.cloudfront.net/HERO-map-2387x1554.jpg", alt:"hero image for cuisine page"}],
        },
        alternates: {
            canonical: `https://www.thefoodclub.com/venues/${params.cuisine}`,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                noImageIndex: false,
            }
        },
        url: `https://www.thefoodclub.com/venues/${params.cuisine}`,
    };
}

export default function VenuesPage({ params }) {
    return (
        <Suspense fallback={<div>Loading venues...</div>}>
            <VenuesClient cuisine={params.cuisine} />
        </Suspense>
    );
}
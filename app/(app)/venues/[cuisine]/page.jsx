import { Suspense } from 'react';
import VenuesClient from './venuesClient.jsx'; // or adjust path if needed

export async function generateMetadata({ params }) {
    return {
        title: `The Food Club - ${params.cuisine}`,
        description: `Discover the best ${params.cuisine} spots.`,
        openGraph: {
            title: `The Food Club - ${params.cuisine}`,
            description: `Discover the best ${params.cuisine} spots.`,
        },
        canonical: `https://www.thefoodclub.com/venues/${params.cuisine}`,
    };
}

export default function VenuesPage({ params }) {
    return (
        <Suspense fallback={<div>Loading venues...</div>}>
            <VenuesClient cuisine={params.cuisine} />
        </Suspense>
    );
}
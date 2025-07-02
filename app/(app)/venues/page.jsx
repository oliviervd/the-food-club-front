import { Suspense } from 'react';
import VenuesClient from './venuesClient.jsx';

export default function VenuesPage() {
    return (
        <Suspense fallback={<div>Loading venues...</div>}>
            <VenuesClient />
        </Suspense>
    );
}
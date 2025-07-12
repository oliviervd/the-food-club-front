import { Suspense } from 'react';
import VenuesClient from './venuesClient.jsx';

export async function generateMetadata({params}) {

    console.log(params.cuisine)

    return{

    }
}

export default function VenuesPage() {
    return (
        <Suspense fallback={<div>Loading venues...</div>}>
            <VenuesClient />
        </Suspense>
    );
}
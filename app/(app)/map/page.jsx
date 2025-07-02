// app/map/page.jsx
'use client'

import dynamic from 'next/dynamic'

// This will prevent SSR for this component
const MapClient = dynamic(() => import('../map/mapClient'), {
    ssr: false
})

export default function MapPage() {
    return (
        <main>
            <MapClient />
        </main>
    )
}
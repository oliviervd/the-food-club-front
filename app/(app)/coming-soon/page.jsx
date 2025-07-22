// app/coming-soon/pages.jsx
'use client'

import dynamic from 'next/dynamic'

// this will prevent SSR for this component.
const ComingSoonClient = dynamic(() => import('../coming-soon/comingSoonClient.jsx'), {
    ssr: false
})

export default function MapPage() {
    return (
        <main>
            <ComingSoonClient />
        </main>
    )
}
// app/about/page.jsx
'use client'

import dynamic from 'next/dynamic'

// This will prevent SSR for this component
const AboutClient = dynamic(() => import('/app/about/aboutClient.jsx'), {
    ssr: false
})

export default function MapPage() {
    return (
        <main>
            <AboutClient />
        </main>
    )
}
'use client'

import dynamic from 'next/dynamic'

const MapClient = dynamic(() => import('./mapClient.jsx'), { ssr: false })

export default function MapWrapper() {
    return <MapClient />
}
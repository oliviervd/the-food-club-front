// app/layout.jsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LocationColorProvider } from '../contexts/LocationColorContext.jsx'
import { useState } from 'react'
import Head from 'next/head'; // Import the Head component


import { AuthProvider } from '../contexts/AuthContext';
import AuthGuard from '../components/AuthGuard';

import '/styles/fonts.css'
import '/styles/media.css'
import '/styles/home.css'
import '/styles/categories.css'
import '/styles/venue.css'
import '/styles/main.css'
import '/styles/about.css'
import 'leaflet/dist/leaflet.css'
import '/styles/map.css'
import '/styles/colors.css'

// SEO metadata as defined
export const metadata = {
    title: "Food Club - Home",
    description: "#1 Don't talk about foodclub - but psssst…. please spread the word! — #2 The foodclub is a curated space focused on quality, featuring only restaurants we've personally visited.",
    keywords: ['food club', 'gent', 'brussel', 'antwerpen'],
    openGraph: {
        title: "Food Club",
        description: "#1 Don't talk about foodclub - but psssst…. please spread the word! — #2 The foodclub is a curated space focused on quality, featuring only restaurants we've personally visited.",
        url: "https://www.thefoodclub.be",
        type: "website",
        images: [
            {
                url: "https://www.thefoodclub.be/assets/img/logo-blue.png",
                alt: "logo of Food Club",
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Food Club',
        description: '#1 Don’t talk about foodclub...',
        images: ['https://www.thefoodclub.be/img/logo-blue.png'],
    },
};

export default function RootLayout({ children }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: Infinity,
                cacheTime: 86400000,
                refetchOnWindowFocus: false,
            }
        }
    }));

    return (
        <html lang="en">
        <body>

        <Head>
            <title>{metadata.title}</title>
            <meta name="description" content={metadata.description} />
            <meta name="keywords" content={metadata.keywords.join(', ')} />
            <meta property="og:title" content={metadata.openGraph.title} />
            <meta property="og:description" content={metadata.openGraph.description} />
            <meta property="og:url" content={metadata.openGraph.url} />
            <meta property="og:type" content={metadata.openGraph.type} />
            <meta property="og:image" content={metadata.openGraph.images[0].url} />
            <meta property="og:image:alt" content={metadata.openGraph.images[0].alt} />
            <meta name="twitter:card" content={metadata.twitter.card} />
            <meta name="twitter:title" content={metadata.twitter.title} />
            <meta name="twitter:description" content={metadata.twitter.description} />
            <meta name="twitter:image" content={metadata.twitter.images[0]} />
        </Head>

        <QueryClientProvider client={queryClient}>
            <LocationColorProvider>
                <AuthProvider>
                    <AuthGuard>
                        {children}
                    </AuthGuard>
                </AuthProvider>
            </LocationColorProvider>
        </QueryClientProvider>
        </body>
        </html>
    );
}
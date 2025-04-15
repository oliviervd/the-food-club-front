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
            <title>Food Club</title>
            <meta name="description" content="#1 Don't talk about foodclub - but psssst…. please spread the word! — #2 The foodclub is a curated space focused on quality, featuring only restaurants we've personally visited." />
            <meta name="keywords" content="foodclub, gent, brussel, antwerpen" />
            <meta property="og:title" content="Food Club" />
            <meta property="og:description" content="#1 Don't talk about foodclub - but psssst…. please spread the word! — #2 The foodclub is a curated space focused on quality, featuring only restaurants we've personally visited." />
            <meta property="og:url" content="https://www.thefoodclub.be" />
            <meta property="og:type" content="website" />
            <meta property="og:image" content="https://www.thefoodclub.be/assets/img/logo-blue.png" />
            <meta property="og:image:alt" content="logo of Food Club" />
            <meta name="twitter:card" content='summary_large_image' />
            <meta name="twitter:title" content= 'Food Club' />
            <meta name="twitter:description" content='#1 Don’t talk about foodclub...' />
            <meta name="twitter:image" content='https://www.thefoodclub.be/img/logo-blue.png' />
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
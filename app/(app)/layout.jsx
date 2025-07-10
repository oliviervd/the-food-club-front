// app/layout.js

import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata = {
    title: "Food Club - Home",
    description: "#1 Don't talk about foodclub - but psssst…. please spread the word! — #2 The foodclub is a curated space focused on quality, featuring only restaurants we've personally visited.",
    keywords: ['food club', 'gent', 'brussel', 'antwerpen'],
    icons: {
        icon: '/Favicon.ico',
    },
    faviconUrl: "https://www.thefoodclub.be/assets/img/Favicon.png",
    openGraph: {
        title: "Food Club",
        description: "#1 Don't talk about foodclub - but psssst…. please spread the word! — #2 The foodclub is a curated space focused on quality, featuring only restaurants we've personally visited.",
        url: "https://www.thefoodclub.be",
        type: "website",
        images: [
            {
                url: "https://www.thefoodclub.be/assets/img/OG-food-club-main.jpg",
                alt: "main branding image for the foodclub",
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Food Club',
        description: '#1 Don’t talk about foodclub...',
        images: ['https://www.thefoodclub.be/assets/img/OG-food-club-main.jpg'],
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <GoogleAnalytics gaId="G-MT6KZBM1XN"/>
        <body>
        <div suppressHydrationWarning={true}>
            <ClientLayout>
                {children}
            </ClientLayout>
        </div>
        </body>
        </html>
    );
}

import ClientLayout from './client-layout'; // 👈 No dynamic import
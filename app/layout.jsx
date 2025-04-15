// app/layout.js
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
    return (
        <html lang="en">
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
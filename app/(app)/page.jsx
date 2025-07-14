import HomeClient from './homeClient.jsx';
import CanonicalTag from "../../components/CanonicalTag.jsx";

export const metadata = {
    title: "Food Club - Home",
    description: "#1 Don't talk about foodclub - but psssst…. please spread the word! — #2 The foodclub is a curated space focused on quality, featuring only restaurants we've personally visited.",
    keywords: ['food club', 'gent', 'brussel', 'antwerpen'],
    icons: {
        icon: '/favicon.ico',
        appleTouchIcon: '/apple-touch-icon.png',

    },
    openGraph: {
        title: "Food Club",
        faviconUrl: "https://www.thefoodclub.be/assets/img/Favicon.png",
        description: "#1 Don't talk about foodclub - but psssst…. please spread the word! — #2 The foodclub is a curated space focused on quality, featuring only restaurants we've personally visited.",
        url: "https://www.thefoodclub.be",
        type: "website",
        images: [
            {
                url: "https://www.thefoodclub.be/assets/img/OG-food-club-main.jpg",
                alt: "main branding image for the foodclub. this is not actually us.",
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Food Club',
        description: '#1 Don’t talk about foodclub...',
        images: ['https://www.thefoodclub.be/assets/img/OG-food-club-main.jpg'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            noImageIndex: false,
        }
    },
};

export default function VenuesPage() {
    return (
        <div>
            <HomeClient/>
        </div>
    );
}
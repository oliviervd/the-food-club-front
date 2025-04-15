import HomeClient from './homeClient.jsx';

export const metadata = {
    title: "Food Club - Home",
    description: "#1 Don't talk about foodclub - but psssst…. please spread the word! — #2 The foodclub is a curated space focused on quality, featuring only restaurants we've personally visited.",
    keywords: ['food club', 'gent', 'brussel', 'antwerpen'],
    openGraph: {
        title: "Food Club",
        description: "#1 Don't talk about foodclub - but psssst…. please spread the word! — #2 The foodclub is a curated space focused on quality, featuring only restaurants we've personally visited.",
        url: "www.thefoodclub.be",
        type: "website",
        images: [
            {
                url: "/img/logo-blue.png",
                alt: "logo of Food Club"
            }
        ]
    }
}


export default function VenuesPage() {
    return (
        <HomeClient />
    );
}
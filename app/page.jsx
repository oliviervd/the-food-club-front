import HomeClient from './homeClient.jsx';
import { Metadata } from "next";

export const metadata = {
    title: "Food Club - Home",
    description: "Food Club is",
    keywords: ['food club', 'gent', 'brussel', 'antwerpen'],
    openGraph: {
        title: "Food Club",
        description: "",
        url: "",
        type: "website",
        images: [
            {
                url: "/public/images/food-club.png",
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
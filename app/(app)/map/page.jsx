import MapWrapper from "./mapWrapper.jsx";

export async function generateMetadata() {
    return {
        title: "The Food Club - Map - Your Foodie Guide through the Galaxy",
        description: "seeing things on a map makes everything easier. One map - tons of food.",
        keywords: ["map", "the food club", "gent", "brussel", "antwerpen", "food", "foodie"],
        canonical: "https://thefoodclub.be/map",
        image: "https://d3nidktcupd88v.cloudfront.net/HERO-map-2387x1554.jpg",
        openGraph: {
            images:[{url:"https://d3nidktcupd88v.cloudfront.net/HERO-map-2387x1554.jpg", alt:"hero image for the Food Club Map"}],
            title: "The Food Club - Map - Your Foodie Guide through the Galaxy",
            description: "seeing things on a map makes everything easier. One map - tons of food.",
        },
        alternates: {
            canonical: `https://www.thefoodclub.be/map`,
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
    }
}

export default function MapPage() {
    return (
        <MapWrapper/>
    )
}
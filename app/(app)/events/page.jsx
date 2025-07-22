import EventsClient from "./eventsClient.jsx";

export async function generateMetadata() {
    return {
        title: "The Food Club - Tasty Food Events",
        description: "Let's go to (food) mass. We believe good food should be celebrated, that's why made a calender of food events near you.",
        image: 'https://d3nidktcupd88v.cloudfront.net/HERO-Food-Market-1635x1021.jpg',
        keywords: ["food", 'events', 'club', 'calender', "the food club", "food club", "food events", "food mass", "food mass events", "food mass calender", "food mass events calender", "food mass events"],
        type: 'website',
        url: 'https://www.thefoodclub.be/events',
        openGraph: {
            title: 'The Food Club - Tasty Food Events',
            description: 'Let\'s go to (food) mass. We believe good food should be celebrated, that\'s why made a calender of food events near you.',
            images: [{url:'https://d3nidktcupd88v.cloudfront.net/HERO-Food-Market-1635x1021.jpg', alt: 'The Food Club - Tasty Food Events', width: 1635, height: 1021}],
            type: 'website',
            locale: 'en_IE',
            site_name: 'The Food Club',
        },
        alternates: {
            canonical: 'https://www.thefoodclub.be/events',
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
        twitter: {
            title: 'The Food Club - Tasty Food Events',
            description: 'Let\'s go to (food) mass. We believe good food should be celebrated, that\'s why made a calender of food events near you.',
            cardType: 'summary_large_image',
        },
    }
}

export default function EventsPage() {
    return (
        <EventsClient/>
    )
}
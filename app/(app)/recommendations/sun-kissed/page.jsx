import SunKissedClient from "./sunKissedClient.js";

export async function generateMetadata() {

    return {
        title: "Sun-Kissed - Sun exclusive places to be. -  The Food Club.",
        description: "Sun Kissed places; these are only open when the suns' out.",
        keywords: ["food", "foodie", "sun kissed", "sun kissed food", "sun kissed foodie", "sun kissed food club", "sun kissed food club gent", "sun kissed food club brussel", "sun kissed food club antwerpen"],
        canonical: "https://thefoodclub.be/recommendations/sun-kissed",
        image: "https://d3nidktcupd88v.cloudfront.net/HERO-Food-Market-1635x1021.jpg",
        openGraph: {
            images:[{url:"https://d3nidktcupd88v.cloudfront.net/HERO-Food-Market-1635x1021.jpg", alt:"hero image for the Food Club Map"}],
            title: "The Food Club - Sun Kissed",
            description: "Sun Kissed",
        },
        alternates: {
            canonical: `https://www.thefoodclub.be/recommendations/sun-kissed`,
        }
    }
}

export default function SunKissedPage(){
    return(
        <SunKissedClient/>
    )
}
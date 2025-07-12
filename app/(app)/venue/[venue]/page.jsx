import VenueClient from "./venueClient.jsx"
import {Suspense} from "react";
import Loading from "../../Loading.jsx";

export async function generateMetadata({params}) {

    const res = await fetch(`https://thefoodclub.be/api/venues?where[url][equals]=${params.venue}`)
    const data = await res.json();
    console.log(data);

    let title, description, image;

    if (data.docs[0].meta) {
        try {
            let seo = data.docs[0].meta;
            title = seo.title;
            description = seo.description;
            image = seo.image.url;
        } catch (e) {
            console.log(e);
        }
    }

    try {
        return {
            title: title,
            description: description,
            image: image,
            keywords: ["review", "food club", title], // todo: add keywords to CMS
            openGraph: {
                title: title,
                description: description,
                images: [{url: image, alt: `image of ${title}`}],
                url: `https://thefoodclub.be/venues/${params.venue}`,
                type: 'website',
                site_name: 'The Food Club',
            },
            twitter: {
                card: 'summary_large_image',
                title: title,
                description: description,
                images: [{url: image, alt: `image of ${title}`}],
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
    } catch (e) {
        console.log(e);
    }
}

export default function VenuePage() {
    return (
        <Suspense fallback={<Loading />}>
            <VenueClient />
        </Suspense>
    )
}
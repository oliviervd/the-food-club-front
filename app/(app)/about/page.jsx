// app/about/page.jsx
import AboutClient from "./aboutClient.jsx";
import CanonicalTag from "../../../components/CanonicalTag.jsx";

export async function generateMetadata() {

    const res = await fetch('https://thefoodclub.be/api/page/6864d3114e2e13271cc5b072?depth=2&draft=false&locale=en', { cache: 'no-store' });
    const data = await res.json();

    //console.log(data.meta);

    return {
        title: data.meta.title,
        description: data.meta.description,
        image: data.meta.image.url,
        url: 'https://thefoodclub.be/about',
        type: 'website',
        locale: 'en_US',
        site_name: 'The Food Club',
        twitter: {
            card: 'summary_large_image',
            site: '@thefoodclubbe',
            creator: '@thefoodclubbe',
        },
        openGraph: {
            title: data.meta.title,
            description: data.meta.description,
            url: 'https://thefoodclub.be/about',
            type: 'website',
            locale: 'en_US',
            site_name: 'The Food Club',
            images: [
                {
                    url: data.meta.image.url,
                }
            ]
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

export default function AboutPage() {
    return (
        <>
            <CanonicalTag href="https://thefoodclub.be/about"/>
            <AboutClient />
        </>
    )
}
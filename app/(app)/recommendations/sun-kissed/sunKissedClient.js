'use client'

import Header from "../../../../components/Header.jsx";
import ScrollToTop from "../../../../components/scrollToTop.jsx";
import Banner from "../../../../components/Banner.jsx";
import {useQuery} from "@tanstack/react-query";
import {fetchAPI} from "../../../../utils/utils.jsx";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic.js";

const MapSmall = dynamic(() => import('../../../../components/mapSmall.jsx'), {
    ssr: false
});

const SunKissedClient = () => {

    const { data: venuesData, isLoading: venuesLoading, error: venuesError } = useQuery({
        queryKey: ["venues"],
        queryFn: () => fetchAPI('venue', 'en', { limit: 1000 }),
    });

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkWidth = () => setIsMobile(window.innerWidth < 600);
        checkWidth();
        window.addEventListener("resize", checkWidth);
        return () => window.removeEventListener("resize", checkWidth);
    }, []);

    const sunKissedVenues = venuesData?.docs?.filter(venue => venue.information?.sunKissed);

    console.log("🌞 Sun-kissed venues:", sunKissedVenues);

    return(
        <>
            <Header landing={true} interact={true}/>
            <ScrollToTop/>
            <Banner content={"sun-kissed ☼"} />
            {isMobile &&
                <div className={"venue-list__container-main"} style={{margin: "-5px 10px"}}>

                    <div className="cat_description">
                        <p style={{fontSize: "1rem", fontWeight: "500", fontFamily: "DM-sans"}}>Sun-kissed — or better:
                            these spots only pop when the sun decides to show up. Hard to find, harder to keep track of
                            — yet here we are, chasing that bright buzz so you don’t have to. Eat, drink, and soak it
                            in.</p>
                    </div>
                    {isMobile && sunKissedVenues && sunKissedVenues.length > 0 && (
                        sunKissedVenues.map((venue, index) => {
                            return (
                                <div className={"category-list__box"} key={index}>
                                    <Link href={`/venue/${venue.url}`}>
                                        <div style={{height: "200px"}}>
                                            <Image
                                                src={venue.media.hero.url}
                                                alt={`hero image for ${venue.venueName}`}
                                                fill
                                                placeholder={"blur"}
                                                blurDataURL={venue.media.hero.thumbnailURL}
                                                style={{
                                                    objectFit: 'cover',
                                                    border: "2px solid var(--color-main)",
                                                    boxSizing: 'border-box'
                                                }}
                                                sizes="100vw"
                                                priority={false}
                                            />
                                        </div>
                                        <h2>{venue.venueName}</h2>
                                    </Link>
                                </div>
                            )
                        })
                    )}
                </div>
            }
            {!isMobile && sunKissedVenues && sunKissedVenues.length > 0 && (
                <section className={"desktop"}>
                    <section className={"venue-list__container-main"}>
                        <section>
                            <div className="cat_description">
                                <h2>
                                    Sun-kissed — or
                                    better:
                                    these spots only pop when the sun decides to show up. Hard to find, harder to keep
                                    track of
                                    — yet here we are, chasing that bright buzz so you don’t have to. Eat, drink, and
                                    soak it
                                    in.</h2>
                            </div>
                            {sunKissedVenues.map((venue, index) => {
                                return (
                                    <div className={"venue"} key={index}>
                                        <div className={"venue__image"} style={{width: "100%"}}>
                                            <Link href={`/venue/${venue.url}`}>
                                                <div style={{height: "200px"}}>
                                                    <Image
                                                        src={venue.media.hero.url}
                                                        alt={`hero image for ${venue.venueName}`}
                                                        fill
                                                        placeholder={"blur"}
                                                        blurDataURL={venue.media.hero.thumbnailURL}
                                                        style={{
                                                            objectFit: 'cover',
                                                            border: "2px solid var(--color-main)",
                                                            boxSizing: 'border-box'
                                                        }}
                                                        sizes="100vw"
                                                        priority={false}
                                                    />
                                                </div>
                                                <h2>{venue.venueName}</h2>
                                            </Link>
                                        </div>
                                    </div>
                                )
                            })}
                        </section>
                    </section>
                    <section className="venue-list__container-others">
                        <MapSmall venues={sunKissedVenues} highlight={null} onHover={null}/>
                    </section>
                </section>

            )}


        </>
    )

}

export default SunKissedClient
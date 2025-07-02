'use client';

import {useParams, useRouter} from "next/navigation";
import Header from "../../../../components/Header.jsx";
import {fetchAPI, shuffleArray, venueStatus} from "../../../../utils/utils.jsx";
import { useQuery } from "@tanstack/react-query";
import {useEffect, useMemo, useState} from "react";
import DitherImage from "../../../../components/DitherImage.jsx";
import {debounce} from "lodash";

export default function RecommendationPage() {

    const [isMobile, setIsMobile] = useState(false);

    // Media query (always run on client)
    useEffect(() => {
        const checkWidth = () => setIsMobile(window.innerWidth < 600);
        checkWidth();
        window.addEventListener("resize", checkWidth);
        return () => window.removeEventListener("resize", checkWidth);
    }, []);

    const { name } = useParams()
    const router = useRouter();

    const { data: venues, isLoading, error } = useQuery({
        queryKey: ['venues', 'terrace-true'],
        queryFn: () =>
            fetchAPI('venues', 'en', {
                'where[information.hasTerrace][equals]': 'true',
            }),
    });


    if (isLoading) return <div>Loading venues...</div>;
    if (error) return <div>Failed to load venues: {error.message}</div>;

    const navigateTo = debounce((route) => {
        router.push(`/venue/${route}`);
    }, 200);

    function IsSunny() {
        // This is now a valid synchronous React component
        return (
            <section className={"home__container"}>
                {isMobile &&
                    <section>
                        <h2 className={"header"}>best terraces in town.</h2>
                        <section>
                            {venues.docs.map((venue, index) => {
                                if (venue._status === "published") {
                                    return(
                                        <div key={index} className="category-list__box" onClick={() => navigateTo(venue.url)}>
                                            <div>
                                                {venue.new &&
                                                    <div className="image__club-tag">NEW</div>
                                                }
                                                <DitherImage url={venue.media.hero.sizes.tablet.url} link={`/venue/${venue.url}`} />
                                                {venueStatus(venue) && <div className="venue-open">{venueStatus(venue)}</div>}
                                            </div>
                                            <h2 style={{ textAlign: "center" }}>{venue.venueName}</h2>
                                        </div>
                                    )
                                }
                            })}
                        </section>
                    </section>

                }
                {!isMobile &&
                    <section className={"desktop"}>
                        <section className={"venue-list__container-main"}>
                            <h2 className={"header"}>si-schiatta</h2>
                            <section>
                                {venues.docs.map((venue, index) => {
                                    if (venue._status === "published") {
                                        return(
                                            <div key={index} className="venue">
                                                <div className={"venue__image"} onClick={() => window.location.href = `/venue/${venue.url}`}>
                                                    <DitherImage url={venue.media.hero?.sizes?.tablet?.url} link={`/venue/${venue.url}`} />
                                                    <h2>{venue.venueName}</h2>
                                                </div>
                                            </div>
                                        )
                                    }
                                })}
                            </section>
                        </section>
                    </section>
                }
            </section>
        );
    }

    console.log(venues)

    return (
        <>
            <Header landing interact />
            <IsSunny />

        </>
    );
}
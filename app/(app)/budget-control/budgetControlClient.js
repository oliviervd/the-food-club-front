'use client'

import Header from "../../../components/Header.jsx";
import ScrollToTop from "../../../components/scrollToTop.jsx";
import Banner from "../../../components/Banner.jsx";
import React, {useState, useEffect} from "react";
import dynamic from "next/dynamic.js";
import {useQuery} from "@tanstack/react-query";
import {fetchAPI} from "../../../utils/utils.jsx";
import Link from "next/link";
import Image from "next/image.js";

const MapSmall = dynamic(() => import('../../../components/mapSmall.jsx'), {
    ssr: false
});

const BudgetControlClient = ({budget, briefs}) => {

    // set states
    const [isMobile, setIsMobile] = useState(false);
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        const checkWidth = () => setIsMobile(window.innerWidth < 600);
        checkWidth();
        window.addEventListener("resize", checkWidth);
        return () => window.removeEventListener("resize", checkWidth);
    }, []);

    // todo: add venues within that category
    // fetch data
    const { data: venuesData, isLoading: venuesLoading, error: venuesError } = useQuery({
        queryKey: ["venues"],
        queryFn: () => fetchAPI('venue', 'en', { limit: 1000 }),
    });

    useEffect(() => {
        if (venuesData) {
            // Use filter instead of find to get all matching venues
            const budgetMatches = venuesData.docs.filter(venue =>
                // Check if venue.damage exists and matches the budget
                venue.damage === budget
            );
            setMatches(budgetMatches);
        }
    }, [budget, venuesData]);


    console.log("budget matches:", matches);

    // todo: add map

    return(
        <>
            <Header landing={true} interact={true}/>
            <ScrollToTop/>
            <Banner content={budget.replaceAll("*","💸") || "budget"} />
            <section className={"home__container"}>
                {!isMobile && matches && matches.length > 0 && (
                    <section className="desktop" style={{ position: "relative" }}>
                        <section className="venue-list__container-main">
                            <section>
                                <div className="venue info-box">
                                    <p>{briefs[budget]}</p>
                                </div>
                                {matches.map((venue, index)=>{

                                    if (venue._status === "published") return (
                                        <div className="venue" key={index}>
                                            <div className="venue__image">
                                                <Link href={`/venue/${venue.url}`}>
                                                    <div style={{height: "200px"}}>
                                                        <Image
                                                            src={venue.media.hero.url}
                                                            alt={`hero image for ${venue.venueName}`}
                                                            fill
                                                            style={{ objectFit: 'cover' , border: "2px solid var(--color-main)", boxSizing: 'border-box'}}
                                                            sizes="100vw"
                                                            priority={false}
                                                        />
                                                    </div>
                                                    <h2 >{venue.venueName}</h2>
                                                </Link>
                                            </div>
                                        </div>
                                    )
                                })}
                            </section>
                        </section>
                        <section className={"venue-list__container-others"}>
                            <MapSmall venues={matches || []} highlight={null} onHover={null}/>
                        </section>
                    </section>
                )}
            </section>
            <div>
            </div>
        </>
    )
}

export default BudgetControlClient
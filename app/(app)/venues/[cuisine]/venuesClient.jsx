'use client'

import dynamic from 'next/dynamic'
import ScrollToTop from "../../../../components/scrollToTop.jsx";
import Header from "../../../../components/Header.jsx";
import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI, venueStatus } from "../../../../utils/utils.jsx";
import Loading from "../../loading.jsx";
import Banner from "../../../../components/Banner.jsx";
import { LocationColorContext } from "../../../../contexts/LocationColorContext.jsx";
import Link from "next/link";
import serialize from "../../../../utils/serialize.jsx"
import { getHeroUrl } from "../../../../utils/utils.jsx";


const MapSmall = dynamic(() => import('../../../../components/mapSmall.jsx'), {
    ssr: false
});

const VenuesClient = ({ cuisine }) => {
    const { locationColor } = useContext(LocationColorContext);
    let { location } = locationColor;

    const [search, setSearch] = useState("");
    const [matches, setMatches] = useState(null);
    const [matchedCuisine, setMatchedCuisine] = useState("")
    const [club, setClub] = useState(null);
    const [highlightedVenue, setHighlightedVenue] = useState(null);

    const { data: venuesData, isLoading: venuesLoading, error: venuesError } = useQuery({
        queryKey: ["venues"],
        queryFn: () => fetchAPI('venue', 'en', { limit: 600 }),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    const { data: cuisinesData, isLoading: cuisinesLoading, error: cuisinesError } = useQuery({
        queryKey: ["cuisines"],
        queryFn: () => fetchAPI("cuisine", "en", { limit: 600 }),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkWidth = () => setIsMobile(window.innerWidth < 600);
        checkWidth();
        window.addEventListener("resize", checkWidth);
        return () => window.removeEventListener("resize", checkWidth);
    }, []);

    useEffect(() => {
        if (!cuisine || !cuisinesData?.docs) return;
        const searchCuisine = cuisine.toLowerCase();
        const foundCuisine = cuisinesData.docs.find(c => c.name?.toLowerCase() === searchCuisine);
        if (foundCuisine) setMatchedCuisine(foundCuisine);
    }, [cuisine, cuisinesData?.docs]);

    useEffect(() => {
        if (!cuisine || !venuesData?.docs || !cuisinesData?.docs) return;
        const searchCuisine = cuisine.toLowerCase();
        const matchedVenues = venuesData.docs.filter(venue => {
            const hasCuisine = venue.information?.cuisine?.some(c => c.name?.toLowerCase() === searchCuisine);
            const hasDish = venue.information?.dishes?.some(d => d.name?.toLowerCase() === searchCuisine);
            const hasType = venue.information?.type?.toLowerCase() === searchCuisine;
            const hasDrink = venue.information?.drinks?.some(drink => drink.name?.toLowerCase() === searchCuisine);
            return hasCuisine || hasDish || hasType || hasDrink;
        });
        setMatches(matchedVenues);
        setSearch(searchCuisine);
    }, [cuisine, venuesData?.docs, cuisinesData?.docs]);

    if (!location) return null;
    if (venuesLoading || cuisinesLoading) return <Loading />;
    if (venuesError || cuisinesError) return <p>Error loading data</p>;

    return (
        <>
            <Header landing={true} location={club} setLocation={setClub} interact={true} />
            <ScrollToTop />
            <div>
                <Banner content={search} />
            </div>
            {matches === null && <Loading />}

            {matches && matches.length === 0 && (
                <section className="home__container">
                    <section className="desktop" style={{ position: "relative" }}>
                        <section className="venue-list__container-main">
                            <section>
                                <div className="venue info-box">
                                    <p>{`At this point in time there are no ${search} spots matching in ${location} ☔︎︎. Please come back later, or subscribe to our newsletter to get updated.`}</p>
                                </div>
                            </section>
                        </section>
                    </section>
                </section>
            )}

            {matches && matches.length > 0 && (
                <section className="home__container">
                    <section style={{ position: "relative" }}>
                        {isMobile && (
                            <section>
                                {matchedCuisine.description && (
                                    <div className="cat_description">
                                        <div>
                                            <h2>{serialize(matchedCuisine.description)}</h2>
                                        </div>
                                    </div>
                                )}
                                {matches.map((match, index) => {
                                    if (match._status !== "published") return null;
                                    const heroUrl = getHeroUrl(match.media, 'mobileFriendly');
                                    if (!heroUrl) return null;
                                    const status = venueStatus(match);
                                    return (
                                        <div key={match.id || match.url} className="category-list__box">
                                            <Link href={`/venue/${match.url}`}>
                                                <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
                                                    <img
                                                        src={heroUrl}
                                                        alt={`hero image for ${match.venueName}`}
                                                        loading="lazy"
                                                        style={{
                                                            objectFit: 'cover',
                                                            height: '100%',
                                                            border: "2px solid var(--color-main)",
                                                            boxSizing: 'border-box',
                                                            display: 'block',
                                                        }}
                                                    />
                                                    {status && <div className="venue-open">{status}</div>}
                                                </div>
                                                <h2 style={{ textAlign: "center" }}>{match.venueName}</h2>
                                            </Link>
                                        </div>
                                    );
                                })}
                            </section>
                        )}

                        {!isMobile && (
                            <section className="desktop">
                                <section className="venue-list__container-main">
                                    <section>
                                        {matchedCuisine.description && (
                                            <div className="cat_description">
                                                <div>
                                                    <h2>{serialize(matchedCuisine.description)}</h2>
                                                </div>
                                            </div>
                                        )}
                                        {matches.map((match, index) => {
                                            if (match._status !== "published") return null;
                                            const heroUrl = getHeroUrl(match.media, 'tablet');
                                            if (!heroUrl) return null;
                                            const isHighlighted = highlightedVenue?.url === match.url;
                                            const borderStyle = {
                                                border: isHighlighted ? '2px solid var(--color-secondary)' : '',
                                                backgroundColor: isHighlighted ? 'var(--color-main)' : '',
                                                color: isHighlighted ? 'var(--color-secondary)' : '',
                                                transition: 'all 0.5s ease',
                                            };
                                            return (
                                                <div
                                                    className="venue"
                                                    key={match.id || match.url}
                                                    onMouseEnter={() => setHighlightedVenue(match)}
                                                    onMouseLeave={() => setHighlightedVenue(null)}
                                                >
                                                    <div className="venue__image">
                                                        <Link href={`/venue/${match.url}`}>
                                                            <div style={{ height: "200px", position: 'relative', overflow: 'hidden' }}>
                                                                <img
                                                                    src={heroUrl}
                                                                    alt={`hero image for ${match.venueName}`}
                                                                    loading="lazy"
                                                                    style={{
                                                                        objectFit: 'cover',
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        border: "2px solid var(--color-main)",
                                                                        boxSizing: 'border-box',
                                                                        display: 'block',
                                                                    }}
                                                                />
                                                            </div>
                                                            <h2 style={borderStyle}>{match.venueName}</h2>
                                                        </Link>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </section>
                                </section>
                                <section className="venue-list__container-others">
                                    <MapSmall venues={matches} highlight={highlightedVenue} onHover={setHighlightedVenue} />
                                </section>
                            </section>
                        )}
                    </section>
                </section>
            )}
        </>
    );
};

export default VenuesClient;
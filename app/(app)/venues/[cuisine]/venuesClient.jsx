'use client'

import dynamic from 'next/dynamic'
import ScrollToTop from "../../../../components/scrollToTop.jsx";
import Header from "../../../../components/Header.jsx";
import {useContext, useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {fetchAPI} from "../../../../utils/utils.jsx";
import DitherImage from "../../../../components/DitherImage.jsx";
import Banner from "../../../../components/Banner.jsx";
import {LocationColorContext} from "../../../../contexts/LocationColorContext.jsx";
import Link from "next/link";
import serialize from "../../../../utils/serialize.jsx"

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
        queryFn: () => fetchAPI('venue', 'en', { limit: 1000 }),
    });

    const { data: cuisinesData, isLoading: cuisinesLoading, error: cuisinesError } = useQuery({
        queryKey: ["cuisines"],
        queryFn: () => fetchAPI("cuisine", "en", { limit: 1000 }),
    });

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkWidth = () => setIsMobile(window.innerWidth < 600);
        checkWidth();
        window.addEventListener("resize", checkWidth);
        return () => window.removeEventListener("resize", checkWidth);
    }, []);

    if (!location) {
        return;
    }

    // look for cuisine
    useEffect(() => {
        if (!cuisine) {
            return;
        }

        if (!cuisinesData?.docs) {
            return;
        }

        const searchCuisine = cuisine.toLowerCase();
        const foundCuisine = cuisinesData.docs.find(c => c.name?.toLowerCase() === searchCuisine);

        if (foundCuisine) {
            setMatchedCuisine(foundCuisine); // Or make a new `useState` like `setCurrentCuisine`
        } else {
            //console.log("Cuisine not found in cuisinesData");
        }
    }, [cuisine, cuisinesData?.docs]);

    console.log(matchedCuisine)

    useEffect(() => {
        if (!cuisine) {
            return;
        }

        const searchCuisine = cuisine.toLowerCase();

        if (!venuesData?.docs) {
            return;
        }

        if (!cuisinesData?.docs) {
            return;
        }


        const matchedVenues = venuesData.docs.filter(venue => {
            const hasCuisine = venue.information?.cuisine?.some(c => c.name?.toLowerCase() === searchCuisine);
            const hasDish = venue.information?.dishes?.some(d => d.name?.toLowerCase() === searchCuisine);
            const hasType = venue.information?.type?.toLowerCase() === searchCuisine;
            const hasDrink = venue.information?.drinks?.some(drink => drink.name?.toLowerCase() === searchCuisine);

            if (hasCuisine || hasDish || hasType || hasDrink) {
                return true;
            }

            return false;
        });

        setMatches(matchedVenues);
        setSearch(searchCuisine);
    }, [cuisine, venuesData?.docs, cuisinesData?.docs]);

    if (venuesLoading || cuisinesLoading) {
        return (
            <div>
                <Header landing={true} location={club} setLocation={setClub} interact={true} />
                <div>
                    <Banner content={search} />
                </div>
            </div>
        );
    }

    if (venuesError || cuisinesError) {
        return <p>Error loading data</p>;
    }

    return (
        <>
            <Header landing={true} location={club} setLocation={setClub} interact={true} />
            <ScrollToTop />
            <div>
                <Banner content={search} />
            </div>
            {matches === null && <p>Loading or calculating matches...</p>}

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
                    <section style={{position: "relative"}}>
                        {isMobile &&
                            <section>
                                {matchedCuisine.description && (
                                <div className="cat_description">

                                        <div>
                                            <h2>
                                                {serialize(matchedCuisine.description)}
                                            </h2>
                                        </div>

                                </div>
                                )}
                                {matches.map((match, index) => {
                                    if (match._status == "published") {
                                        try {
                                            return (
                                                <div key={index} className="category-list__box">
                                                    <Link href={`/venue/${match.url}`}>
                                                        <DitherImage url={match.media.hero.sizes.tablet.url}/>
                                                        <h2 style={{textAlign: "center"}}>{match.venueName}</h2>
                                                    </Link>
                                                </div>
                                            );
                                        } catch (e) {
                                        }
                                    }
                                })}
                            </section>
                        }
                        {!isMobile && (
                            <section className="desktop">
                                <section className="venue-list__container-main">
                                    <section>
                                        {matchedCuisine.description && (
                                        <div className="cat_description">

                                                <div>
                                                    <h2>
                                                        {serialize(matchedCuisine.description)}
                                                    </h2>
                                                </div>

                                        </div>
                                        )}
                                        {matches.map((match, index) => {
                                            const isHighlighted = highlightedVenue?.url === match.url;

                                            const borderStyle = {
                                                border: `${isHighlighted ? '2px solid var(--color-secondary)' : ''}`,
                                                backgroundColor: `${isHighlighted ? 'var(--color-main)' : ''}`,
                                                color: `${isHighlighted ? 'var(--color-secondary)' : ''}`,
                                                transition: 'all 0.5s ease',
                                            };

                                            if (match._status == "published") {
                                                return (
                                                    <div
                                                        className="venue"
                                                        key={index}
                                                        onMouseEnter={() => setHighlightedVenue(match)}
                                                        onMouseLeave={() => setHighlightedVenue(null)}
                                                    >
                                                        <div className="venue__image">
                                                            <Link href={`/venue/${match.url}`}>
                                                                <DitherImage url={match.media.hero.sizes.tablet.url}/>
                                                                <h2 style={borderStyle}>{match.venueName}</h2>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        })}
                                    </section>
                                </section>
                                <section className="venue-list__container-others">
                                    <MapSmall venues={matches} highlight={highlightedVenue}
                                              onHover={setHighlightedVenue}/>
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

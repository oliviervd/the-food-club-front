'use client'

// Use this in Page.jsx or wherever you use MapSmall
import dynamic from 'next/dynamic'
import ScrollToTop from "../../../components/scrollToTop.jsx";
import Header from "../../../components/Header.jsx";
import {useContext, useEffect, useState} from "react";
import {useSearchParams, useRouter} from "next/navigation";
import {useQuery} from "@tanstack/react-query";
import {fetchAPI} from "../../../utils/utils.jsx";
import DitherImage from "../../../components/DitherImage.jsx";
import Banner from "../../../components/Banner.jsx";
import {LocationColorContext} from "../../../contexts/LocationColorContext.jsx";
import Link from "next/link";
import serialize from "../../../utils/serialize.jsx";


const MapSmall = dynamic(() => import('../../../components/mapSmall.jsx'), {
    ssr: false
});


const VenuesClient = () => {

    const { locationColor } = useContext(LocationColorContext);
    let { location } = locationColor
    const searchParams = useSearchParams()
    const [search, setSearch] = useState("");
    const [matches, setMatches] = useState([]);
    const [cuisine, setCuisine] = useState(null);
    const [club, setClub] = useState(null);
    const [highlightedVenue, setHighlightedVenue] = useState(null);

    const {data: venuesData, isLoading: venuesLoading, error:venuesError} = useQuery({
        queryKey: ["venues"],
        queryFn: () => fetchAPI('venue', 'en', {limit: 100000})
    });

    const {data: cuisinesData, isLoading: cuisinesLoading, error:cuisinesError} = useQuery({
        queryKey: ["cuisines"],
        queryFn: () => fetchAPI("cuisine", "en", {limit: 100000})
    });

    // media query
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkWidth = () => setIsMobile(window.innerWidth < 600);
        checkWidth();
        window.addEventListener("resize", checkWidth);
        return () => window.removeEventListener("resize", checkWidth);
    }, []);

    useEffect(() => {
        const searchCuisine = searchParams.get("cuisine");
        if (!venuesData?.docs || !cuisinesData?.docs || !searchCuisine) return;

        const matchedVenues = venuesData.docs.filter(venue => {
            const hasCuisine = venue.information?.cuisine?.some(c => c.name === searchCuisine);
            const hasDish = venue.information?.dishes?.some(d => d.name === searchCuisine);
            const hasType = venue.information?.type === searchCuisine;
            const hasDrink = venue.information?.drinks?.some(drink => drink.name === searchCuisine);
            return (hasCuisine || hasDish || hasType || hasDrink) && (!location || venue.club === location);
        });

        const matchedCuisine = cuisinesData.docs.find(c => c.name === searchCuisine);

        setCuisine(matchedCuisine || null);
        setMatches(matchedVenues);
        setSearch(searchCuisine);
    }, [searchParams, location, venuesData, cuisinesData]);

    if (venuesLoading || cuisinesLoading) {
        return (
            <div>
                <Header landing={true} location={club} setLocation={setClub} interact={true}/>
                <div>
                    <Banner content={search}/>
                </div>
            </div>
        );
    }

    if (venuesError || cuisinesError) {
        return <p>Error loading data</p>;
    }

    return (
        <>
            <Header landing={true} location={club} setLocation={setClub} interact={true}/>
            <ScrollToTop/>
            <div>
                <Banner content={search}/>
            </div>
            {/* NO MATCHES */}
            {matches.length === 0 &&
                <section className={"home__container"}>
                    <section className={"desktop"} style={{position: "relative"}}>
                        <section className={"venue-list__container-main"}>
                            <section>
                                <div className={"venue info-box"}>
                                    <p>{`At this point in time there are no ${search} spots matching in ${location} ☔︎︎. Please come back later, or subscribe to our newsletter to get updated.` }</p>
                                </div>
                            </section>
                        </section>
                    </section>
                </section>
            }
            {/* MATCHES */}
            {matches[0] &&
                <section className={"home__container"}>
                    <section style={{position: "relative"}}>
                        {isMobile && matches &&
                            matches.map((match, index) => {

                                if (match._status == "published") {
                                    try {
                                        return (
                                            <div key={index} className={"category-list__box"}>
                                                <Link href={`/venue/${match.url}`}>
                                                    <DitherImage url={match.media.hero.sizes.tablet.url}/>
                                                    <h2 style={{textAlign: "center"}}>{match.venueName}</h2>
                                                </Link>
                                            </div>
                                        )
                                    } catch (e) {

                                    }
                                }

                            })
                        }
                        {!isMobile && matches &&
                            <section className={"desktop"}>
                                <section className={"venue-list__container-main"}>
                                    <section>
                                        {cuisine && cuisine.description &&
                                            <div className={"venue info-box"}>
                                                <p>{serialize(cuisine.description)}</p>
                                            </div>
                                        }
                                        {matches.map((match, index) => {

                                            const isHighlighted = highlightedVenue?.url === match.url;

                                            const borderStyle = {
                                                border: ` ${isHighlighted ? ' 2px solid var(--color-secondary)' : ''}`,
                                                backgroundColor: ` ${isHighlighted ? 'var(--color-main)' : ''}`,
                                                color: ` ${isHighlighted ? 'var(--color-secondary)' : ''}`,
                                                transition: 'all 0.5s ease'
                                            };

                                            if (match._status == "published") {
                                                return (
                                                    <div
                                                        className={`venue`}
                                                        key={index}
                                                        onMouseEnter={() => setHighlightedVenue(match)}
                                                        onMouseLeave={() => setHighlightedVenue(null)}
                                                    >
                                                        <div className={"venue__image"}>
                                                            <Link href={`/venue/${match.url}`}>
                                                                <DitherImage url={match.media.hero.sizes.tablet.url}/>
                                                                <h2 style={borderStyle}>{match.venueName}</h2>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })}
                                    </section>
                                </section>
                                <section className={"venue-list__container-others"}>
                                    <MapSmall venues={matches} highlight={highlightedVenue} onHover={setHighlightedVenue}/>
                                </section>
                            </section>
                        }
                    </section>
                </section>
            }
        </>
    )
}

export default VenuesClient;
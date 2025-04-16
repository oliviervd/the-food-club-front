'use client'

// Use this in Page.jsx or wherever you use MapSmall
import dynamic from 'next/dynamic'

const MapSmall = dynamic(() => import('/components/mapSmall.jsx'), {
    ssr: false
});

import Header from "../../components/Header.jsx";
import {useContext, useEffect, useState} from "react";
import {useSearchParams, useRouter} from "next/navigation";
import {useQuery} from "@tanstack/react-query";
import {fetchAPI} from "../../utils/utils.jsx";
import DitherImage from "../../components/DitherImage.jsx";
import Banner from "../../components/Banner.jsx";
import {LocationColorContext} from "../../contexts/LocationColorContext.jsx";
import Link from "next/link";
import serialize from "../../utils/serialize.jsx";

const VenuesClient = () => {

    const { locationColor, handleLocationChange } = useContext(LocationColorContext);
    let { location } = locationColor


    const searchParams = useSearchParams()
    const [search, setSearch] = useState("");
    const [matches, setMatches] = useState([]);
    const [cuisine, setCuisine] = useState(null);
    const [club, setClub] = useState(null);

    const router = useRouter();

    const {data: venuesData, isLoading: venuesLoading, error:venuesError} =    useQuery(["venues"], ()=> fetchAPI('venue', 'en'));
    const {data: cuisinesData, isLoading: cuisinesLoading, error:cuisinesError} = useQuery(["cuisines"], ()=>fetchAPI("cuisine", "en"))

    // media query
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkWidth = () => setIsMobile(window.innerWidth < 600);
        checkWidth();
        window.addEventListener("resize", checkWidth);
        return () => window.removeEventListener("resize", checkWidth);
    }, []);

    // fetch all venues
    useEffect(() => {
        if (venuesData && venuesData.docs && cuisinesData && cuisinesData.docs) {
            const searchCuisine = searchParams.get("cuisine");
            const matchedVenues = venuesData.docs.filter(venue =>
                venue.cuisineUsed && venue.cuisineUsed.some(cuisine => cuisine.name === searchCuisine) &&
                (!location || venue.club === location)
            );
            const matchedCuisine = cuisinesData.docs.filter(cuisine => cuisine.name === searchCuisine);

            setCuisine(matchedCuisine[0]);
            setMatches(matchedVenues);
            setSearch(searchCuisine);
        }
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

    console.log(cuisine)

    return (
        <>
            <Header landing={true} location={club} setLocation={setClub} interact={true}/>
            <div>
                <Banner content={search}/>
            </div>
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
                                            if (match._status == "published") {
                                                return (
                                                    <div className={"venue"}>
                                                        <div className={"venue__image"}>
                                                            <Link href={`/venue/${match.url}`}>
                                                                <DitherImage url={match.media.hero.sizes.tablet.url}/>
                                                                <h2 style={{textAlign: "center"}}>{match.venueName}</h2>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })}
                                    </section>
                                </section>
                                <section className={"venue-list__container-others"}>
                                    <MapSmall venues={matches}/>
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
import Header from "../elements/Header.jsx";
import {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import AutoResizeText from "../elements/AutoResizeText.jsx";
import {useQuery} from "@tanstack/react-query";
import {fetchAPI} from "../utils/utils.jsx";
import DitherImage from "../elements/DitherImage.jsx";
import {useMediaQuery} from "@uidotdev/usehooks";
import serialize from "../utils/serialize.jsx";
import Banner from "../elements/Banner.jsx";

const Search = () => {

    // todo: update search to be cleaner for larger screens
    // todo: update sentence, when there is no location set.

    const [searchParams, setSearchParams] = useSearchParams()
    const [search, setSearch] = useState("");
    const [matches, setMatches] = useState([]);
    const [cuisine, setCuisine] = useState(null);
    const [location, setLocation] = useState(null);

    const nav = useNavigate();
    const isSmall = useMediaQuery("(max-width: 600px)");

    const {data: venuesData, isLoading: venuesLoading, error:venuesError} =    useQuery(["venues"], ()=> fetchAPI('venue', 'en'));
    const {data: cuisinesData, isLoading: cuisinesLoading, error:cuisinesError} = useQuery(["cuisines"], ()=>fetchAPI("cuisine", "en"))

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
        return <p>Loading...</p>;
    }

    if (venuesError || cuisinesError) {
        return <p>Error loading data</p>;
    }


    //navigate to selected venue
    function navigateTo(route) {
        nav(`/venue/${route}`)
    }

    function generatePrompt(location) {
        if (!location) {
            return ""
        } else {
            return `in ${location} and`
        }
    }

    if (matches[0]) {
        return (
            <>
                <Header landing={true} location={location} setLocation={setLocation} interact={true}/>
                <div>
                    <Banner content={search}/>
                </div>
                <section class={"home__container"}>
                    <section style={{position: "relative"}}>
                        {isSmall && matches &&
                            matches.map((match, index) => {
                                try {
                                    return (
                                        <div key={index} className={"category-list__box"} onClick={() => {
                                            navigateTo(match.url)
                                        }}>
                                            <DitherImage url={match.media.hero.sizes.tablet.url}/>
                                            <h2 style={{textAlign: "center"}}>{match.venueName}</h2>
                                        </div>
                                    )
                                } catch(e) {

                                }

                            })
                        }
                        {!isSmall && matches &&
                            matches.map((match, index) => {
                                return (
                                    <div className={"venue-list__container"}>
                                        {match && match.club && match.media.hero.sizes &&
                                            <DitherImage url={match.media.hero.sizes.tablet.url}
                                                         link={`/venue/${match.url}`}/>
                                        }
                                        <div>
                                            <div style={{width: "90%"}}>
                                                <AutoResizeText text={match && match.venueName} padding={"0px 0px 20px 0px"}
                                                                onClick={() => {
                                                                    navigateTo(match.url)
                                                                }}/>
                                            </div>
                                            <div className={"cuisines"}>
                                                {match && match.cuisineUsed.map((cuisine) => {
                                                    return (
                                                        <a style={{color: "black", textDecoration: "none"}}><h2
                                                            className={"link"}
                                                            onClick={() => nav(`/venues/?cuisine=${cuisine.name}`)}>{cuisine.name}</h2>
                                                        </a>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )

                            })
                        }

                    </section>
                </section>

            </>
        )
    }
}

export default Search;
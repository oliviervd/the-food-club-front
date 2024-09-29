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
    const [cuisine, setCuisine] = useState()
    const nav = useNavigate();
    const isSmall = useMediaQuery("(max-width: 600px)");
    const isBig = useMediaQuery("(min-width: 1400px)");

    const {data: venues, isLoading, error} =    useQuery(["venues"], ()=> fetchAPI('venue', 'en'));
    const {data: cuisines} = useQuery(["cuisines"], ()=>fetchAPI("cuisine", "en"))

    const [location, setLocation] = useState(null);
    const [prompt, setPrompt] = useState("");

    // fetch all venues

    useEffect(() => {
        const getVenues = async () => {
            const venues = await fetchAPI("venue", "en");
            const cuisines = await fetchAPI("cuisine", "en");
            const searchCuisine = searchParams.get("cuisine");
            const searchLocation = location
            const matchedVenues = venues.docs.filter(venue =>
                venue.cuisineUsed.some(cuisine => cuisine.name === searchCuisine) &&
                (!searchLocation || venue.club === searchLocation)
            );
            const matchedCuisine = cuisines.docs.filter(cuisine => cuisine.name === searchCuisine);
            setCuisine(matchedCuisine)
            setMatches(matchedVenues);
        }
        getVenues();
        setSearch(searchParams.get("cuisine"))
    }, [searchParams, location]);

    useEffect(()=>{
        setPrompt(generatePrompt(location))
    },[location])

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
                        {isSmall &&
                            matches.map((match, index) => {
                                return (
                                    <div key={index} className={"category-list__box"} onClick={() => {
                                        navigateTo(match.url)
                                    }}>
                                        <DitherImage url={match.media.hero.sizes.tablet.url}/>
                                        <h2 style={{textAlign: "center"}}>{match.venueName}</h2>
                                    </div>
                                )

                            })
                        }
                        {!isSmall &&
                            matches.map((match, index) => {
                                return (
                                    <div className={"venue-list__container"}>
                                        <DitherImage url={match.media.hero.sizes.tablet.url}
                                                     link={`/venue/${match.url}`}/>
                                        <div>
                                            <div style={{width: "90%"}}>
                                                <AutoResizeText text={match.venueName} padding={"0px 0px 20px 0px"}
                                                                onClick={() => {
                                                                    navigateTo(match.url)
                                                                }}/>
                                            </div>
                                            <div className={"cuisines"}>
                                                {match.cuisineUsed.map((cuisine) => {
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
                    {!isSmall &&
                        <section>
                            {cuisine[0].description &&
                                <p className={"text-main"} style={{fontSize: "var(--font-m)", paddingLeft: "20px"}}>
                                    {serialize(cuisine[0].description)}
                                </p>
                            }

                        </section>
                    }
                </section>

            </>
        )
    }
}

export default Search;
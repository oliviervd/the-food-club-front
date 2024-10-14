import Header from "../elements/Header.jsx";
import {useContext, useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import AutoResizeText from "../elements/AutoResizeText.jsx";
import {useQuery} from "@tanstack/react-query";
import {fetchAPI} from "../utils/utils.jsx";
import DitherImage from "../elements/DitherImage.jsx";
import {useMediaQuery} from "@uidotdev/usehooks";
import Banner from "../elements/Banner.jsx";
import {LocationColorContext} from "../utils/LocationColorContext.jsx";

const Search = () => {

    const { locationColor, handleLocationChange } = useContext(LocationColorContext);
    let { location } = locationColor


    const [searchParams, setSearchParams] = useSearchParams()
    const [search, setSearch] = useState("");
    const [matches, setMatches] = useState([]);
    const [cuisine, setCuisine] = useState(null);
    const [club, setClub] = useState(null);

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

    //navigate to selected venue
    function navigateTo(route) {
        nav(`/venue/${route}`)
    }


    return (
        <>
            <Header landing={true} location={club} setLocation={setClub} interact={true}/>
            <div>
                <Banner content={search}/>
            </div>
            {matches[0] &&
                <section className={"home__container"}>
                    <section style={{position: "relative"}}>
                        {isSmall && matches &&
                            matches.map((match, index) => {
                                console.log(match)
                                if (match._status == "published") {
                                    try {
                                        return (
                                            <div key={index} className={"category-list__box"} onClick={() => {
                                                navigateTo(match.url)
                                            }}>
                                                <DitherImage url={match.media.hero.sizes.tablet.url}/>
                                                <h2 style={{textAlign: "center"}}>{match.venueName}</h2>
                                            </div>
                                        )
                                    } catch (e) {

                                    }
                                }

                            })
                        }
                        {!isSmall && matches &&
                            matches.map((match, index) => {
                                if (match._status == "published") {
                                    return (
                                        <section>

                                        </section>
                                    )
                                }
                            })
                        }
                    </section>
                </section>
            }
        </>
    )
}

export default Search;
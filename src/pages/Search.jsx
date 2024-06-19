import Header from "../elements/Header.jsx";
import {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import AutoResizeText from "../elements/AutoResizeText.jsx";
import {useQuery} from "@tanstack/react-query";
import {fetchAPI} from "../utils/utils.jsx";
import DitherImage from "../elements/DitherImage.jsx";

const Search = () => {

    const [searchParams, setSearchParams] = useSearchParams()
    const [search, setSearch] = useState("");
    const [matches, setMatches] = useState([]);
    const nav = useNavigate();

    const [location, setLocation] = useState(null);
    const [prompt, setPrompt] = useState("");

    // fetch all venues
    const {data: venues, isLoading, error} = useQuery(["venue"], ()=>fetchAPI("venue", "en"))

    useEffect(() => {
        const getVenues = async () => {
            const venues = await fetchAPI("venue", "en");
            console.log(venues)
            const searchCuisine = searchParams.get("cuisine");
            const searchLocation = location
            const matchedVenues = venues.docs.filter(venue =>
                venue.cuisineUsed.some(cuisine => cuisine.name === searchCuisine) &&
                (!searchLocation || venue.club === searchLocation)
            );
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
            return `in ${location}`
        }
    }

    if (matches[0]) {
        return(
            <>
                <Header location={location} setLocation={setLocation} interact={true}/>
                <div className={"divider"}></div>
                <section style={{padding: "10px", position: "relative"}}>
                    <div style={{width: '100%', height: 'auto'}}>
                        <AutoResizeText text={`a list for those ${prompt} and craving ${search}`} maxFontSize={600} minFontSize={10}/>
                    </div>
                    {matches.map((match,index)=>{
                        return (
                            <div key={index} className={"category-list__box"} onClick={()=>{navigateTo(match.url)}}>
                                <DitherImage url={match.media.hero.sizes.tablet.url}/>
                                <h2 style={{textAlign: "center"}}>{match.venueName}</h2>
                            </div>
                        )

                    })}
                </section>

            </>
        )
    } else {
        return (
            <>
                <Header location={location} setLocation={setLocation} interact={true}/>
                <section style={{padding: "10px", position: "relative"}}>
                    <div style={{width: '100%', height: 'auto'}}>
                        <AutoResizeText text={`we realize you are ${prompt} and craving ${search} but...`} maxFontSize={600}
                                        minFontSize={10}/>
                    </div>
                </section>
                <div className={"category-list__box"} style={{padding: "10px", position: "relative"}}>
                    <DitherImage url={"https://iiif-prod.nypl.org/index.php?id=58835161&t=q"}/>
                    <i style={{width: "70%", padding: "20px"}}>"at the moment FOOD CLUB can't recommend anything that
                        fulfills these particular needs... we are truly sorry."</i>
                </div>

            </>
        )

    }


}

export default Search;
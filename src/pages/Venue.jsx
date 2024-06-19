import Header from "../elements/Header.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {fetchAPI} from "../utils/utils.jsx";
import {useQuery} from "@tanstack/react-query";
import AutoResizeText from "../elements/AutoResizeText.jsx";
import DitherImage from "../elements/DitherImage.jsx";
import serialize from "../utils/serialize.jsx";

const Venue = () => {

    const {venue: venueParam} = useParams();
    const {data: venues, isLoading, error} =    useQuery(["venues"], ()=> fetchAPI('venue', 'en'));
    const [venue, setVenue] = useState(null);
    const nav = useNavigate()

    const [location, setLocation] = useState(null);

    // todo: add locales
    // todo: add button to see it on the map
    // todo: add section with extra info; telephone, website, socials?
    // todo: add location (highlight in header)

    function navigateTo(route) {
        nav(route)
    }

    useEffect(() => {
        const getVenue = async () => {
            const venues = await fetchAPI("venue", "en");
            if (venues) {
                const res = venues.docs.find(venue => venue.url === venueParam);
                setVenue(res)
                setLocation(res.club)
            }
        }
        getVenue()
    }, [venueParam]);

    return (
        <>
            <Header setLocation={setLocation} location={location} interact={false}/>
            {venue &&
                <section style={{padding: "10px", position: "relative"}}>
                    <DitherImage url={venue.media.hero.sizes.tablet.url}/>
                    <div style={{width: "100%", height: 'auto', position: "relative"}}>
                        <AutoResizeText text={venue.venueName}/>
                    </div>
                    <div className={"cuisines"}>
                        {venue.cuisineUsed.map((cuisine) => {
                            return (
                                <a style={{color: "black", textDecoration:"none"}}><h2 className={"link"} onClick={() => navigateTo(`/venues/?cuisine=${cuisine.name}`)}>{cuisine.name}</h2></a>
                            )
                        })}
                    </div>
                    <section>
                    </section>
                    <p className={"text-main"}>
                        {serialize(venue.reviews.review)}
                    </p>
                    <div style={{
                        width: "98%",
                        height: 'auto',
                        position: "relative",
                        border: "4px solid black",
                        padding: "0 5px"
                    }}>
                        {venue.reservations &&
                            <a className={"link"} style={{color: "black", textDecoration:"none"}} href={venue.reservations}>
                                <AutoResizeText text='BOOK A TABLE'/>
                            </a>
                        }
                        {!venue.reservations &&
                            <AutoResizeText text='NO RESERVATIONS POSSIBLE'/>
                        }
                    </div>
                    <div className={"divider"}></div>
                    <h2>more info</h2>
                    <div className={"cuisines"}>
                        <h2>website</h2>
                        <h2>phone</h2>
                    </div>
                </section>
            }
        </>
    )
}

export default Venue
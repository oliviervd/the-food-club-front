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
    // todo: add map
    // todo: add section with extra info; telephone, website, socials?
    // todo: add tip box

    function navigateTo(route) {
        nav(route)
    }

    useEffect(() => {
        const getVenue = async () => {
            const venues = await fetchAPI("venue", "en");
            if (venues) {
                const res = venues.docs.find(venue => venue.url === venueParam);
                setVenue(res)
                try {
                    setLocation(res.club)
                } catch (e) {
                    console.error(e)
                }
            }
        }
        getVenue()
    }, [venueParam]);

    return (
        <>
            <Header setLocation={setLocation} location={location} interact={false}/>
            {venue &&
                <section style={{padding: "0 10px", position: "relative"}}>
                    <DitherImage style={{justifyContent: "center", maxWidth: "99%"}}
                                 url={venue.media.hero.sizes.tablet.url}/>
                    <div style={{width: "100%", height: 'auto', position: "relative"}}>
                        <AutoResizeText text={venue.venueName} padding={"10px 0 30px 0"}/>
                    </div>
                    <div className={"cuisines"}>
                        {venue.cuisineUsed.map((cuisine) => {
                            return (
                                <a style={{color: "black", textDecoration: "none"}}><h2 className={"link"}
                                                                                        onClick={() => navigateTo(`/venues/?cuisine=${cuisine.name}`)}>{cuisine.name}</h2>
                                </a>
                            )
                        })}
                    </div>
                    <section>
                    </section>
                    <p className={"text-main"}>
                        {serialize(venue.reviews.review)}
                    </p>

                    {venue.foodClubOrder &&
                        <div className={"venue-tip__container"}>
                            <div className={"text-main"}>☞</div>
                            <p className={"text-main"}>{serialize(venue.foodClubOrder)}</p>
                        </div>
                    }

                    <div>
                        {venue.address &&
                            <div style={{maxWidth: "100%"}}>
                                <AutoResizeText text={venue.address.street + " " + venue.address.houseNumber + ", " + venue.address.postalCode + " " + venue.address.city} />
                            </div>
                        }
                    </div>

                    <div style={{
                        width: "99%",
                        height: 'auto',
                        textAlign: "center",
                        justifyContent: "center",
                        position: "relative",
                        border: "4px solid black",
                    }}>
                        {venue.reservations &&
                            <a className={"link"} style={{color: "black", textDecoration: "none"}}
                               href={venue.reservations}>
                                <AutoResizeText text='BOOK A TABLE'/>
                            </a>
                        }
                        {!venue.reservations &&
                            <div style={{maxWidth: "99%"}}>
                                <AutoResizeText text='NO RESERVATIONS POSSIBLE'/>
                            </div>
                        }
                    </div>


                </section>
            }
        </>
    )
}

export default Venue
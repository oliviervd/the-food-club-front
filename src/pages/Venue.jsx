import Header from "../elements/Header.jsx";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {fetchAPI, getCSSVariableValue, surprise} from "../utils/utils.jsx";
import {useQuery} from "@tanstack/react-query";
import AutoResizeText from "../elements/AutoResizeText.jsx";
import DitherImage from "../elements/DitherImage.jsx";
import serialize from "../utils/serialize.jsx";
import {useMediaQuery} from "@uidotdev/usehooks";

const Venue = () => {

    const {venue: venueParam} = useParams();
    const [searchParams, setSearchParams]= useSearchParams()
    const {data: venues, isLoading, error} =    useQuery(["venues"], ()=> fetchAPI('venue', 'en'));
    const [venue, setVenue] = useState(null);
    const nav = useNavigate()
    const isDesktop = useMediaQuery("(min-width: 1200px)");

    const [venueLocation, setVenueLocation] = useState(null);

    // todo: add locales
    // todo: add map
    // todo: add section with extra info; telephone, website, socials

    // if surprise in params, add button to surprise again.
    console.log(searchParams)

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
                    setVenueLocation(res.club)
                } catch (e) {
                    console.error(e)
                }
            }
        }
        getVenue()
    }, [venueParam]);

    return (
        <>
            <Header landing={true} setLocation={setVenueLocation} venueLocation={venueLocation} interact={false} greyOut={true}/>
            {venue &&
                <section className={"venue__container"}>
                    <div className={"grid"}>
                        <div>
                            <DitherImage style={{justifyContent: "center", maxWidth: "99%"}}
                                         url={venue.media.hero.sizes.tablet.url}/>
                            {!isDesktop &&
                                <div style={{width: "100%", height: 'auto', position: "relative"}}>
                                    <AutoResizeText text={venue.venueName} padding={"10px 0 10px 0"}/>
                                </div>

                            }
                            <div>
                                {venue.address &&
                                    <div style={{maxWidth: "100%"}}>
                                        <h2 className={"address"}>
                                            {venue.address.street + " " + venue.address.houseNumber + ", " + venue.address.postalCode + " " + venue.address.city}
                                        </h2>
                                    </div>
                                }
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
                            {isDesktop &&
                                <div style={{display: "none"}}>
                                    <div>
                                        {venue.address &&
                                            <div style={{maxWidth: "100%"}}>
                                                <AutoResizeText
                                                    text={venue.address.street + " " + venue.address.houseNumber + ", " + venue.address.postalCode + " " + venue.address.city}/>
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
                                        marginBottom: "20px"
                                    }}>
                                        {venue.reservations &&
                                            <div className={"link"}
                                                 href={venue.reservations}>
                                                <AutoResizeText text='BOOK A TABLE'/>
                                            </div>
                                        }
                                        {!venue.reservations &&
                                            <div style={{maxWidth: "99%"}}>
                                                <AutoResizeText text='NO RESERVATIONS POSSIBLE'/>
                                            </div>
                                        }
                                    </div>
                                </div>

                            }
                        </div>
                        <div className={"container-big"}>
                            {isDesktop &&
                                <div style={{width: "100%", height: 'auto', position: "relative"}}>
                                    <AutoResizeText text={venue.venueName} padding={"10px 0 30px 0"}/>
                                </div>
                            }
                            <p className={"text-main"}>
                                {serialize(venue.reviews.review)}
                            </p>

                            {venue.foodClubOrder &&
                                <div className={"venue-tip__container"}>
                                    <div className={"text-main"}>☞</div>
                                    <p className={"text-main"}>{serialize(venue.foodClubOrder)}</p>
                                </div>
                            }

                            {!isDesktop &&
                                <section>

                                        {venue.reservations &&

                                                <div className={"link reservations"}
                                                     href={venue.reservations}>
                                                    <h2>book a table</h2>
                                                </div>
                                        }
                                </section>
                            }


                        </div>
                    </div>


                </section>
            }
        </>
    )
}

export default Venue
import Header from "../elements/Header.jsx";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {fetchAPI, getCSSVariableValue, surprise} from "../utils/utils.jsx";
import {useQuery} from "@tanstack/react-query";
import AutoResizeText from "../elements/AutoResizeText.jsx";
import DitherImage from "../elements/DitherImage.jsx";
import serialize from "../utils/serialize.jsx";
import {BackgroundColorContext} from "../utils/BackgroundColorContext.jsx";

const Venue = () => {

    const {venue: venueParam} = useParams();
    const [searchParams, setSearchParams]= useSearchParams()
    const {data: venues, isLoading, error} =    useQuery(["venues"], ()=> fetchAPI('venue', 'en'));
    const [venue, setVenue] = useState(null);
    const nav = useNavigate()
    const { setBgColor } = useContext(BackgroundColorContext);

    const [location, setLocation] = useState(null);

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
                    setLocation(res.club)
                    if (res.club == "antwerp") {
                        setBgColor(getCSSVariableValue("--turquoise-green"));
                    } else if (res.club == "gent") {
                        setBgColor(getCSSVariableValue("--pale-lemon-yellow"));
                    } else {
                        setBgColor(getCSSVariableValue("--salvia-blue"));
                    }
                } catch (e) {
                    console.error(e)
                }
            }
        }
        getVenue()
    }, [venueParam]);

    return (
        <>
            <Header landing={true} setLocation={setLocation} location={location} interact={false} greyOut={true}/>
            {venue &&
                <section className={"venue__container"}>
                    {searchParams.get("surprise") && location &&
                        <div style={{
                            width: "99%",
                            height: 'auto',
                            textAlign: "center",
                            justifyContent: "center",
                            position: "relative",
                            border: "4px solid black",
                            marginBottom: "5px"
                        }} onClick={()=>{surprise(location, nav)}}>
                            <div className={"link"} style={{maxWidth: "100%"}}>
                                <AutoResizeText text={`SURPRISE AGAIN IN ${location.toUpperCase()}`}/>
                            </div>
                        </div>
                    }
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
                </section>
            }
        </>
    )
}

export default Venue
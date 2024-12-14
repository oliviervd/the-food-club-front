import Header from "../elements/Header.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {fetchAPI, convertHour} from "../utils/utils.jsx";
import {useQuery} from "@tanstack/react-query";
import AutoResizeText from "../elements/AutoResizeText.jsx";
import DitherImage from "../elements/DitherImage.jsx";
import serialize from "../utils/serialize.jsx";
import {useMediaQuery} from "@uidotdev/usehooks";
import MapSmall from "../elements/mapSmall.jsx";
import Loading from "./Loading.jsx";

const Venue = () => {

    // todo: add map (refer to)
    // todo: add status (open now / closed)
    // todo: add section with extra info; telephone, website, socials)

    const { venue: venueParam } = useParams();
    const nav = useNavigate();
    const isDesktop = useMediaQuery("(min-width: 1200px)");

    // Fetch venues using React Query
    const { data: venues, isLoading, error } = useQuery(["venues"], () => fetchAPI("venue", "en"), {
        staleTime: 3600000, // Cache venue data for 1 hour
        refetchOnWindowFocus: false,
    });

    // Derive the current venue based on the parameter
    const venue = venues?.docs.find((v) => v.url === venueParam) || null;

    // Set the location of the venue (optional)
    const venueLocation = venue?.club || null;

    // Navigation Function
    const navigateTo = (route) => {
        nav(route);
    };

    if (isLoading) return <Loading/>;
    if (error) return <p>Error loading venue data. Please try again.</p>;

    return (
        <>
            <Header landing={true} setLocation={null} venueLocation={venueLocation} interact={false} greyOut={true} venue={true}/>
            {venue && !isDesktop &&
                <section className={"venue__container"}>
                    <div className={"grid"}>
                        <div>
                            <div className={"image-hero"}>
                                <DitherImage style={{justifyContent: "center", maxWidth: "99%"}}
                                             url={venue.media.hero.sizes.tablet.url}/>
                            </div>

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
                                                <div className={"link reservations"}>
                                                    <a href={venue.reservations}>book a table</a>
                                                </div>
                                        }
                                </section>
                            }

                            {venue.hours.length > 1 &&
                                <section className={"venue-open"}>
                                    {venue.hours.map((day) => {
                                        console.log(venue.hours)
                                        return(
                                            <div>
                                                <p className={"day"}>{day.openDay}</p>
                                                <div>
                                                    <p>{convertHour(day.openFrom)}</p>
                                                    <p>-</p>
                                                    <p>{convertHour(day.openTill)}*</p>
                                                </div>

                                            </div>
                                        )
                                    })}
                                    <p style={{marginBottom: "0px", marginTop: "5px"}}>
                                      * kitchen hours might differ.
                                    </p>
                                </section>
                            }
                            {venue.otherOpeningHours &&
                                <section className={"venue-open"}>
                                    {serialize(venue.otherOpeningHours)}
                                </section>
                            }
                        </div>
                    </div>
                </section>
            }
            {venue && isDesktop &&
                <section className={"venue__container container-big_desktop"}>
                    <div>
                        <div style={{width: "100%", height: 'auto', position: "relative", margin: "none"}}>
                            <AutoResizeText text={venue.venueName} padding={"0 0 0 0"}/>
                        </div>
                        <div>
                            {venue.address &&
                                <div>
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
                        <p className={"text-main"}>
                            {serialize(venue.reviews.review)}
                        </p>

                        <section style={{display: "grid", gridTemplateColumns: "1fr 1fr", gridGap: "20px", marginBottom: "20px" }}>
                            {venue.foodClubOrder &&
                                <div className={"venue-tip__container"}>
                                    <div className={"text-main"}>☞</div>
                                    <p className={"text-main"}>{serialize(venue.foodClubOrder)}</p>
                                </div>
                            }

                            {venue.hours.length > 1 &&
                                <section className={"venue-open"}>
                                    {venue.hours.map((day) => {
                                        console.log(venue.hours)
                                        return (
                                            <div>
                                                <p className={"day"}>{day.openDay}</p>
                                                <div>
                                                    <p>{convertHour(day.openFrom)}</p>
                                                    <p>-</p>
                                                    <p>{convertHour(day.openTill)}*</p>
                                                </div>

                                            </div>
                                        )
                                    })}
                                    <p style={{marginBottom: "0px", marginTop: "5px"}}>
                                        * kitchen hours might differ.
                                    </p>
                                </section>
                            }
                            {venue.otherOpeningHours &&
                                <section className={"venue-open"}>
                                    {serialize(venue.otherOpeningHours)}
                                </section>
                            }
                        </section>



                    </div>
                        <DitherImage style={{justifyContent: "center", maxWidth: "99%"}}
                                     url={venue.media.hero.sizes.tablet.url}/>
                </section>
            }
        </>
    )
}

export default Venue
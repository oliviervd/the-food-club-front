'use client';

import { useParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useLivePreview } from '@payloadcms/live-preview-react';
import { getClientSideURL } from '../../../../utils/getURL';
import React, { useEffect, useState } from 'react';
import Header from "../../../../components/Header.jsx";
import AutoResizeText from "../../../../components/AutoResizeText.jsx";
import serialize from "../../../../utils/serialize.jsx";
import Link from "next/link";
import Image from "next/image.js";

export default function VenueClient({ initialVenue }) {
    const [isDesktop, setIsDesktop] = useState(false);
    const { venue: venueParam } = useParams();
    const baseUrl = getClientSideURL();
    const queryClient = useQueryClient();

    useEffect(() => {
        const checkWidth = () => setIsDesktop(window.innerWidth > 1200);
        checkWidth();
        window.addEventListener("resize", checkWidth);
        return () => window.removeEventListener("resize", checkWidth);
    }, []);

    const { data: venue } = useLivePreview({
        initialData: initialVenue,
        serverURL: baseUrl,
        depth: 2,
    });

    useEffect(() => {
        if (venueParam) {
            queryClient.prefetchQuery({
                queryKey: ["venue", venueParam],
                queryFn: async () => {
                    const response = await fetch(
                        `${baseUrl}/api/venues?where[url][equals]=${venueParam}&depth=2`
                    );
                    const data = await response.json();
                    return data.docs[0] || null;
                },
            });
        }
    }, [venueParam, queryClient, baseUrl]);

    if (!venue) return <div>Venue not found.</div>;

    return (
        <>
            <Header
                landing={true}
                setLocation={null}
                venueLocation={venue?.club || null}
                interact={false}
                greyOut={true}
                venue={true}
            />
            <div className="desktop-view">
                <DesktopView venue={venue} />
            </div>
            <div className="mobile-view">
                <MobileView venue={venue} />
            </div>
        </>
    );
}

function DesktopView({ venue }) {
    return (
        <section className="venue__container container-big_desktop">
            <div>
                {venue.venueName && (
                    <div style={{ width: "100%", position: "relative" }}>
                        <AutoResizeText text={venue.venueName} padding="0" />
                    </div>
                )}

                {venue.information?.address && (
                    <h2 className="address">
                        {`${venue.information.address.street} ${venue.information.address.houseNumber}, ${venue.information.address.postalCode} ${venue.information.address.city}`}
                    </h2>
                )}

                <CuisineList venue={venue} />

                {venue.damage &&
                    <div className={"cuisines"} style={{marginTop: "5px"}}>
                        <Link href={`/budget-control/${venue.damage}`}>
                            <div className={"link"}>
                                <h2>{venue.damage.replaceAll("*","💸")}</h2>
                            </div>
                        </Link>
                    </div>
                }

                <div className="text-main" style={{ paddingTop: "20px" }}>
                    {serialize(venue.review?.review)}
                </div>

                <section
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gridGap: "20px",
                        marginBottom: "20px",
                    }}
                >
                    {venue.review?.foodClubOrder && (
                        <div className="venue-tip__container">
                            <div className="text-main">☞</div>
                            <p className="text-main">{serialize(venue.review.foodClubOrder)}</p>
                        </div>
                    )}
                    <OpeningHours venue={venue} />
                </section>

                {venue.information.reservations && (
                    <div className="link reservations">
                        <a href={venue.information.reservations}>book a table</a>
                    </div>
                )}
            </div>

            <div className="image-container" style={{ marginTop: "30px", minHeight: "500px"}}>
                <Image
                    src={venue.media.hero.url}
                    placeholder={"blur"}
                    blurDataURL={venue.media.hero.thumbnailURL}
                    alt={`hero image for ${venue.venueName}`}
                    fill
                    style={{ objectFit: 'cover'}}
                    sizes="100vw"
                    priority={false}
                />
            </div>
        </section>
    );
}

function MobileView({ venue }) {
    console.log("venue", venue)
    return (
        <section className="venue__container">
            <div className="grid">
                <div>
                    <div className="image-container">
                        <Image
                            src={venue.media.hero.url}
                            placeholder={"blur"}
                            blurDataURL={venue.media.hero.thumbnailURL}                            alt={`hero image for ${venue.venueName}`}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="100vw"
                            priority={false}
                        />
                    </div>

                    {venue.venueName && (
                        <div style={{ width: "100%", position: "relative" }}>
                            <AutoResizeText text={venue.venueName} padding="10px 0" />
                        </div>
                    )}

                    {venue.information?.address && (
                        <h2 className="address">
                            {`${venue.information.address.street} ${venue.information.address.houseNumber}, ${venue.information.address.postalCode} ${venue.information.address.city}`}
                        </h2>
                    )}

                    <CuisineList venue={venue} />

                    {venue.damage &&
                        <div className={"cuisines"} style={{marginTop: "5px"}}>
                            <div className={"link"}>
                                <h2>{venue.damage.replaceAll("*","💸")}</h2>
                            </div>
                        </div>
                    }
                </div>

                <div className="container-big">
                    {venue.review?.review && (
                        <div className="text-main">{serialize(venue.review.review)}</div>
                    )}

                    {venue.review?.foodClubOrder && (
                        <div className="venue-tip__container">
                            <div className="text-main">☞</div>
                            <p className="text-main">{serialize(venue.review.foodClubOrder)}</p>
                        </div>
                    )}

                    {venue.information.reservations && (
                        <div className="link reservations">
                            <a href={venue.information.reservations}>book a table</a>
                        </div>
                    )}

                    <OpeningHours venue={venue} />
                </div>
            </div>
        </section>
    );
}

function CuisineList({ venue }) {
    return (
        <div className="cuisines">
            {[...(venue.information?.cuisine || []), ...(venue.information?.dishes || []), ...(venue.information?.drinks || [])].map((item, index) => (
                <div key={index}>
                    <h2 className="link">
                        <Link href={`/venues/${item.name}`}>{item.name}</Link>
                    </h2>
                </div>
            ))}
        </div>
    );
}

function OpeningHours({ venue }) {
    if (!venue.information?.hours || venue.information.hours.length <= 1) return null;

    return (
        <section className="venue-open">
            {venue.information.hours.map((day, index) => (
                <div key={index} style={{ paddingBottom: "5px", borderBottom: "1px solid #ccc" }}>
                    <p className="day">{day.dayOfWeek}</p>
                    {day.isClosed ? (
                        <div><p>closed</p></div>
                    ) : (
                        <div className="hours">
                            {day.periods.map((period, i) => (
                                <div className="slot" key={i}>
                                    <p>{period.openTime}</p>
                                    <p>-</p>
                                    <p>{period.closeTime || period.closeTimeSpecial || ''}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            {venue.information.remarks && (
                <p style={{ marginBottom: 0, marginTop: "5px" }}>
                    {venue.information.remarks}
                </p>
            )}
        </section>
    );
}
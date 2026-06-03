'use client';

import { useParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useLivePreview } from '@payloadcms/live-preview-react';
import React, { useEffect, useState } from 'react';
import Link from "next/link";

import { getClientSideURL } from '../../../../utils/getURL';
import { terraceIsSunny } from "../../../../hooks/weather/isSunny.tsx";

import Header from "../../../../components/Header.jsx";
import AutoResizeText from "../../../../components/AutoResizeText.jsx";
import serialize from "../../../../utils/serialize.jsx";

const getHeroUrl = (media, preferred = 'tablet') => {
    const sizes = media?.hero?.sizes || {};

    const isValidUrl = (url) => {
        if (!url || typeof url !== 'string') return false;
        try {
            const parsed = new URL(url);
            return parsed.pathname.length > 1;
        } catch {
            return false;
        }
    };

    const candidates = [
        sizes[preferred]?.url,
        sizes.tablet?.url,
        sizes.mobileFriendly?.url,
        sizes.mobileThumbnail?.url,
        media?.hero?.url,
    ];

    return candidates.find(isValidUrl) || null;
};

export default function VenueClient({ initialVenue }) {
    const [isDesktop, setIsDesktop] = useState(true);
    const [hydrated, setHydrated] = useState(false);
    const [isSunny, setIsSunny] = useState(false);

    const { venue: venueParam } = useParams();
    const baseUrl = getClientSideURL();
    const queryClient = useQueryClient();

    useEffect(() => {
        const checkWidth = () => setIsDesktop(window.innerWidth > 1200);
        checkWidth();
        setHydrated(true);
        window.addEventListener("resize", checkWidth);
        return () => window.removeEventListener("resize", checkWidth);
    }, []);

    const { data: venue } = useLivePreview({
        initialData: initialVenue,
        serverURL: baseUrl,
        depth: 2,
    });

    useEffect(() => {
        if (venueParam && initialVenue) {
            queryClient.setQueryData(["venue", venueParam], initialVenue);
        }
    }, [venueParam, initialVenue, queryClient]);

    useEffect(() => {
        setIsSunny(terraceIsSunny(venue));
    }, [venue]);

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
            {isDesktop ? (
                <DesktopView venue={venue} isSunny={isSunny} />
            ) : (
                <MobileView venue={venue} isSunny={isSunny} />
            )}
        </>
    );
}

function VenueMeta({ venue }) {
    return (
        <>
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

            {venue.damage && (
                <div className="cuisines" style={{ marginTop: "5px" }}>
                    <Link href={`/budget-control/${venue.damage}`}>
                        <div className="link">
                            <h2>{venue.damage.replaceAll("*", "💸")}</h2>
                        </div>
                    </Link>
                </div>
            )}
        </>
    );
}

function DesktopView({ venue, isSunny }) {
    const heroUrl = getHeroUrl(venue.media, 'tablet');

    return (
        <section className="venue__container container-big_desktop">
            <div>
                <VenueMeta venue={venue} />

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

                {venue.information?.reservations && (
                    <div className="link reservations">
                        <a href={venue.information.reservations}>book a table</a>
                    </div>
                )}
            </div>

            {heroUrl && (
                <div className="image-container" style={{ marginTop: "30px", minHeight: "500px", position: 'relative', overflow: 'hidden' }}>
                    <img
                        src={heroUrl}
                        alt={`hero image for ${venue.venueName}`}
                        loading="eager"
                        fetchpriority="high"
                        decoding="async"
                        style={{
                            objectFit: 'cover',
                            width: '100%',
                            height: '100%',
                            display: 'block',
                        }}
                    />
                </div>
            )}
        </section>
    );
}

function MobileView({ venue, isSunny }) {
    const heroUrl = getHeroUrl(venue.media, 'mobileFriendly');

    return (
        <section className="venue__container">
            <div className="grid">
                <div>
                    {heroUrl && (
                        <div className="image-container" style={{ position: 'relative', overflow: 'hidden' }}>
                            <img
                                src={heroUrl}
                                alt={`hero image for ${venue.venueName}`}
                                loading="eager"
                                fetchpriority="high"
                                decoding="async"
                                style={{
                                    objectFit: 'cover',
                                    width: '100%',
                                    height: '100%',
                                    display: 'block',
                                }}
                            />
                        </div>
                    )}

                    <VenueMeta venue={venue} />
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

                    {venue.information?.reservations && (
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
    const items = [
        ...(venue.information?.cuisine || []),
        ...(venue.information?.dishes || []),
        ...(venue.information?.drinks || []),
    ];

    if (items.length === 0) return null;

    return (
        <div className="cuisines">
            {items.map((item) => (
                <div key={item.id || item.name}>
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
            {venue.information.hours.map((day) => (
                <div
                    key={day.id || day.dayOfWeek}
                    style={{ paddingBottom: "5px", borderBottom: "1px solid #ccc" }}
                >
                    <p className="day">{day.dayOfWeek}</p>
                    {day.isClosed ? (
                        <div><p>closed</p></div>
                    ) : (
                        <div className="hours">
                            {day.periods.map((period, i) => (
                                <div className="slot" key={period.id || i}>
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
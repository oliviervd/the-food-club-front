'use client'

import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';

import Header from "../../../components/Header.jsx";
import Banner from "../../../components/Banner.jsx";
import Loading from "../loading.jsx";
import ScrollToTop from "../../../components/scrollToTop.jsx";

import { fetchAPI, venueStatus, calculateDistance, getClosingTime } from "../../../utils/utils.jsx";
import { LocationColorContext } from "../../../contexts/LocationColorContext.jsx";

const getHeroUrl = (media, preferred = 'mobileFriendly') => {
    const sizes = media?.hero?.sizes || {};
    const isValidUrl = (url) => {
        if (!url || typeof url !== 'string') return false;
        try {
            const parsed = new URL(url);
            return parsed.pathname.length > 1;
        } catch { return false; }
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

const NearMeClient = () => {
    const { locationColor } = useContext(LocationColorContext);
    const { location: club } = locationColor;
    const router = useRouter();

    const [userPosition, setUserPosition] = useState(null);
    const [geoError, setGeoError] = useState(null);
    const [radius, setRadius] = useState(1);
    const [openOnly, setOpenOnly] = useState(true);

    useEffect(() => {
        if (!navigator.geolocation) {
            setGeoError("Geolocation is not supported by your browser");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserPosition({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => {
                setGeoError("Unable to retrieve your location");
            }
        );
    }, []);

    const { data: venuesData, isLoading: venuesLoading, error: venuesError } = useQuery({
        queryKey: ['venues', 'all'],
        queryFn: () => fetchAPI('venues', 'en', { limit: 1000 }),
        enabled: !!userPosition,
    });

    const filteredVenues = useMemo(() => {
        if (!venuesData?.docs || !userPosition) return [];

        return venuesData.docs
            .filter(v => v._status === "published")
            .map(v => {
                const vLat = v.information?.address?.longitude;
                const vLng = v.information?.address?.latitude;
                if (vLat === undefined || vLng === undefined) return null;
                const distance = calculateDistance(userPosition.lat, userPosition.lng, vLat, vLng);
                return { ...v, distance };
            })
            .filter(v => v !== null)
            .filter(v => v.distance <= radius)
            .filter(v => {
                if (!openOnly) return true;
                const status = venueStatus(v);
                return status === "open now";
            })
            .sort((a, b) => a.distance - b.distance);
    }, [venuesData, userPosition, radius, openOnly]);

    // Navigate to map and show route to venue
    const navigateToMap = debounce((venue) => {
        const lat = venue.information?.address?.longitude;
        const lng = venue.information?.address?.latitude;
        router.push(`/map?venue=${venue.url}&lat=${lat}&lng=${lng}&directions=true`);
    }, 200);

    if (geoError) return (
        <>
            <Header landing interact location={club} setLocation={() => {}} />
            <Banner content="Near me" />
            <section className="home__container">
                <p style={{ textAlign: "center", padding: "20px" }}>{geoError}</p>
            </section>
        </>
    );

    if (!userPosition || venuesLoading) return <Loading />;
    if (venuesError) return <div>Error: {venuesError.message}</div>;

    const radiusOptions = [1, 2, 5, 10];

    return (
        <>
            <Header landing interact location={club} setLocation={() => {}} />
            <ScrollToTop />
            <Banner content="Near me and open" />

            <section className="home__container">
                <div>
                    <nav className={"flex-buttons"} style={{ margin: "10px" }}>
                        {radiusOptions.map((r, index) => (
                            <h2
                                key={r}
                                onClick={() => setRadius(r)}
                                style={{
                                    padding: "0px 5px",
                                    border: "2px solid var(--color-secondary)",
                                    borderLeft: index === 0 ? "2px solid var(--color-secondary)" : "none",
                                    backgroundColor: radius === r ? "var(--color-secondary)" : "var(--color-main)",
                                    color: radius === r ? "var(--color-main)" : "var(--color-secondary)",
                                    cursor: "pointer",
                                }}
                            >
                                {r} km
                            </h2>
                        ))}
                    </nav>
                    <p style={{ color: "var(--color-secondary)", marginBottom: "20px" }}>
                        {filteredVenues.length} result{filteredVenues.length !== 1 ? 's' : ''} found — tap to get directions
                    </p>
                </div>

                <section>
                    {filteredVenues.map((v, index) => {
                        const status = venueStatus(v);
                        const heroUrl = getHeroUrl(v.media, 'mobileFriendly');
                        if (!heroUrl) return null;

                        return (
                            <div
                                key={v.id || index}
                                className="category-list__box"
                                onClick={() => navigateToMap(v)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                    {v.new && <div className="image__club-tag">NEW</div>}
                                    <img
                                        src={heroUrl}
                                        alt={`hero image for ${v.venueName}`}
                                        loading={index < 4 ? 'eager' : 'lazy'}
                                        fetchpriority={index < 4 ? 'high' : 'auto'}
                                        style={{
                                            objectFit: 'cover',
                                            width: '100%',
                                            height: '100%',
                                            border: "2px solid var(--color-main)",
                                            boxSizing: 'border-box',
                                            display: 'block',
                                        }}
                                    />
                                    {status && <div className="venue-open">{status}</div>}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        margin: '6px',
                                        background: 'var(--color-main)',
                                        border: '1px solid var(--color-secondary)',
                                        padding: '2px 8px',
                                        fontSize: '0.75rem',
                                        fontFamily: 'inherit',
                                        color: 'var(--color-secondary)',
                                    }}>
                                        {v.distance.toFixed(1)} km →
                                    </div>
                                </div>
                                <h2 style={{ textAlign: "center" }}>{v.venueName}</h2>
                            </div>
                        );
                    })}
                    {filteredVenues.length === 0 && (
                        <p style={{ textAlign: "center", padding: "20px" }}>
                            No venues found within {radius} km.
                        </p>
                    )}
                </section>
            </section>
        </>
    );
};

export default NearMeClient;
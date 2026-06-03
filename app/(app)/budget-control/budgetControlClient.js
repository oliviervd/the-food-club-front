'use client'

import Header from "../../../components/Header.jsx";
import ScrollToTop from "../../../components/scrollToTop.jsx";
import Banner from "../../../components/Banner.jsx";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic.js";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "../../../utils/utils.jsx";
import Link from "next/link";

const MapSmall = dynamic(() => import('../../../components/mapSmall.jsx'), {
    ssr: false
});

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

const descriptions = {
    "*": "Cheap, fast, glorious. Think killer snacks, sandwiches, soup, or fries that hit way above their weight.",
    "**": "A proper meal, full plate, maybe a drink. You leave satisfied and your wallet stays chill.",
    "***": "Starter, main, dessert—or a damn good dish with a glass of wine. You're out for a *nice* time.",
    "****": "A full-blown dinner, multi-course, a bottle on the table. This is where the vibe goes gourmet.",
    "*****": "Tasting menus, wine pairings, maybe a sommelier named Hugo. It's a night out with a capital N.",
};

const damage = {
    "*": "€0 to €10 a head",
    "**": "€10 to €25 a head",
    "***": "€25 to €50 a head",
    "****": "€25 to €75 a head",
    "*****": "€75+ a head",
};

const BudgetControlClient = ({ budget, briefs }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        const checkWidth = () => setIsMobile(window.innerWidth < 600);
        checkWidth();
        window.addEventListener("resize", checkWidth);
        return () => window.removeEventListener("resize", checkWidth);
    }, []);

    const { data: venuesData, isLoading: venuesLoading, error: venuesError } = useQuery({
        queryKey: ["venues"],
        queryFn: () => fetchAPI('venue', 'en', { limit: 1000 }),
    });

    useEffect(() => {
        if (venuesData) {
            setMatches(venuesData.docs.filter(venue => venue.damage === budget));
        }
    }, [budget, venuesData]);

    return (
        <>
            <Header landing={true} interact={true} />
            <ScrollToTop />
            <Banner content={budget.replaceAll("*", "💸") || "budget"} />
            <section className={"home__container"}>

                {!isMobile && matches && matches.length > 0 && (
                    <section className="desktop" style={{ position: "relative" }}>
                        <section className="venue-list__container-main">
                            <section>
                                <div className="venue info-box" style={{ flexFlow: "column" }}>
                                    <p>{damage[budget]}</p>
                                    <h2>{descriptions[budget]}</h2>
                                </div>
                                {matches.map((venue) => {
                                    if (venue._status !== "published") return null;
                                    const heroUrl = getHeroUrl(venue.media, 'tablet');
                                    if (!heroUrl) return null;
                                    return (
                                        <div className="venue" key={venue.id || venue.url}>
                                            <div className="venue__image">
                                                <Link href={`/venue/${venue.url}`}>
                                                    <div style={{ height: "200px", position: 'relative', overflow: 'hidden' }}>
                                                        <img
                                                            src={heroUrl}
                                                            alt={`hero image for ${venue.venueName}`}
                                                            loading="lazy"
                                                            style={{
                                                                objectFit: 'cover',
                                                                width: '100%',
                                                                height: '100%',
                                                                border: "2px solid var(--color-main)",
                                                                boxSizing: 'border-box',
                                                                display: 'block',
                                                            }}
                                                        />
                                                    </div>
                                                    <h2>{venue.venueName}</h2>
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </section>
                        </section>
                        <section className={"venue-list__container-others"}>
                            <MapSmall venues={matches || []} highlight={null} onHover={null} />
                        </section>
                    </section>
                )}

                {isMobile && (
                    <section>
                        <div className={"cat_description"}>
                            <div>
                                <h2>
                                    <p>{descriptions[budget]}</p>
                                    <p style={{ fontFamily: "DM-serif-display-italic", fontWeight: "200", fontSize: "1rem" }}>{damage[budget]}</p>
                                </h2>
                            </div>
                        </div>
                        {matches && matches.length > 0 && matches.map((venue) => {
                            if (venue._status !== "published") return null;
                            const heroUrl = getHeroUrl(venue.media, 'mobileFriendly');
                            if (!heroUrl) return null;
                            return (
                                <div key={venue.id || venue.url} className="category-list__box">
                                    <Link href={`/venue/${venue.url}`}>
                                        <div style={{ height: "200px", position: 'relative', overflow: 'hidden' }}>
                                            <img
                                                src={heroUrl}
                                                alt={`hero image for ${venue.venueName}`}
                                                loading="lazy"
                                                style={{
                                                    objectFit: 'cover',
                                                    width: '100%',
                                                    height: '100%',
                                                    border: "2px solid var(--color-main)",
                                                    boxSizing: 'border-box',
                                                    display: 'block',
                                                }}
                                            />
                                        </div>
                                        <h2 style={{ textAlign: "center" }}>{venue.venueName}</h2>
                                    </Link>
                                </div>
                            );
                        })}
                    </section>
                )}
            </section>
        </>
    );
};

export default BudgetControlClient;
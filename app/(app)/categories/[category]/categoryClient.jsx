'use client'

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

import Header from "../../../../components/Header.jsx";
import Banner from "../../../../components/Banner.jsx";
import Loading from "../../loading.jsx";
import ScrollToTop from "../../../../components/scrollToTop.jsx";

import { fetchAPI, shuffleArray, venueStatus } from "../../../../utils/utils.jsx";
import { LocationColorContext } from "../../../../contexts/LocationColorContext.jsx";

const MapSmall = dynamic(
    () => import("../../../../components/mapSmall.jsx"),
    { ssr: false }
);

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

const CategoryClient = () => {
    const { locationColor } = useContext(LocationColorContext);
    const { location } = locationColor;
    const { category: categoryParam } = useParams();

    const [highlightedVenue, setHighlightedVenue] = useState(null);
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' ? window.innerWidth < 600 : false
    );

    useEffect(() => {
        const checkWidth = () => setIsMobile(window.innerWidth < 600);
        checkWidth();
        window.addEventListener("resize", checkWidth);
        return () => window.removeEventListener("resize", checkWidth);
    }, []);

    const { data: categoryData, isLoading, error } = useQuery({
        queryKey: ['categories'],
        queryFn: () => fetchAPI('categories', 'en'),
    });

    const _category = useMemo(() => {
        return categoryData?.docs?.find(c => c.url === categoryParam) || null;
    }, [categoryData, categoryParam]);

    const shuffledVenues = useMemo(() => {
        return _category?.venues?.venues
            ? shuffleArray([..._category.venues.venues])
            : [];
    }, [_category]);

    const visibleVenues = useMemo(() => {
        return shuffledVenues.filter(
            v => v._status === "published" && v.club === location
        );
    }, [shuffledVenues, location]);

    if (isLoading) return <Loading />;
    if (error) return <div>Error: {error.message}</div>;
    if (!_category) return <div>Category not found</div>;

    return (
        <>
            <Header landing interact location={location} setLocation={() => {}} />
            <ScrollToTop />
            {isMobile && <Banner content={_category.name} />}

            <section className="home__container">
                <div>
                    {/* Mobile view */}
                    {isMobile && (
                        <section>
                            {visibleVenues.map((v, index) => {
                                const heroUrl = getHeroUrl(v.media, 'mobileFriendly');
                                if (!heroUrl) return null;

                                const status = venueStatus(v);

                                return (
                                    <Link
                                        href={`/venue/${v.url}`}
                                        key={v.id || v.url}
                                        className="category-list__box"
                                        style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
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
                                        </div>
                                        <h2 style={{ textAlign: "center" }}>{v.venueName}</h2>
                                    </Link>
                                );
                            })}
                        </section>
                    )}

                    {/* Desktop view */}
                    {!isMobile && (
                        <section className="desktop">
                            <section className="venue-list__container-main">
                                <h2 className="header">{location}</h2>
                                <section>
                                    <div className="cat_description" style={{height: "200px"}}>
                                        {_category.description && (
                                            <div>
                                                <h2>{_category.description}</h2>
                                            </div>
                                        )}
                                    </div>

                                    {visibleVenues.map((v, index) => {
                                        const heroUrl = getHeroUrl(v.media, 'tablet');
                                        if (!heroUrl) return null;

                                        const isHighlighted = highlightedVenue?.url === v.url;
                                        const borderStyle = {
                                            border: isHighlighted ? '2px solid var(--color-secondary)' : '',
                                            backgroundColor: isHighlighted ? 'var(--color-main)' : '',
                                            color: isHighlighted ? 'var(--color-secondary)' : '',
                                            transition: 'all 0.5s ease',
                                        };

                                        return (
                                            <div key={v.id || v.url} className="venue">
                                                {v.new && (
                                                    <div className="new">
                                                        <p>NEW</p>
                                                    </div>
                                                )}
                                                <Link
                                                    href={`/venue/${v.url}`}
                                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                                >
                                                    <div
                                                        className="venue__image"
                                                        onMouseEnter={() => setHighlightedVenue(v)}
                                                        onMouseLeave={() => setHighlightedVenue(null)}
                                                        style={{ height: "200px", position: 'relative', overflow: 'hidden' }}
                                                    >
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
                                                        <h2 style={borderStyle}>{v.venueName}</h2>
                                                    </div>
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </section>
                            </section>

                            <section
                                className="venue-list__container-others"
                                style={{ marginTop: "20px" }}
                            >
                                <MapSmall
                                    venues={visibleVenues}
                                    highlight={highlightedVenue}
                                    onHover={setHighlightedVenue}
                                />
                            </section>
                        </section>
                    )}
                </div>
            </section>
        </>
    );
};

export default CategoryClient;

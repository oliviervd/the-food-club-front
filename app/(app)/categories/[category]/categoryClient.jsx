'use client'

import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';

import Header from "../../../../components/Header.jsx";
import Banner from "../../../../components/Banner.jsx";
import Loading from "../../Loading.jsx";

import { fetchAPI, shuffleArray, venueStatus } from "../../../../utils/utils.jsx";
import { LocationColorContext } from "../../../../contexts/LocationColorContext.jsx";
import ScrollToTop from "../../../../components/scrollToTop.jsx"
import Image from "next/image";

const MapSmall = dynamic(() =>
        import("../../../../components/mapSmall.jsx"), // no .then needed
    { ssr: false }
);

const CategoryClient = () => {
    const { locationColor } = useContext(LocationColorContext);
    const { location } = locationColor;

    const router = useRouter();
    const { category: categoryParam } = useParams();

    const [highlightedVenue, setHighlightedVenue] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    // Media query (always run on client)
    useEffect(() => {
        const checkWidth = () => setIsMobile(window.innerWidth < 600);
        checkWidth();
        window.addEventListener("resize", checkWidth);
        return () => window.removeEventListener("resize", checkWidth);
    }, []);

    const { data: categories, isLoading, error } = useQuery({
        queryKey: ['categories', categoryParam],
        queryFn: () => fetchAPI('categories', 'en')
    });

    const _category = useMemo(() => {
        return categories?.docs.find((category) => category.url === categoryParam) || null;
    }, [categories, categoryParam]);

    const { data: categoryList } = useQuery({
        queryKey: ["lists"],
        queryFn: () => fetchAPI("lists", "en")
    });

    if (_category) {
       // console.log(_category.categoryDescription)
    }

    const shuffledVenues = useMemo(() => {
        return _category?.venues ? shuffleArray([..._category.venues.venues]) : [];
    }, [_category]);

    //console.log(shuffledVenues)

    const navigateTo = debounce((route) => {
        router.push(`/venue/${route}`);
    }, 200);

    if (isLoading) return <Loading />;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <>
            <Header landing interact location={location} setLocation={() => {}} />
            <ScrollToTop/>
            {isMobile && _category && <Banner content={_category.name} />}

            <section className="home__container">
                {_category && (
                    <div>
                        {/* Mobile view */}
                        {isMobile && (
                            <section>
                                {shuffledVenues.map((venue, index) => {
                                    const v = venue;
                                    //console.log(v)
                                    if (v._status === "published" && v.club === location) {
                                        return (
                                            <div key={index} className="category-list__box" onClick={() => navigateTo(v.url)}>
                                                <div>
                                                    {v.new &&
                                                        <div className="image__club-tag">NEW</div>
                                                    }
                                                    <Image
                                                        src={v.media.hero.sizes.tablet.url||v.media.hero.url}
                                                        alt={`hero image for ${v.venueName}`}
                                                        fill
                                                        style={{
                                                            objectFit: 'cover',
                                                            border: "2px solid var(--color-main)",
                                                            boxSizing: 'border-box'
                                                        }}
                                                        sizes="100vw"
                                                        priority={false}
                                                    />
                                                    {venueStatus(v) && <div className="venue-open">{venueStatus(v)}</div>}
                                                </div>
                                                <h2 style={{ textAlign: "center" }}>{v.venueName}</h2>
                                            </div>
                                        );
                                    }
                                })}
                            </section>
                        )}

                        {/* Desktop view */}
                        {!isMobile && (
                            <section className="desktop">
                                <section className="venue-list__container-main">
                                    <h2 className="header">{location}</h2>
                                    <section>
                                        <div className="cat_description">
                                            {_category.description && (
                                                <div>
                                                    <h2>
                                                        {_category.description}
                                                    </h2>
                                                </div>
                                            )}
                                        </div>

                                        {shuffledVenues.map((venue, index) => {
                                            //console.log(venue)
                                            const v = venue;
                                            if (v.club === location && v._status === "published") {
                                                return (
                                                    <div key={index} className="venue">
                                                        {v.new &&
                                                            <div className={"new"}>
                                                                <p>NEW</p>
                                                            </div>
                                                        }
                                                        <div
                                                            className="venue__image"
                                                            onMouseEnter={() => setHighlightedVenue(v)}
                                                            onMouseLeave={() => setHighlightedVenue(null)}
                                                            onClick={() => navigateTo(v.url)}
                                                            style={{height: "200px"}}
                                                        >
                                                            <Image
                                                                src={v.media.hero.sizes.tablet.url||v.media.hero.url}
                                                                alt={`hero image for ${v.venueName}`}
                                                                fill
                                                                style={{
                                                                    objectFit: 'cover',
                                                                    border: "2px solid var(--color-main)",
                                                                    boxSizing: 'border-box'
                                                                }}
                                                                sizes="100vw"
                                                                priority={false}
                                                            />                                                            <h2>{v.venueName}</h2>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}
                                    </section>
                                </section>

                                <section className="venue-list__container-others" style={{marginTop: "20px"}}>
                                    <MapSmall venues={shuffledVenues} highlight={highlightedVenue} onHover={setHighlightedVenue}/>
                                </section>
                            </section>
                        )}
                    </div>
                )}
            </section>
        </>
    );
};

export default CategoryClient;
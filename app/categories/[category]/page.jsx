'use client'

import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';

import Header from "../../../components/Header.jsx";
import DitherImage from "../../../components/DitherImage.jsx";
import Banner from "../../../components/Banner.jsx";
import serialize from "../../../utils/serialize.jsx";
import Loading from "../../Loading.jsx";

import { fetchAPI, shuffleArray, venueStatus } from "../../../utils/utils.jsx";
import { LocationColorContext } from "../../../utils/LocationColorContext.jsx";

const MapSmall = dynamic(() => import("/components/mapSmall.jsx"), {
    ssr: false,
});

const Page = () => {
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

    const { data: categories, isLoading, error } = useQuery(['categories', categoryParam], () => fetchAPI('categories', 'en'));

    const _category = useMemo(() => {
        return categories?.docs.find((category) => category.url === categoryParam) || null;
    }, [categories, categoryParam]);

    const { data: categoryList } = useQuery(["lists"], () => fetchAPI("lists", "en"));

    const shuffledVenues = useMemo(() => {
        return _category?.venues ? shuffleArray([..._category.venues.venues]) : [];
    }, [_category]);

    const navigateTo = debounce((route) => {
        router.push(`/venue/${route}`);
    }, 200);

    if (isLoading) return <Loading />;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <>
            <Header landing interact location={location} setLocation={() => {}} />
            {isMobile && _category && <Banner content={_category.categoryTitle} />}

            <section className="home__container">
                {_category && (
                    <div>
                        {/* Mobile view */}
                        {isMobile && (
                            <section>
                                {shuffledVenues.map((venue, index) => {
                                    const v = venue.venue;
                                    if (v._status === "published" && v.status === "yes" && v.club === location) {
                                        return (
                                            <div key={index} className="category-list__box" onClick={() => navigateTo(v.url)}>
                                                <div>
                                                    <div className="image__club-tag">{v.club}</div>
                                                    <DitherImage url={v.media.hero.sizes.tablet.url} link={`/venue/${v.url}`} />
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
                                        <div className="venue">
                                            <div className="description">
                                                {_category.categoryDescription && (
                                                    <h2>{serialize(_category.categoryDescription)}</h2>
                                                )}
                                            </div>
                                        </div>

                                        {shuffledVenues.map((venue, index) => {
                                            const v = venue.venue;
                                            if (v.club === location) {
                                                return (
                                                    <div key={index} className="venue">
                                                        <div
                                                            className="venue__image"
                                                            onMouseEnter={() => setHighlightedVenue(v)}
                                                            onMouseLeave={() => setHighlightedVenue(null)}
                                                            onClick={() => navigateTo(v.url)}
                                                        >
                                                            <DitherImage url={v.media.hero.sizes.tablet.url} link={`/venue/${v.url}`} />
                                                            <h2>{v.venueName}</h2>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}
                                    </section>
                                </section>

                                <section className="venue-list__container-others" style={{marginTop: "20px"}}>
                                    <MapSmall venues={shuffledVenues} highlight={highlightedVenue} />
                                </section>
                            </section>
                        )}
                    </div>
                )}
            </section>
        </>
    );
};

export default Page;
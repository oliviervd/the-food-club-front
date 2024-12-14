import Header from "../elements/Header.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAPI, shuffleArray, venueStatus } from "../utils/utils.jsx";
import { useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import DitherImage from "../elements/DitherImage.jsx";
import { useMediaQuery } from "@uidotdev/usehooks";
import serialize from "../utils/serialize.jsx";
import Banner from "../elements/Banner.jsx";
import { LocationColorContext } from "../utils/LocationColorContext.jsx";
import MapSmall from "../elements/mapSmall.jsx";
import { debounce } from "lodash";

const Venues = () => {
    const { locationColor } = useContext(LocationColorContext);
    const { location } = locationColor;

    const nav = useNavigate();
    const isSmall = useMediaQuery("(max-width: 600px)"); // Mobile detection
    const { category: categoryParam } = useParams(); // Get category parameter from route

    // Fetch categories using React Query
    const { data: categories, isLoading, error } = useQuery(['categories', categoryParam], () => fetchAPI('categories', 'en'));

    // Derive current category (memoized logic)
    const _category = useMemo(() => {
        return categories?.docs.find((category) => category.url === categoryParam) || null;
    }, [categories, categoryParam]);

    // Fetch lists of venues using React Query
    const { data: categoryList } = useQuery(["lists"], () => fetchAPI("lists", "en"));

    // Memoized shuffled venues from `_category.venues`
    const shuffledVenues = useMemo(() => {
        return _category?.venues ? shuffleArray([..._category.venues.venues]) : [];
    }, [_category]);

    // Debounced navigation logic
    const navigateTo = debounce((route) => {
        nav(`/venue/${route}`);
    }, 200);

    if (isLoading) return <div></div>; // Maintain empty loading state as assumed in original code
    if (error) return <div>Error: {error.message}</div>; // Maintain error state as in original code

    return (
        <>
            <Header landing={true} interact={true} location={location} setLocation={() => {}} />
            {isSmall && _category && <Banner content={_category.categoryTitle}></Banner>}

            <section className={"home__container"}>
                {_category && (
                    <div>
                        {/* Small screen venue rendering */}
                        {isSmall && (
                            <section>
                                {shuffledVenues &&
                                    shuffledVenues.map((venue, index) => {
                                        const v = venue.venue;

                                        // Check status and location relevance
                                        if (v._status === "published" && v.status === "yes" && v.club === location) {
                                            return (
                                                <div
                                                    key={index}
                                                    className={"category-list__box"}
                                                    onClick={() => navigateTo(v.url)}
                                                >
                                                    <div>
                                                        <div className={"image__club-tag"}>{v.club}</div>
                                                        <DitherImage
                                                            url={v.media.hero.sizes.tablet.url}
                                                            link={`/venue/${v.url}`}
                                                        />
                                                        {/* Venue open today logic */}
                                                        {venueStatus(v) && (
                                                            <div className={"venue-open"}>{venueStatus(v)}</div>
                                                        )}
                                                    </div>
                                                    <h2 style={{ textAlign: "center" }}>{v.venueName}</h2>
                                                </div>
                                            );
                                        }
                                    })}
                            </section>
                        )}

                        {/* Desktop layout */}
                        {!isSmall && (
                            <section className={"desktop"}>
                                <section className={"venue-list__container-main"}>
                                    <h2 className={"header"}>{location}</h2>
                                    <section>
                                        <div className={"venue"}>
                                            <div className={"description"}>
                                                {_category.categoryDescription && (
                                                    <h2>{serialize(_category.categoryDescription)}</h2>
                                                )}
                                            </div>
                                        </div>

                                        {/* Desktop: render relevant venues */}
                                        {shuffledVenues &&
                                            shuffledVenues.map((venue, index) => {
                                                const v = venue.venue;

                                                // Desktop-specific rendering with open today logic
                                                if (v.club === location) {
                                                    return (
                                                        <div key={index} className={"venue"}>
                                                            <div className={"venue__image"}>
                                                                <DitherImage
                                                                    url={v.media.hero.sizes.tablet.url}
                                                                    link={`/venue/${v.url}`}
                                                                />
                                                                <h2>{v.venueName}</h2>
                                                                {/* Venue open today logic */}

                                                            </div>
                                                        </div>
                                                    );
                                                }

                                                return null;
                                            })}
                                    </section>
                                </section>

                                <section className={"venue-list__container-others"}>
                                    <MapSmall venues={shuffledVenues} />
                                </section>
                            </section>
                        )}
                    </div>
                )}
            </section>
        </>
    );
};

export default Venues;
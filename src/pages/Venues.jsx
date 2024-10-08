import Header from "../elements/Header.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {fetchAPI, shuffleArray, venueStatus} from "../utils/utils.jsx";
import {useContext, useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import DitherImage from "../elements/DitherImage.jsx";
import {useMediaQuery} from "@uidotdev/usehooks";
import serialize from "../utils/serialize.jsx";
import Banner from "../elements/Banner.jsx";
import {LocationColorContext} from "../utils/LocationColorContext.jsx";

// todo: add hover effect
// todo: highlight locations (clubs) that are relevant and grey out others.
// todo: make locations selectable to filter.
// todo: add locales

const Venues = () => {

    const { locationColor, handleLocationChange } = useContext(LocationColorContext);
    let { location } = locationColor

    const nav = useNavigate();
    const isSmall = useMediaQuery("(max-width: 600px)");

    const [_category, _setCategory] = useState(null);
    const [categoryList, setCategoryList] = useState([]);
    const [club, setClub] = useState(null);

    const { category: categoryParam } = useParams();
    const { data: categories, isLoading, error } = useQuery(['categories', categoryParam], () => fetchAPI('categories', 'en'));

    useEffect(()=>{
        const getCategory = async () => {
            const categories = await fetchAPI("categories", "en");
            if (categories) {
                const result = categories.docs.find(category => category.url === categoryParam)
                _setCategory(result)
            }
        }
        getCategory();
    },[categoryParam])

    const {data: list} = useQuery(["lists"], ()=> fetchAPI('lists','en'))
    useEffect(() => {
        if(list) {
            setCategoryList(list);
        }
    }, [list]);

    if (isLoading) return <div></div>;
    if (error) return <div>Error: {error.message}</div>;

    //navigate to selected venue
    function navigateTo(route) {
        nav(`/venue/${route}`)
    }

    const shuffledVenues = _category && _category.venues ? shuffleArray([..._category.venues.venues]) : [];

    return(
        <>
            <Header landing={true} interact={true} location={club} setLocation={setClub}/>
            {!isSmall && _category &&
                <Banner content={_category.categoryTitle}></Banner>
            }
            <section className={"home__container"}>
                {_category &&
                    <div>
                        <section className={"category-meta"}>
                            {isSmall &&
                                <div>
                                    <h2 className={""}>{_category.categoryTitle}</h2>
                                </div>
                            }
                        </section>
                        {isSmall &&
                            <section>
                                {shuffledVenues &&
                                    shuffledVenues.map((venue, index) => {
                                        let v = venue.venue

                                        // check if status is published (_status) and if part of the club (status)
                                        if (v._status == "published" && v.status == "yes" && v.club == location) {
                                            console.log(v)
                                            return (
                                                <div key={index} className={"category-list__box"} onClick={() => {
                                                    navigateTo(v.url)
                                                }}>
                                                    <div>
                                                        <div className={"image__club-tag"}>{v.club}</div>
                                                        <DitherImage url={v.media.hero.sizes.tablet.url}
                                                                     link={`/venue/${v.url}`}/>
                                                        {venueStatus(v) != null &&
                                                            <div className={"venue-open"}>
                                                                {venueStatus(v)}
                                                            </div>
                                                        }
                                                    </div>
                                                    <h2 style={{textAlign: "center"}}>{v.venueName}</h2>
                                                </div>
                                            )
                                        }

                                    })
                                }
                            </section>
                        }
                        {!isSmall &&
                            <section className={"desktop"}>
                                <section className={"venue-list__container-main"}>
                                    <h2 className={"header"}>{location}</h2>
                                    <section>
                                        {shuffledVenues &&
                                            shuffledVenues.map((venue, index) => {
                                                let v = venue.venue
                                                console.log(v)
                                                if (v.club === location)
                                                    return(
                                                        <div className={"venue"}>
                                                            <div className={"venue__image"}>
                                                                <DitherImage url={v.media.hero.sizes.tablet.url}
                                                                             link={`/venue/${v.url}`}/>
                                                                <h2>{v.venueName}</h2>
                                                            </div>
                                                        </div>
                                                    )
                                            })
                                        }
                                    </section>
                                </section>
                                <section className={"venue-list__container-others"}>
                                    <h2 className={"header"}>other clubs</h2>
                                    <section className={"venues-container"}>
                                        {shuffledVenues &&
                                            shuffledVenues.map((venue, index) => {
                                                let v = venue.venue
                                                console.log(v)
                                                if (v.club !== location)
                                                    return (
                                                        <div className={"venue"}>
                                                            <div className={"venue__image"}>
                                                                <DitherImage url={v.media.hero.sizes.tablet.url}
                                                                             link={`/venue/${v.url}`}/>
                                                                <h2>{v.venueName}</h2>
                                                                <div className={"image__club-tag"}>{v.club}</div>

                                                            </div>
                                                        </div>
                                                    )
                                            })
                                        }
                                    </section>
                                </section>

                            </section>
                        }
                    </div>
                }
            </section>
        </>
    )
}
export default Venues;
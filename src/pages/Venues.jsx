import Header from "../elements/Header.jsx";
import {useNavigate, useParams} from "react-router-dom";
import AutoResizeText from "../elements/AutoResizeText.jsx";
import {fetchAPI, shuffleArray} from "../utils/utils.jsx";
import {useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import DitherImage from "../elements/DitherImage.jsx";
import {useMediaQuery} from "@uidotdev/usehooks";
import CategoryList from "../elements/CategoryList";

// todo: add hover effect
// todo: highlight locations (clubs) that are relevant and grey out others.
// todo: make locations selectable to filter.
// todo: add locales

const Venues = () => {

    const nav = useNavigate()
    const isSmall = useMediaQuery("(max-width: 600px)");
    const isBig = useMediaQuery("(min-width: 1400px)");

    const [_category, _setCategory] = useState(null);
    const [categoryList, setCategoryList] = useState([]);

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
            <Header landing={true}/>
            <section className={"home__container"}>
                {_category &&
                    <div>
                        <section className={"category-meta"}>
                            <div>
                                <h2 className={""}>{_category.categoryTitle}</h2>
                            </div>
                            <div style={{width: '100%', height: 'auto', marginBlock: "20px", marginTop: "0px"}}>
                                <p className={"subtitle"}>{_category.categorySubTitles}</p>
                            </div>
                        </section>
                        {isSmall &&
                            <section>
                                {shuffledVenues &&
                                    shuffledVenues.map((venue, index) => {
                                        let v = venue.venue
                                        // check if status is published (_status) and if part of the club (status)
                                        if (v._status == "published" && v.status == "yes") {
                                            return (
                                                <div key={index} className={"category-list__box"} onClick={() => {
                                                    navigateTo(v.url)
                                                }}>
                                                    <div>
                                                        <div className={"image__club-tag"}>{v.club}</div>
                                                        <DitherImage url={v.media.hero.sizes.tablet.url}
                                                                     link={`/venue/${v.url}`}/>
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
                            <section>
                                {shuffledVenues &&
                                    shuffledVenues.map((venue, index) => {
                                        let v = venue.venue
                                        // ceheck if status is published (_status) and if part of the club.
                                        return (
                                            <div className={"venue-list__container"}>
                                                <DitherImage url={v.media.hero.sizes.tablet.url}
                                                             link={`/venue/${v.url}`}/>
                                                <div>
                                                    <div style={{width: "90%"}}>
                                                        <AutoResizeText text={v.venueName}
                                                                        padding={"0px 0px 20px 0px"}/>
                                                    </div>
                                                    <div className={"cuisines"}>
                                                        <a className={"link"}><h2 style={{color: "#F0CA4F", backgroundColor:"black"}}>{v.club}</h2></a>
                                                        {v.cuisineUsed.map((cuisine) => {
                                                            return (
                                                                <a style={{color: "black", textDecoration: "none"}}><h2
                                                                    className={"link"}
                                                                    onClick={() => nav(`/venues/?cuisine=${cuisine.name}`)}>{cuisine.name}</h2>
                                                                </a>
                                                            )
                                                        })}

                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </section>
                        }
                    </div>
                }
                {categoryList && isBig &&
                    <div style={{marginLeft: "20px"}}>
                    <section style={{padding: "10px"}}>
                                    <h2 className={"subtitle text-main"}> FOOD CLUB loves lists. That's why we created some
                                        specially for
                                        you.
                                        From healthy snacks to absurdly comforting food, the order is yours.</h2>
                                </section>
                                <CategoryList data={categoryList}/>
                            </div>
                        }
                    </section>
                    </>
                    )
                }
export default Venues;
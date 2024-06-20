import Header from "../elements/Header.jsx";
import {useNavigate, useParams} from "react-router-dom";
import AutoResizeText from "../elements/AutoResizeText.jsx";
import {fetchAPI} from "../utils/utils.jsx";
import {useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import DitherImage from "../elements/DitherImage.jsx";

//todo: add hover effect
// todo: add locales

const Venues = () => {

    const nav = useNavigate()

    const [_category, _setCategory] = useState(null);
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

    if (isLoading) return <div></div>;
    if (error) return <div>Error: {error.message}</div>;

    //navigate to selected venue
    function navigateTo(route) {
        nav(`/venue/${route}`)
    }

    return(
        <>
            <Header/>
            <div className={"divider"}></div>

            {_category &&
                <div>
                    <section style={{padding: "10px"}}>
                        <div style={{width: '50%', height: 'auto'}}>
                            <AutoResizeText text={_category.categoryTitle} maxFontSize={600} minFontSize={10}/>
                        </div>
                        <div style={{width: '100%', height: 'auto'}}>
                            <h2 className={"subtitle"}>{_category.categorySubTitles}</h2>
                        </div>
                    </section>
                    <section style={{padding: "10px"}}>
                        {_category.venues &&
                            _category.venues.venues.map((venue, index) => {
                                let v = venue.venue
                                // check if status is published (_status) and if part of the club (status)
                                if (v._status == "published" && v.status == "yes") {
                                    return (
                                        <div key={index} className={"category-list__box"} onClick={()=>{navigateTo(v.url)}}>
                                            <DitherImage url={v.media.hero.sizes.tablet.url}/>
                                            <h2 style={{textAlign: "center"}}>{v.venueName}</h2>
                                        </div>
                                    )
                                }

                            })
                        }
                    </section>
                </div>

            }

        </>
    )
}
export default Venues;
import Header from "../elements/Header.jsx";
import {useParams} from "react-router-dom";
import AutoResizeText from "../elements/AutoResizeText.jsx";
import {fetchAPI} from "../utils/utils.jsx";
import {useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import DitherImage from "../elements/DitherImage.jsx";

//todo: add hover effect

const Venues = () => {
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

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

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
                                console.log(venue.venue)
                                return (
                                    <div key={index} className={"category-list__box"}>
                                        <DitherImage url={venue.venue.media.hero.sizes.tablet.url}/>
                                        <h2 style={{textAlign: "center"}}>{venue.venue.venueName}</h2>
                                    </div>
                                )
                            })
                        }
                    </section>
                </div>

            }

        </>
    )
}
export default Venues;
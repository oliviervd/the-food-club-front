import Header from "../../components/Header.jsx";
import {useEffect, useState} from "react";
import {fetchAPI} from "../../utils/utils.jsx";
import DitherImage from "../../components/DitherImage.jsx";
import Serialize from "../../utils/serialize.jsx";
import ScrollToTop from "../../components/scrollToTop.jsx";

const Categories = ({}) => {

    const [categoryList, setCategoryList] = useState([]);

    useEffect(() => {
        const getLists = async() => {
            const cat = await fetchAPI("lists", "en");
            console.log(cat)
            setCategoryList(cat.docs[0].items)
        }
        getLists();
    }, []);


    return (
        <div>
            <Header landing={true}/>
            <ScrollToTop/>
            <section>
                {categoryList.map(category => {
                    if (category.item.value.media.hero.sizes.tablet.url) {
                        return(
                            <section className={"container__categories"}>
                                <div className={"category-list__box"}>
                                    <DitherImage url={category.item.value.media.hero.sizes.mobileFriendly.url}/>
                                    <div className={"counter"}>
                                        <p>
                                            {category.item.value.venues.venues.length}
                                        </p>
                                    </div>
                                </div>

                                <div className={"category-list__explainer"}>
                                    <h2>{category.item.value.categoryTitle}</h2>
                                    {category.item.value.categoryDescription &&
                                        <div>
                                            <p>{Serialize(category.item.value.categoryDescription)}</p>
                                        </div>

                                    }
                                </div>
                            </section>
                        )
                    }
                })}
            </section>
        </div>
    )
}
export default Categories;
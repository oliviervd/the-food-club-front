import Header from "../elements/Header.jsx";
import {useEffect, useState} from "react";
import {fetchAPI} from "../utils/utils.jsx";
import DitherImage from "../elements/DitherImage.jsx";

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
            <section>
                {categoryList.map(category => {
                    console.log(category);
                    return(
                        <section className={"container__categories"}>
                            <DitherImage url={category.item.value.media.hero.sizes.tablet.url}/>
                            <div>
                                <h1>{category.item.value.categoryTitle}</h1>
                            </div>
                        </section>
                    )
                })}
            </section>
        </div>
    )
}
export default Categories;
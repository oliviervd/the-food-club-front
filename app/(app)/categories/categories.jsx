import Header from "../../../components/Header.jsx";
import React, {useEffect, useState} from "react";
import {fetchAPI} from "/../utils/utils.jsx";
import Serialize from "/../utils/serialize.jsx";
import ScrollToTop from "../../../components/scrollToTop.jsx";
import Image from "next/image";


const Categories = ({}) => {
    const [categoryList, setCategoryList] = useState([]);

    useEffect(() => {
        const getCategories = async() => {
            const cat = await fetchAPI("categories", "en");
            console.log(cat)
            setCategoryList(cat.docs[0].items)
        }
        getCategories();
    }, []);

    return (
        <div>
            <Header landing={true}/>
            <ScrollToTop/>
            <section>
                <section className={"container__categories"}>

                {categoryList.map(category => {
                    if (category.item.value.media.hero.sizes.tablet.url) {
                        return(
                            <div>
                                <div className={"category-list__box"}>
                                    <Image
                                        src={category.item.value.media.hero.url}
                                        alt={`hero image for ${category.item.value.name}`}
                                        fill
                                        style={{
                                            objectFit: 'cover',
                                            border: "2px solid var(--color-main)",
                                            boxSizing: 'border-box'
                                        }}
                                        sizes="100vw"
                                        priority={false}
                                    />
                                    <div className={"counter"}>
                                        <p>
                                            {category.item.value.venues.venues.length}
                                        </p>
                                    </div>
                                </div>

                                <div className={"category-list__explainer"}>
                                    <h2>{category.item.value.name}</h2>
                                    {category.item.value.description &&
                                        <div>
                                            <p>{Serialize(category.item.value.description)}</p>
                                        </div>

                                    }
                                </div>
                            </div>

                        )
                    }
                })}
                </section>
            </section>
        </div>
    )
}
export default Categories;
'use client'

import Header from "../../../components/Header.jsx";
import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {fetchAPI} from "../../../utils/utils.jsx";

const Page = ({}) => {

    // fetch data from about
    const { data: about, isLoading, error } = useQuery({
        queryKey: ['pages'],
        queryFn: () => fetchAPI('page', 'en', {["slug"]:"about"})
    });


    // define react components for blocks
    const HeroImage = ({Block}) => {
        return (
            <section className={"hero-image"}>
                <img src={block.image.sizes.tablet.url} alt={block.title} />
            </section>
        )
    }

    // text

    // foodclubRule

    return(
        <div>
            <Header landing={true}/>
            {about &&
                <div className={"about"}>
                    {about.docs[0].content.map((block, index) => {
                        return(
                            <h2>{block.blockType}</h2>
                        )
                    })}
                </div>
            }
        </div>
    )
}
export default Page;
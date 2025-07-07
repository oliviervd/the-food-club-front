'use client'

import Header from "../../../components/Header.jsx";
import {useQuery} from "@tanstack/react-query";
import {fetchAPI} from "../../../utils/utils.jsx";
import "styles/pages.css"
import serialize from "../../../utils/serialize.jsx"
import {useEffect, useState} from "react";

const Page = ({}) => {

    const [isDesktop, setIsDesktop] = useState(false)

    useEffect(() => {
        const checkWidth = () => setIsDesktop(window.innerWidth > 1200)
        checkWidth()
        window.addEventListener("resize", checkWidth)
        return () => window.removeEventListener("resize", checkWidth)
    }, [])

    // fetch data from about
    const { data: about, isLoading, error } = useQuery({
        queryKey: ['about'],
        queryFn: () => fetchAPI('page', 'en', {'where[slug][equals]': 'about'})
    });

    //
    console.log(about);

    // define react components for blocks
    const HeroImage = ({block}) => {
        return (
            <section className={"hero-image"}>
                <img src={block.image.sizes.original.url} alt={block.title} />
                <p className={"caption"}>{block.caption}</p>
            </section>
        )
    }

    const FoodClubRule = ({block}) => {
        return (
            <section className={"food-club-rule"}>
                <h1>{block.ruleNumber}</h1>
                <p>{serialize(block.rule)}</p>
            </section>
        )
    }

    //
    const TextBlock = ({block}) => {
        return(
            <section  className={"text-block"}>
                {serialize(block.text)}
            </section>
        )
    }

    return(
        <div>
            <Header landing={true}/>
            {about && !isDesktop &&
                <div className={"about--mobile"}>
                    {about.docs[0].content.map((block, index) => {
                        switch(block.blockType) {
                            case "heroImage": return <HeroImage block={block} key={index}/>
                            case "textBlock": return <TextBlock block={block} key={index}/>
                            case "foodClubRule": return <FoodClubRule block={block} key={index}/>
                        }
                    })}
                </div>
            }
            {about && isDesktop &&
                <div className={"about--desktop"}>
                    <div className={"rules-container"}>
                        {about.docs[0].content.map((block, index) => {
                            switch(block.blockType) {
                                case "foodClubRule": return <FoodClubRule block={block} key={index}/>
                            }
                        })}
                    </div>
                    <div className={"right-column"}>
                        {about.docs[0].content.map((block, index) => {
                            switch(block.blockType) {
                                case "heroImage": return <HeroImage block={block} key={index}/>
                                case "textBlock": return <TextBlock block={block} key={index}/>
                            }
                        })}
                    </div>
                </div>
            }
        </div>
    )
}
export default Page;
'use client'

import Header from "../../../components/Header.jsx";
import {useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {fetchAPI} from "../../../utils/utils.jsx";
import serialize from "../../../utils/serialize.jsx";

import "styles/coming-soon.css"

const Page = ({}) => {

    const [isDesktop, setIsDesktop] = useState(false)

    useEffect(() => {
        const checkWidth = () => setIsDesktop(window.innerWidth > 1200)
        checkWidth()
        window.addEventListener("resize", checkWidth)
        return () => window.removeEventListener("resize", checkWidth)
    }, [])

    // fetch data from about
    const { data: data, isLoading, error } = useQuery({
        queryKey: ['coming-soon'],
        queryFn: () => fetchAPI('page', 'en', {'where[slug][equals]': 'coming-soon'})
    });

    const HeroImage = ({block}) => {
        return (
            <section className={"hero-image"}>
                <img src={block.image.sizes.tablet.url} alt={block.title} />
                {block.caption &&
                    <p>{block.caption}</p>
                }
            </section>
        )
    }

    const TextBlock = ({block}) => {
        return (
            <section className={"text-container"}>
                {serialize(block.text)}
            </section>
        )
    }

    return (
        <div>
            <Header landing={true} />

            {data && data?.docs?.[0]?.content && (
                <div className={"coming-soon__container"} style={{}}>
                    <div>
                        {data.docs[0].content.map((block, index) => {
                            console.log(block)
                            switch(block.blockType) {
                                case "textBlock": return <TextBlock block={block} key={index}/>
                            }
                        })}
                    </div>
                    <div>
                        {data.docs[0].content.map((block, index) => {
                            console.log(block)
                            switch(block.blockType) {
                                case "heroImage": return <HeroImage block={block} key={index}/>
                            }
                        })}
                    </div>
                </div>

            )}
        </div>
    );
}

export default Page;
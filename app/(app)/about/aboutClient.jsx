'use client'

import Header from "../../../components/Header.jsx";
import Loading from "../loading.jsx";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "../../../utils/utils.jsx";
import "styles/pages.css"
import serialize from "../../../utils/serialize.jsx"
import { useEffect, useState } from "react";

const HeroImage = ({ block }) => {
    const url = block.image?.sizes?.original?.url || block.image?.url;
    if (!url) return null;
    return (
        <section className={"hero-image"}>
            <img src={url} alt={block.caption || ''} loading="lazy" />
            <p className={"caption"}>{block.caption}</p>
        </section>
    );
};

const FoodClubRule = ({ block }) => (
    <section className={"food-club-rule"}>
        <h1>{block.ruleNumber}</h1>
        <p>{serialize(block.rule)}</p>
    </section>
);

const TextBlock = ({ block }) => (
    <section className={"text-block"}>
        {serialize(block.text)}
    </section>
);

const renderBlock = (block, index) => {
    switch (block.blockType) {
        case "heroImage": return <HeroImage block={block} key={index} />;
        case "textBlock": return <TextBlock block={block} key={index} />;
        case "foodClubRule": return <FoodClubRule block={block} key={index} />;
        default: return null;
    }
};

const Page = () => {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkWidth = () => setIsDesktop(window.innerWidth > 1200);
        checkWidth();
        window.addEventListener("resize", checkWidth);
        return () => window.removeEventListener("resize", checkWidth);
    }, []);

    const { data: about, isLoading, error } = useQuery({
        queryKey: ['about'],
        queryFn: () => fetchAPI('page', 'en', { 'where[slug][equals]': 'about' })
    });

    if (isLoading) return <Loading />;
    if (error) return <div>Error: {error.message}</div>;

    const content = about?.docs?.[0]?.content || [];

    return (
        <div>
            <Header landing={true} />
            {about && !isDesktop && (
                <div className={"about--mobile"}>
                    {content.map((block, index) => renderBlock(block, index))}
                </div>
            )}
            {about && isDesktop && (
                <div className={"about--desktop"}>
                    <div className={"rules-container"}>
                        {content
                            .filter(b => b.blockType === "foodClubRule")
                            .map((block, index) => <FoodClubRule block={block} key={index} />)}
                    </div>
                    <div className={"right-column"}>
                        {content
                            .filter(b => b.blockType !== "foodClubRule")
                            .map((block, index) => renderBlock(block, index))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;
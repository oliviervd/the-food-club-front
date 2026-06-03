import Marquee from "react-fast-marquee";
import {fetchAPI} from "../../../../utils/utils.jsx";
import {useEffect, useState} from "react";
import Link from "next/link";
import BroadCastForYou from "../../../../components/BroadCastForYou.js";
import React from "react"
import Image from "next/image";
import { getBlur } from "../../../../utils/blur";

const DesktopHome = ({categories, recommendations}) => {
    console.log(recommendations)

    const shuffleArray = (array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    const [shuffledCategories, setShuffledCategories] = useState([]);

    useEffect(() => {
        // shuffle once on mount
        if (categories?.length) {
            setShuffledCategories(shuffleArray(categories));
        }
    }, [categories]);

    const [cuisines, setCuisines] = useState([]);

    useEffect(() => {
        const getCuisines = async() => {
            const _cuisines = await fetchAPI("cuisine", "en", { limit: 1000 })
            setCuisines(_cuisines.docs);
        }
        getCuisines()
    }, [categories])

    return(
        <section>
            <div style={{marginTop: "15px"}}>
                <Marquee className={"pill-banner"} direction={"right"} pauseOnHover={true}>
                    {cuisines && cuisines.map((cuisine, index)=>{
                        if (cuisine.active) {
                            return(
                                <h3><Link href={`/venues/${cuisine.name}`}>{cuisine.name}</Link></h3>
                            )
                        }
                    })}
                </Marquee>

                <Marquee className={"pill-banner"} direction={"left"} pauseOnHover={true}>
                    {cuisines && cuisines.map((cuisine, index)=>{
                        if (cuisine.active) {
                            return(
                                <h3><Link href={`/venues/${cuisine.name}`}>{cuisine.name}</Link></h3>
                            )
                        }
                    })}
                </Marquee>
            </div>

            <div className={"home-grid"}>


                {shuffledCategories && shuffledCategories.map((cat, index) => {
                    try {
                        const hero = cat?.media?.hero;
                        if (!hero) return null;
                        
                        const imageUrl = hero.sizes?.tablet?.url || hero.url;
                        const isPriority = index < 4;
                        
                        if (index === 5) {
                            return (
                                <React.Fragment key={index}>
                                    <div className={"category-list__box"}>
                                        <Link href={`/categories/${cat.url}`}>
                                            <div className="image-container">
                                                <img
                                                    src={imageUrl}
                                                    alt={`hero image for ${cat.name}`}
                                                    loading={isPriority ? "eager" : "lazy"}
                                                    fetchPriority={isPriority ? "high" : "auto"}
                                                    style={{objectFit: 'cover', width: '100%', height: '100%'}}
                                                />
                                            </div>
                                            <h2>{cat.name}</h2>
                                            <p>{cat.slug}</p>
                                        </Link>
                                    </div>

                                    <div className={"category-list__box special"}>

                                    </div>

                                </React.Fragment>
                            );
                        }

                        return(
                            <div key={index} className={"category-list__box"}>
                                <Link href={`/categories/${cat.url}`}>
                                    <div className="image-container">
                                        <img
                                            src={imageUrl}
                                            alt={`hero image for ${cat.name}`}
                                            loading={isPriority ? "eager" : "lazy"}
                                            fetchPriority={isPriority ? "high" : "auto"}
                                            style={{objectFit: 'cover', width: '100%', height: '100%'}}
                                        />
                                    </div>
                                    <h2>{cat.name}</h2>
                                    <p>{cat.slug}</p>
                                </Link>
                            </div>
                        )
                    } catch (e) {
                        console.log(e)
                    }
                })}

                <div className={"category-list__box special"}>

                    {/*
                    <Link href={"/events/"}>
                        <h2 style={{fontSize: "20px"}}>Smash that button for tasty food events.</h2>
                        <p>we believe good food deserves proper celebration.</p>
                    </Link>
                    */}

                </div>
            </div>
        </section>
    )
}
export default DesktopHome;
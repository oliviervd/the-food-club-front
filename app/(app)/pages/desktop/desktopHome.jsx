import DitherImage from "../../../../components/DitherImage.jsx";
import Marquee from "react-fast-marquee";
import {fetchAPI} from "../../../../utils/utils.jsx";
import {useEffect, useState} from "react";
import Link from "next/link";
import BroadCastForYou from "../../../../components/BroadCastForYou.js";
import React from "react"

const DesktopHome = ({categories, recommendations}) => {
    console.log(recommendations)
    const [cuisines, setCuisines] = useState([]);

    useEffect(() => {
        const getCuisines = async() => {
            const _cuisines = await fetchAPI("cuisine", "en", { limit: 100000 })
            setCuisines(_cuisines.docs);
        }
        getCuisines()
    }, [categories])


    return(
        <section>
            <div style={{marginTop: "15px"}}>
                <Marquee className={"pill-banner"} direction={"right"}>
                    {cuisines && cuisines.map((cuisine, index)=>{
                        if (cuisine.active) {
                            return(
                                <h3><Link href={`/venues/?cuisine=${cuisine.name}`}>{cuisine.name}</Link></h3>
                            )
                        }
                    })}
                </Marquee>

                <Marquee className={"pill-banner"} direction={"left"}>
                    {cuisines && cuisines.map((cuisine, index)=>{
                        if (cuisine.active) {
                            return(
                                <h3><Link href={`/venues/?cuisine=${cuisine.name}`}>{cuisine.name}</Link></h3>
                            )
                        }
                    })}
                </Marquee>
            </div>

            <div className={"home-grid"}>
                <div className={"category-list__box special"}>
                    <Link href={"/events/"}>
                        <h2 style={{fontSize: "20px"}}>We believe good food deserves proper celebration.</h2>
                        <p>smash that button for tasty food events.</p>
                    </Link>
                </div>
                {categories && categories.map((cat, index) => {
                    try {
                        if (index === 5) {
                            return (
                                <React.Fragment key={index}>
                                    <div className={"category-list__box"}>
                                        <Link href={`/categories/${cat.url}`}>
                                            <DitherImage url={cat.media.hero.sizes.tablet.url} dim={true}/>
                                            <h2>{cat.name}</h2>
                                            <p>{cat.slug}</p>
                                        </Link>
                                    </div>
                                    <div className={"category-list__box special"}>
                                        <BroadCastForYou type={'advice'}/>
                                    </div>
                                </React.Fragment>
                            );
                        }

                        return(
                            <div key={index} className={"category-list__box"}>
                                <Link href={`/categories/${cat.url}`}>
                                    <DitherImage url={cat.media.hero.sizes.tablet.url} dim={true}/>
                                    <h2>{cat.name}</h2>
                                    <p>{cat.slug}</p>
                                </Link>
                            </div>
                        )
                    } catch (e) {
                        console.log(e)
                    }
                })}
            </div>
        </section>
    )
}
export default DesktopHome;
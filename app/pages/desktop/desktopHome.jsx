import DitherImage from "../../../components/DitherImage.jsx";
import Marquee from "react-fast-marquee";
import {fetchAPI} from "../../../utils/utils.jsx";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import BroadCastForYou from "../../../components/BroadCastForYou.js";
import React from "react"

const DesktopHome = ({categories}) => {

    const [cuisines, setCuisines] = useState([]);


    useEffect(() => {
        const getCuisines = async() => {
            const _cuisines = await fetchAPI("cuisine", "en")
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
                    <BroadCastForYou type={'time'}/>
                </div>
                {categories && categories.map((cat, index) => {
                    const _cat = cat.item.value;

                    if (index === 5) {
                        return (
                            <React.Fragment key={index}>
                                <div className={"category-list__box"}>
                                    <Link href={`/categories/${_cat.url}`}>
                                        <DitherImage url={_cat.media.hero.sizes.tablet.url} dim={true}/>
                                        <h2>{_cat.categoryTitle}</h2>
                                        <p>{_cat.categorySubTitles}</p>
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
                            <Link href={`/categories/${_cat.url}`}>
                                <DitherImage url={_cat.media.hero.sizes.tablet.url} dim={true}/>
                                <h2>{_cat.categoryTitle}</h2>
                                <p>{_cat.categorySubTitles}</p>
                            </Link>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
export default DesktopHome;
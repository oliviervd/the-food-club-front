import DitherImage from "../../elements/DitherImage.jsx";
import Marquee from "react-fast-marquee";
import {fetchAPI} from "../../utils/utils.jsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const DesktopHome = ({categories}) => {

    const [cuisines, setCuisines] = useState([]);

    const nav = useNavigate()
    function navigateTo(route){
        nav(`/categories/${route}`)
    }

    useEffect(() => {
        const getCuisines = async() => {
            const _cuisines = await fetchAPI("cuisine", "en")
            setCuisines(_cuisines.docs);
        }
        getCuisines()
    }, [categories])

    return(
        <section>
            <Marquee className={"banner"} speed={30} pauseOnHover={false} gradient={false} autoFill={true}>
                <h3>#1 Don't talk about foodclub - but psssst…. please spread the word! — #2 The foodclub is a curated space focused on quality, featuring only restaurants we've personally visited. — #3 The foodclub is, and will always be, a positive space celebrating local culinary excellence. There is no place for negativity. —</h3>
            </Marquee>

            <Marquee className={"pill-banner"} direction={"right"}>
                {cuisines && cuisines.map((cuisine, index)=>{
                    if (cuisine.active) {
                        return(
                            <h3 onClick={() => nav(`/venues/?cuisine=${cuisine.name}`)}>{cuisine.name}</h3>
                        )
                    }
                })}
            </Marquee>

            <Marquee className={"pill-banner"} direction={"left"}>
                {cuisines && cuisines.map((cuisine, index)=>{
                    if (cuisine.active) {
                        return(
                            <h3 onClick={() => nav(`/venues/?cuisine=${cuisine.name}`)}>{cuisine.name}</h3>
                        )
                    }
                })}
            </Marquee>


            <div className={"home-grid"}>
                {categories && categories.map((cat, index) => {
                    const _cat = cat.item.value;
                    return(
                        <div key={index} className={"category-list__box"} onClick={() => {
                            navigateTo(_cat.url)
                        }}>
                            <DitherImage url={_cat.media.hero.sizes.tablet.url}/>
                            <h2>{_cat.categoryTitle}</h2>
                            <p>{_cat.categorySubTitles}</p>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
export default DesktopHome;
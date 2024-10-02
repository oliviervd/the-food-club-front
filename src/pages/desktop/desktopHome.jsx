import DitherImage from "../../elements/DitherImage.jsx";
import Marquee from "react-fast-marquee";

const DesktopHome = ({categories}) => {

    return(
        <section>
            <Marquee className={"banner"} speed={30} pauseOnHover={false} gradient={false} autoFill={true}>
                <h3>#1 Don't talk about foodclub - but psssst…. please spread the word! — #2 The foodclub is a curated space focused on quality, featuring only restaurants we've personally visited. — #3 The foodclub is, and will always be, a positive space celebrating local culinary excellence. There is no place for negativity. —</h3>
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
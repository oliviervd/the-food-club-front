import DitherImage from "../../elements/DitherImage.jsx";

const DesktopHome = ({categories}) => {

    return(
        <section>
            <div className={"home-grid"}>
                {categories && categories.map((cat, index) => {
                    const _cat = cat.item.value;
                    return(
                        <div key={index} className={"category-list__box"} onClick={()=>{navigateTo(_cat.url)}}>
                            <DitherImage url={_cat.media.hero.sizes.tablet.url}/>
                            <h2>{_cat.categoryTitle}</h2>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
export default DesktopHome;
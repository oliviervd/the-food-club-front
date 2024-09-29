import DitherImage from "./DitherImage.jsx";
import {useNavigate} from "react-router-dom";
// todo: add hover effect on desktop (show text explaining the category)

const CategoryList = ({data}) => {
    const nav = useNavigate()
    function navigateTo(route){
        nav(`/categories/${route}`)
    }

    if (data.docs){
        const categories = data.docs[0].items
        return(
            <section className="category-list__container">
                {categories.map((cat, index)=>{
                    const _cat = cat.item.value;
                    if (_cat.media.hero) {
                        return(
                            <div key={index} className={"category-list__box"} onClick={()=>{navigateTo(_cat.url)}}>
                                <DitherImage url={_cat.media.hero.sizes.tablet.url}/>
                                <h2>{_cat.categoryTitle}</h2>
                                <p>{_cat.categorySubTitles}</p>
                            </div>
                        )
                    }}
                )}
            </section>
        )
    }
}
export default CategoryList
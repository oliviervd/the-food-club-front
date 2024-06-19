import DitherImage from "./DitherImage.jsx";
import {useNavigate} from "react-router-dom";
// category list
const CategoryList = ({data}) => {

    const nav = useNavigate()

    function navigateTo(route){
        nav(`/categories/${route}`)
    }

    if (data.docs){
        const categories = data.docs[0].items
        console.log(categories)
        return(
            <section className="category-list__container">
                {categories.map((cat, index)=>{
                    const _cat = cat.item.value;
                    if (_cat.media.hero) {
                        return(
                            <div key={index} className={"category-list__box"} onClick={()=>{navigateTo(_cat.url)}}>
                                <DitherImage url={_cat.media.hero.sizes.tablet.url}/>
                                <h2>{_cat.categoryTitle}</h2>
                            </div>
                        )
                    }}
                )}
            </section>
        )
    }



}
export default CategoryList
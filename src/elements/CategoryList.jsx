import DitherImage from "./DitherImage.jsx";

const CategoryList = ({data}) => {

    const categories = data.docs

    return(
        <section className="category-list__container">
            {categories.map((cat)=>{
                if (cat.hero) {
                    console.log(cat.hero.url)
                    return(
                        <div>
                            <DitherImage url={cat.hero.url}/>
                            <h2>{cat.categoryTitle}</h2>
                        </div>
                    )
                }}
            )}
        </section>
    )
}
export default CategoryList
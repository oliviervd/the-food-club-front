import Header from "../elements/Header.jsx";
import "../style/header.css"
import "../style/fonts.css"
import CategoryList from "../elements/CategoryList.jsx";
import {fetchAPI} from "../utils/utils.jsx";

const Home = () => {

    const cat = fetchAPI("categories", "en")

    return(
        <div>
            <Header></Header>
            <section className={"home__container"}>
                {cat &&
                    <CategoryList data={cat}/>
                }
            </section>
        </div>
    )
}
export default Home;
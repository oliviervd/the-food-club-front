import Header from "../elements/Header.jsx";
import "../style/header.css"
import "../style/fonts.css"
import CategoryList from "../elements/CategoryList.jsx";
import {fetchAPI, scrollTo} from "../utils/utils.jsx";
import {useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";

//todo : improve loading speed
// todo: add locales

const Home = () => {

    // fetch data
    const [categoryList, setCategoryList] = useState([]);
    const [target, setTarget] = useState(null);
    const [location, setLocation] = useState(null);

    console.log(target)

    const {data: list, isLoading, error} = useQuery(["lists"], ()=> fetchAPI('lists','en'))
    useEffect(() => {
        if(list) {
            setCategoryList(list);
        }
    }, [list]);

    useEffect(()=>{
        scrollTo(target)
    },[target])

    if (isLoading) return <div></div>;
    if (error) return <div>Error: {error.message}</div>;

    // render component
    return(
        <div>
            <Header landing={true} interact={true} setLocation={setLocation} location={location} setTarget={setTarget}></Header>
            <div id={"cat_list"} className={"divider"}></div>
            <section style={{padding: "10px"}}>
                <h2 className={"subtitle"}> FOOD CLUB loves lists. That's why we created some specially for you. From healthy snacks to absurdly comforting food, the order is yours.</h2>
            </section>
            <section className={"home__container"}>
                {categoryList &&
                    <CategoryList data={categoryList}/>
                }
            </section>
        </div>
    )
}
export default Home;
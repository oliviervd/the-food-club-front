import Header from "../elements/Header.jsx";
import "../style/header.css"
import "../style/fonts.css"
import CategoryList from "../elements/CategoryList.jsx";
import {fetchAPI} from "../utils/utils.jsx";
import {useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";

const Home = () => {

    // fetch data
    const [categoryList, setCategoryList] = useState([]);
    const {data: list, isLoading, error} = useQuery(["lists"], ()=> fetchAPI('lists','en'))
    useEffect(() => {
        if(list) {
            setCategoryList(list);
        }
    }, [list]);
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    // render component
    return(
        <div>
            <Header></Header>
            <section className={"home__container"}>
                {categoryList &&
                    <CategoryList data={categoryList}/>
                }
            </section>
        </div>
    )
}
export default Home;
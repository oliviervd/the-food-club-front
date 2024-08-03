import Header from "../elements/Header.jsx";
import {useEffect, useState} from "react";
import {fetchAPI} from "../utils/utils.jsx";
import serialize from "../utils/serialize.jsx";

const About = ({}) => {

    const [about, setAbout] = useState([]);

    useEffect(() => {
        const getAbout = async() => {
            const about = await fetchAPI("globals", "en");
            setAbout(about.docs[0].texts)
        }
        getAbout();
    }, []);

    console.log(about[0])

    return(
        <div>
            <Header landing={true}/>
            {about[0] &&
                <div className={"about"}>
                    {serialize(about[0].text)}
                </div>
            }
        </div>
    )
}
export default About;
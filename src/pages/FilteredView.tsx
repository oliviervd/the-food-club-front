import * as React from "react";
import Header from "../elements/header"
import {fetchAPI, FadeInComponent} from "../utils/utils.jsx"
import {useNavigate} from "react-router-dom";

const FilteredView = (props) => {
    const isOpen = []
    const nav = useNavigate()
    // fetch all venues that are open today
    const date = new Date();
    const day = date.getDay();

    let dates = {
        "1": "Mo",
        "2": "Tu",
        "3": "We",
        "4": "Thu",
        "5": "Fr",
        "6": "Sat",
        "0": "Sun"
    }

    try {
        let _l = fetchAPI("venue") //unfiltered list
        for (let venue of _l["docs"]) {
            if(venue["openOn"][1]){
                // if dates are undefined, make sure to skip.
                if(venue["openOn"].includes(dates[day])) {
                    isOpen.push(venue) // add venue to array isOpen
                }

                // check if open TODAY

                // todo: check if open NOW (add data structure to CMS)

            }

        }

        console.log(_l)
    } catch (e) {console.log(e)}

    console.log(isOpen)


    return (
        <div>
           <Header/>
            <div className={"filter--container"}>
                <p className={"open"}>🎉 {isOpen.length} restaurants we like are open today 🎉</p>
                {isOpen.map((venue)=>{
                    return(
                        <FadeInComponent>
                            <div className={"filter--results_venue"}>
                                <div style={{position: "relative"}}>
                                    <div className={"filter--result_image-container"} onClick={() => nav(`/venue/${venue.venueName}`)}>
                                        <img src={venue.media.url}/>
                                    </div>
                                </div>
                                <div>
                                    <h2 onClick={() => nav(`/venue/${venue.venueName}`)}>{venue.venueName}</h2>
                                    <p>{venue.cuisineUsed[0]["name"]}</p>
                                </div>
                            </div>
                        </FadeInComponent>
                    )
                })}
            </div>
        </div>
    );
}

export default FilteredView;
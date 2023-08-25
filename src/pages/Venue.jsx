import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import Header from "../elements/header.jsx";
import GridUI from "../elements/images/Grid_Dense.png";
import {fetchAPI} from "../utils/utils.jsx";

const Venue = () => {

    // fetch content based on id
    let id = useParams(); // use id to set content

    // initiate cache
    let _venue
    let _im
    let _review

    try{
        let _venueList = fetchAPI('venue')
        for (let i = 0; i < _venueList["docs"].length; i ++) {
            //console.log(_venueList["docs"][i])
            if (_venueList["docs"][i]["venueName"] === id.id) {
                _venue = _venueList["docs"][i]
                console.log(_venue)
                console.log(typeof _venue["type"])
            }
        }
    } catch (e) {}



    // function to check type
    function isObject(input){
        if(typeof input === "object" && input[1]) {
            return true
        } else { return false }
    }

    // onLoad scroll to top.
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return(
        <div className={"container BG_pink"}>
            <Header slug={"Eat like locals"} title={"Food Club"}></Header>

            <br/>
            <img className={"UI-GRID"} src={GridUI}/>


            {_venue &&
                <div className={"venue--container"}>
                    <div>
                        <h2 className={"venue--header_title"}>
                            {id.id.toUpperCase()}
                        </h2>
                        <div className={"venue--header_subtitle"}>
                            <h3 className={"venue--header_category"}>{_venue["cuisineUsed"][0]["name"]} // {_venue["category"]["categoryTitle"]} </h3>
                            <h3 className={"venue--header_cuisine"}> </h3>
                        </div>
                    </div>

                    {_venue["slugs"]["slugEN"][0]["children"][0]["text"] &&
                        <div className={"venue--container_content-slug"}>
                            <p>{_venue["slugs"]["slugEN"][0]["children"][0]["text"]}</p>
                        </div>
                    }

                    <div>
                        {/* check if multiple types to define UI */}
                        {!isObject(_venue["type"]) &&
                            <p className={"pillbox"}>{_venue["type"]}</p>
                        }
                        {isObject(_venue["type"]) &&
                            <div className={"pillbox--container"}>
                                <p className={"pillbox"}>{_venue["type"][0]}</p>
                                <p className={"pillbox"}>{_venue["type"][1]}</p>
                            </div>
                        }

                    </div>

                    <div className={"venue--container_content"}>

                        {_venue["media"]&&
                            <div className={"venue--container_content-media"}>
                                <img className={"venue--container_content-media-image"} src={_venue["media"]["url"]}/>
                            </div>
                        }

                        <br/>

                        {_venue["reviews"]["reviewEN"] &&
                            <div>
                                {_venue["reviews"]["reviewEN"].map(review => (
                                    <p className={"venue--container_content-review"}>{review["children"][0]["text"]}</p>
                                    )

                                    )}
                            </div>
                        }

                        <p className={"venue--container_content-address"}>Open from Tuesday to Sunday</p>
                        <p className={"venue--container_content-address"}>{_venue["address"]["street"]} {_venue["address"]["houseNumber"]}, {_venue["address"]["postalCode"]} {_venue["address"]["city"]}</p>
                        <div className={"venue--lightbox"}>
                        </div>
                    </div>

                </div>
            }
        </div>
    )
}
export default Venue
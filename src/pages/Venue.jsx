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
        <div className={"BG_pink main--container"}>
            <Header slug={"Eat like locals"} title={"Food Club"}></Header>
            <div className={"main--content"}>
                <img className={"UI-GRID"} src={GridUI}/>
            </div>

            {_venue &&
                <div className={"venue--container"}>
                    {/* CONTENT HEADER (title and classification) */}
                    <div>
                        <h2 className={"venue--header_title"}>
                            {id.id.toUpperCase()}
                        </h2>
                        {/*
                        <div className={"venue--header_subtitle"}>
                            <h3> // {_venue["category"][0]["categoryTitle"]} </h3>
                        </div>
                        */}
                    </div>

                    {/* PILLBOX CUISINE */}
                    <div style={{marginTop: "-5px", marginBottom: "20px"}}>
                        {/* check if multiple types to define UI */}
                        {isObject(_venue["cuisineUsed"]) &&
                            <div className={"pillbox--container"}>
                                {_venue["cuisineUsed"].map(cuisine => (
                                    <p className={"pillbox background--white"}>{cuisine["name"]}</p>
                                ))}
                            </div>
                        }
                        {!isObject(_venue["cuisineUsed"]) &&
                            <p className={"pillbox background--white"}>{_venue["cuisineUsed"][0]["name"]}</p>

                        }
                    </div>

                    {/* CONTENT SLUG */}
                    <div>
                        {_venue["slugs"]["slugEN"][0]["children"][0]["text"] &&
                            <div className={"venue--container_content-slug"}>
                                <p >{_venue["slugs"]["slugEN"][0]["children"][0]["text"]}</p>
                            </div>
                        }
                    </div>

                    {/* MEDIA */}
                    <div>

                        {_venue["media"]&&
                            <div className={"venue--container_content-media"}>
                                <img className={"venue--container_content-media-image"} src={_venue["media"]["url"]}/>
                            </div>
                        }
                    </div>

                    {/* PILLBOX (type) */}
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


                    {/* LIGHTBOX CONTENT FROM HERE */}
                    <div className={"lightBox"}>
                        {/* REVIEW */}
                        <div className={"lightBox__correction"}>
                            <div style={{paddingTop: "20px"}}>
                                {_venue["reviews"]["reviewEN"] &&
                                    <div>
                                        {_venue["reviews"]["reviewEN"].map(review => (
                                                <p className={"venue--container_content-review"}>{review["children"][0]["text"]}</p>
                                            )


                                        )}
                                    </div>
                                }
                            </div>


                            {/* ADDRESS + OPENINGSHOURS */}
                            <div>
                                <p className={"venue--container_content-address"}>
                                    {_venue["openOn"]&&
                                        <div className={"venue--container_content-openDays"}> open on:
                                            {_venue["openOn"].map(day=>(
                                                <p className={"venue--container_content-openDays-day"}>{day.toUpperCase()}</p>
                                            ))}
                                        </div>
                                    }
                                </p>
                                <p className={"venue--container_content-address"}>{_venue["address"]["street"]} {_venue["address"]["houseNumber"]}, {_venue["address"]["postalCode"]} {_venue["address"]["city"]}</p>
                            </div>
                        </div>


                    </div>

                </div>
            }
        </div>
    )
}
export default Venue
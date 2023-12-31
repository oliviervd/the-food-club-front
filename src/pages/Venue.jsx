import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../elements/header.jsx";
import GridUI from "../elements/gridUI.jsx";
import { fetchAPI } from "../utils/utils.jsx";

import _backIcon from "../elements/SVG/Back_icon.svg";

const Venue = () => {
  // fetch content based on id
  let id = useParams(); // use id to set content

  // initiate cache
  let _venue;
  let _im;
  let _review;

  const nav = useNavigate();

  try {
    let _venueList = fetchAPI("venue");
    for (let i = 0; i < _venueList["docs"].length; i++) {
      //console.log(_venueList["docs"][i])
      if (_venueList["docs"][i]["venueName"] === id.id) {
        _venue = _venueList["docs"][i];
        console.log(_venue);
        console.log(typeof _venue["type"]);
      }
    }
  } catch (e) {}

  // function to check type
  function isObject(input) {
    if (typeof input === "object" && input[1]) {
      return true;
    } else {
      return false;
    }
  }

  // onLoad scroll to top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={"BG_pink main--container"} style={{ maxWidth: "100vw" }}>
      {/*GRID SVG*/}
      <GridUI />

      {_venue && (
        <div className={"venue--container"}>
          {/* CONTENT HEADER (title and classification) */}
          <div className={"content_header"}>
            <nav>
              <a onClick={() => nav("/categories")} className="nav--back">
                <img src={_backIcon} alt="icon to navigate back" />
              </a>
            </nav>
            <h2 className={"venue--header_title"}>{id.id.toUpperCase()}</h2>
          </div>

          {/* PILLBOX CUISINE -- PRICING -- VEG */}
          {/*
                        <div style={{marginTop: "-1.2em", marginBottom: "20px"}} >
                             check if multiple types to define UI
                            {isObject(_venue["cuisineUsed"]) &&
                                <div className={"pillbox--container"}>
                                    {_venue["vegetarian"] &&
                                        <p className={"pillbox pricing"}>🌱</p>
                                    }
                                    {_venue["vegan"] &&
                                        <p className={"pillbox pricing"}>🌾</p>
                                    }
                                    <p className={"pillbox pricing"}>{pricingLabel(_venue["pricing"])}</p>
                                    {_venue["cuisineUsed"].map(cuisine => (
                                        <p className={"pillbox"}>{cuisine["name"]}</p>
                                    ))}
                                </div>
                            }
                            {!isObject(_venue["cuisineUsed"]) &&
                                <div className={"pillbox--container"}>
                                    {_venue["vegetarian"] &&
                                        <p className={"pillbox veg"} >🌱</p>
                                    }
                                    {_venue["vegan"] &&
                                        <p className={"pillbox pricing"}>🌾</p>
                                    }
                                    <p className={"pillbox pricing"}>{pricingLabel(_venue["pricing"])}</p>
                                    <p className={"pillbox"}>{_venue["cuisineUsed"][0]["name"]}</p>
                                </div>
                            }
                        </div>
                        */}

          {/* CONTENT SLUG */}
          <div>
            {_venue["slugs"]["slugEN"][0]["children"][0]["text"] && (
              <div className={"venue--container_content-slug"}>
                <blockquote>
                  {_venue["slugs"]["slugEN"][0]["children"][0]["text"]}
                </blockquote>
              </div>
            )}
          </div>

          {/* MEDIA */}
          <div>
            {_venue["media"] && (
              <div className={"venue--container_content-media"}>
                {/*<img className={"venue--container_content-media-frame"} src={_frame} />*/}

                {_venue["media"]["sizes"]["tablet"]["url"] && (
                  <div className="venue--image_container">
                    <img
                      className={"venue--container_content-media-image"}
                      src={_venue["media"]["sizes"]["tablet"]["url"]}
                    />
                  </div>
                )}

                <div className={"venue--container_content-links"}>
                  {_venue["website"] && (
                    // open website in new window
                    <p
                      onClick={() => window.open(_venue["website"])}
                      className={"pillbox-website"}
                    >
                      website
                    </p>
                  )}
                  {_venue["reservations"] && (
                    // open new window to book a table (Resengo/..)
                    <p
                      onClick={() => window.open(_venue["reservations"])}
                      className={"pillbox-phone"}
                    >
                      book a table
                    </p>
                  )}
                  {_venue["phone"] && (
                    // call number when mobile
                    <p
                      onClick={() => window.open(`tel:${_venue["phone"]}`)}
                      className={"pillbox--directions"}
                    >
                      phone
                    </p>
                  )}
                </div>

                {/* BUTTONS NAV*/}
                {/*<div className={"headerB--button_main"}>
                                    <div className={"headerB--button_container"}>
                                        <img onClick={()=>nav("/")} className={"headerB--button"} src={_map}></img>
                                    </div>
                                    <div className={"headerB--button_container"}>
                                        <img onClick={()=>nav("/categories")} className={"headerB--button"} src={_list}></img>
                                    </div>
                                </div>*/}
              </div>
            )}
          </div>

          {/* PILLBOX (type) */}
          <div>
            {/* check if multiple types to define UI */}
            {!isObject(_venue["type"]) && (
              <p className={"pillbox"}>{_venue["type"]}</p>
            )}
            {isObject(_venue["type"]) && (
              <div className={"pillbox--container"}>
                <p className={"pillbox"}>{_venue["type"][0]}</p>
                <p className={"pillbox"}>{_venue["type"][1]}</p>
              </div>
            )}
          </div>

          {/* LIGHTBOX CONTENT FROM HERE */}
          <div className={"lightBox"}>
            {/* REVIEW */}
            <div className={"lightBox__correction"}>
              <div style={{ paddingTop: "9vh" }}>
                {_venue["reviews"]["reviewEN"] && (
                  <div>
                    {_venue["reviews"]["reviewEN"].map((review) => (
                      <p className={"venue--container_content-review"}>
                        {review["children"][0]["text"]}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* FOOD CLUB TIP */}
              {_venue["clubOrder"] && (
                <div className={"venue--container_content-tip_container"}>
                  <p>{_venue["clubOrder"][0]["children"][0]["text"]}</p>
                </div>
              )}

              {/* ADDRESS + OPENINGSHOURS */}
              {_venue["openOn"] && (
                <div style={{ paddingTop: "10px" }}>
                  <p className={"venue--container_content-address"}>
                    <div className={"venue--container_content-openDays"}>
                      {" "}
                      open:
                      {_venue["openOn"].map((day) => (
                        <p className={"venue--container_content-openDays-day"}>
                          {day.toUpperCase()}
                        </p>
                      ))}
                    </div>
                  </p>

                  <p className={"venue--container_content-address"}>
                    {_venue["address"]["street"]}{" "}
                    {_venue["address"]["houseNumber"]},{" "}
                    {_venue["address"]["postalCode"]}{" "}
                    {_venue["address"]["city"]}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Venue;

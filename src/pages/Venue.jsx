import React, {useEffect, useRef} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import GridUI from "../elements/gridUI.jsx";
import { fetchAPI, FadeInComponent, isObject } from "../utils/utils.jsx";

import _backIcon from "../elements/SVG/Back_icon.svg";
import _buttonWebsite from "../elements/SVG/button-website.svg"
import _buttonBook from "../elements/SVG/button-book-a-table.svg"
import _buttonPhone from "../elements/SVG/button-phone.svg"

const Venue = () => {
  // onLoad scroll to top.
  const location = useLocation();
  const topRef = useRef(null)

  useEffect(() => {
    topRef.current?.scrollIntoView({behavior:"smooth"})
  }, [location]);

  // fetch content based on id
  let id = useParams(); // use id to set content
  console.log(id)
  // initiate cache
  let _venue;

  const nav = useNavigate();

  try {
    let _venueList = fetchAPI("venue", id.lang);
    console.log(_venueList)
    for (let i = 0; i < _venueList["docs"].length; i++) {
      if (_venueList["docs"][i]["venueName"] === id.id) {
        _venue = _venueList["docs"][i];
        console.log(_venue)
      }
    }
  } catch (e) {}

  // onLoad scroll to top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={"BG_pink main--container"} style={{ maxWidth: "100vw" }} ref={topRef}>
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

          {/* CONTENT SLUG */}
          <div>
            {_venue["slugs"]["slug"][0]["children"][0]["text"] && (
              <div className={"venue--container_content-slug"}>
                <blockquote>
                  {_venue["slugs"]["slug"][0]["children"][0]["text"]}
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
                    // open website in new window<>
                    <img
                        src={_buttonWebsite}
                        onClick={() => window.open(_venue["website"])}
                    />
                  )}
                  {_venue["reservations"] && (
                    // open new window to book a table (Resengo/..)
                    <img
                        src={_buttonBook} style={{height: "47px"}}
                        onClick={() => window.open(_venue["reservations"])}
                    />
                  )}
                  {_venue["phone"] && (
                    // call number when mobile
                    <img
                        src={_buttonPhone} style={{height: "41px"}}
                        onClick={() => window.open(`tel:${_venue["phone"]}`)}
                    />

                  )}
                </div>
              </div>
            )}
          </div>

          {/* PILLBOX (type) */}
          <div>
            {/* check if multiple types to define UI */}
            {!isObject(_venue["type"]) && (
                <div className={"pillbox--container"}>
                  <p className={"pillbox"}>{_venue["type"]}</p>
                  {_venue["cuisineUsed"].map((cuisine)=> {
                    return (
                        <p className={"pillbox_yellow"}>{cuisine.name}</p>
                    )
                  })}
                </div>
            )}
            {isObject(_venue["type"]) && (
              <div className={"pillbox--container"}>
                <p className={"pillbox"}>{_venue["type"][0]}</p>
                <p className={"pillbox"}>{_venue["type"][1]}</p>
                {_venue["cuisineUsed"].map((cuisine)=> {
                  return (
                      <p className={"pillbox_yellow"}>{cuisine.name}</p>
                  )

                })}
              </div>
            )}
          </div>

          {/* LIGHTBOX CONTENT FROM HERE */}
          <div className={"lightBox"}>
            {/* REVIEW */}
            <div className={"lightBox__correction"}>
              <div style={{ paddingTop: "9vh" }}>
                {_venue["reviews"]["review"] && (
                  <div>
                    {_venue["reviews"]["review"].map((review) => (
                      <p className={"venue--container_content-review"}>
                        {review["children"][0]["text"]}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* FOOD CLUB TIP */}
              {_venue["foodClubOrder"] && (
                  <div className={"venue--container_content-tipbox"}>
                    <p>{_venue["foodClubOrder"][0]["children"][0]["text"]}</p>
                  </div>
              )}

              {/* ADDRESS + OPENINGSHOURS */}
              {_venue["hours"] && (
                  <div style={{paddingTop: "20px"}}>
                    <p className={"venue--container_content-address"}>
                      <div className={"venue--container_content-openDays"}>
                        {" "}
                        open:
                        {_venue["hours"].map((day) => (
                            <p className={"venue--container_content-openDays-day"}>
                              {day.openDay.toUpperCase()}
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

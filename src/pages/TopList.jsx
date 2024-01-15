import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GridUI from "../elements/gridUI.jsx";
import {useLocation} from "react-router-dom";

import { fetchAPI, FadeInComponent } from "../utils/utils.jsx";
import _backIcon from "../elements/SVG/Back_icon.svg";

const TopList = () => {
  // onLoad scroll to top.
  const location = useLocation()
  const topRef = useRef(null)
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [location]);

  const [openNavMenu, setOpenNavMenu] = useState(false);

  let _categories;
  let _cats = [];

  const nav = useNavigate();

  if (openNavMenu) {
    document.body.style.overflow = "hidden";
    window.scrollTo({ top: 0 });
  }

  if (!openNavMenu) {
    document.body.style.overflowX = "hidden";
    document.body.style.overflowY = "scroll";
  }

  //fetch id from URL param
  let id = useParams();

  let _l;
  let _list;
  let _listFiltered = []; // create empty array for filtered venues

  try {
    _l = fetchAPI("venue");
    _list = _l["docs"];
    console.log(_list);
    //console.log(_list)
    // filter based on category
    for (let i = 0; i < _list.length; i++) {
      //console.log(_list[i])
      for (let x = 0; x < _list[i]["category"].length; x++) {
        console.log(_list[i]["category"]);
        if (_list[i]["category"][x]["categoryTitle"] === id.id) {
          // if same category push venue to new list.
          _listFiltered.push(_list[i]);
        }
      }
    }
    //console.log(_listFiltered)
  } catch (e) {}

  return (
    <div className={"main--container"} ref={topRef}>
      <GridUI />
      <div
        className={"categories--container"}
        style={{ maxWidth: "100vw", overflow: "hidden" }}
      >
        <div className={"content_header-toplist"}>
          <a onClick={() => nav("/")} className="nav--back">
            <img src={_backIcon} alt="icon to navigate back" />
          </a>
          <h2 className={"venue--header_title"}>{id.id.toUpperCase()}</h2>
        </div>

        {_listFiltered.map((venue, index) => {
          let _im;
          if (venue.media) {
            _im = venue["media"]["sizes"]["tablet"]["url"];
          } else {
            _im = "";
          }
          //console.log(_im)
          return (

              <FadeInComponent key={index}>
                <div className={"toplist--counter"}>
                  <div className={"toplist--image_container"}>
                    <div>
                      <div>
                        <div className={"toplist--image"}>
                          <img
                              onClick={() => nav(`/venue/${venue.venueName}`)}
                              className={"toplist--image_img"}
                              src={_im}
                          />
                          <h2
                              onClick={() => nav(`/venue/${venue.venueName}`)}
                              className={"toplist--venue_title"}
                          >
                            {venue.venueName}
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  <br/>
                </div>
              </FadeInComponent>
          );
        })}
        <br />
      </div>
    </div>
  );
};

export default TopList;

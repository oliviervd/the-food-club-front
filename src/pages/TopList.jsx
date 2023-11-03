import React, { useEffect, useState } from "react";
import Header from "../elements/header.jsx";
import NavBar from "../elements/navbar.jsx";
import { useNavigate, useParams } from "react-router-dom";
import GridUI from "../elements/gridUI.jsx";

import { fetchAPI } from "../utils/utils.jsx";

const TopList = () => {
  // onLoad scroll to top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [openNavMenu, setOpenNavMenu] = useState(false);

  let _categories;
  let _cats = [];

  const nav = useNavigate();

  if (openNavMenu) {
    document.body.style.overflow = "hidden";
    window.scrollTo({ top: 0 });
  }

  if (!openNavMenu) {
    document.body.style.overflow = "unset";
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
    <div className={"main--container"}>
      <Header></Header>
      <GridUI />
      <div
        className={"categories--container"}
        style={{ maxWidth: "100vw", overflow: "hidden" }}
      >
        <div>
          <h2 className={"toplist--title_font"}>{id.id.toUpperCase()}</h2>
          <br />
        </div>

        {_listFiltered.map((venue) => {
          let _im;
          if (venue.media) {
            _im = venue["media"]["sizes"]["tablet"]["url"];
          } else {
            _im = "";
          }
          //console.log(_im)
          return (
            <div>
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
              <br />
            </div>
          );
        })}
        <br />
      </div>
    </div>
  );
};

export default TopList;

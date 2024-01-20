import React, { useEffect, useState, useRef } from "react";
import GridUI from "../elements/gridUI.jsx";
import { fetchAPI, FadeInComponent } from "../utils/utils.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../elements/header.jsx";

import _upIcon from "../elements/SVG/button-scroll-to-top.svg"
import _mapIcon from "../elements/SVG/Map_icon.svg"
import Highlighted from "../elements/highlight.jsx";

const Categories = () => {
  // onLoad scroll to top.
    const location = useLocation();
    const topRef = useRef(null)

    useEffect(() => {
        topRef.current?.scrollIntoView({behavior:"smooth"})
    }, [location]);


  let _categories;
  let _venues;
  let _cats = [];

  const nav = useNavigate();
  const [showIntro, setShowIntro] = useState(true);

  function closeIntro(){
      scrollToTop()
      setShowIntro(false)
  }

  try {
    _categories = fetchAPI("categories");
    _venues = fetchAPI("venue")
    _cats = _categories["docs"];
  } catch (e) {
    console.log(e);
  }

  function suprise() {
      console.log(_venues)
      var _v = _venues["docs"]
      var randomItem = _v[Math.floor(Math.random()*_v.length)]
      nav(`/venue/${randomItem.venueName}`)
  }

  //todo: add this as an element that can be reused.
    const [showButton, setShowButton] = useState(true);

    function scrollToTop() {
      topRef.current?.scrollIntoView({behavior:"smooth"})
    }

  return (
    <div className={"main--container"} ref={topRef}>
      <GridUI />
        <Header/>
      <div
        className={
          showIntro ? "open-now_container closed" : "open-now_container"
        }
      >
          <div className={"buttons-main"}>
              <div onClick={()=>nav("/open-now")} className="button-open_today">
                  <p>open now</p>
              </div>
              <div onClick={()=>suprise()} className="button-open_today">
                  <p>suprise me</p>
              </div>
          </div>

      </div>

        <div
            className={
                showIntro
                    ? "categories--welcome_container"
                    : "categories--welcome_container closed"
            }
        >
            <h2>Welcome to the foodclub</h2>
            <p>a place where locals share their precious food discoveries.</p>
            <div onClick={() => closeIntro()} className={"button"}>
                <p>take me</p>
            </div>
        </div>

        <div className={"categories--container"}>
            <a onClick={() => nav("/map")} className="sticky--button_map">
                <img src={_mapIcon} />
            </a>
            {showButton &&
                <a onClick={() => scrollToTop()} className={"sticky--button_up"}>
                    <img src={_upIcon}/>
                </a>
            }
            {_cats.map((cat, index) => {
                return (
                    <FadeInComponent key={index}>
                        {cat["categoryTitle"] !== "UNCATEGORISED" && (
                <div>
                  <a>
                    <h2
                      className={"categories--title_font"}
                      onClick={() => nav(`/toplist/${cat["categoryTitle"]}`)}
                    >
                      <Highlighted
                        string={cat["categoryTitle"]}
                        sub={cat["highlight"]}
                      />
                    </h2>
                  </a>
                  <p>{cat["categorySubTitle"]}</p>
                </div>
              )}
            </FadeInComponent>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;

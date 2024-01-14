import React, { useEffect, useState } from "react";
import Highlighted from "../elements/highlight.jsx";
import GridUI from "../elements/gridUI.jsx";
import { fetchAPI } from "../utils/utils.jsx";
import { useNavigate } from "react-router-dom";
import Header from "../elements/header.jsx";
import _mapIcon from "../elements/SVG/Map_icon.svg";

const Categories = () => {
  // onLoad scroll to top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  let _categories;
  let _cats = [];

  const nav = useNavigate();
  const [showIntro, setShowIntro] = useState(true);

  function colorWordInString(string, substring) {
    // based on a given substring, replace the style using a span.
    const words = string.split("");
    const styledWords = words.map((w) => {
      //if the word matches
      if (w === substring) {
        return `<span className="highlight">${w}</span>`;
      }
      //else
      return w;
    });

    const hightlightedTitle = styledWords.join("");
    return hightlightedTitle;
  }
  try {
    _categories = fetchAPI("categories");
    _cats = _categories["docs"];
  } catch (e) {
    console.log(e);
  }

  return (
    <div className={"main--container"}>
      <GridUI />
      <Header />

      <div
        className={
          showIntro ? "open-now_container closed" : "open-now_container"
        }
      >
        <div className="button-mask">
          <p>open today</p>
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
            {/*<div onClick={() => setShowIntro(false)} className="button-mask">
          <p>let's go </p>
        </div>{" "}*/}
            <div onClick={() => setShowIntro(false)} className={"button"}>
                <p>take me</p>
            </div>
        </div>

        <div className={"categories--container"}>
            <a onClick={() => nav("/map")} className="sticky--button_map">
          <img src={_mapIcon} />
        </a>
        {_cats.map((cat) => {
          return (
            <div>
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;

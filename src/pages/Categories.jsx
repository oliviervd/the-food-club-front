import React, { useEffect } from "react";
import Highlighted from "../elements/highlight.jsx";
import GridUI from "../elements/gridUI.jsx";
import { fetchAPI } from "../utils/utils.jsx";
import { useNavigate } from "react-router-dom";
import Header from "../elements/header.jsx";

const Categories = () => {
  // onLoad scroll to top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  let _categories;
  let _cats = [];

  const nav = useNavigate();

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
      <div className={"categories--container"}>
        <a onClick={() => nav("/")} className="sticky--button_map"></a>
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

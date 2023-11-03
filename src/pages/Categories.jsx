import React, { useEffect } from "react";
import Header from "../elements/header.jsx";
import GridUI from "../elements/gridUI.jsx";
import { fetchAPI } from "../utils/utils.jsx";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  // onLoad scroll to top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  let _categories;
  let _cats = [];

  const nav = useNavigate();

  try {
    _categories = fetchAPI("categories");
    _cats = _categories["docs"];
  } catch (e) {
    console.log(e);
  }

  return (
    <div className={"main--container"}>
      <GridUI />
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
                      {cat["categoryTitle"].toUpperCase()}
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


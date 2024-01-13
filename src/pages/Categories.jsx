import React, { useEffect, useState } from "react";
import GridUI from "../elements/gridUI.jsx";
import { fetchAPI } from "../utils/utils.jsx";
import { useNavigate } from "react-router-dom";
import Header from "../elements/header.jsx";
import CategoryList from "../elements/categoryList.tsx";

const Categories = () => {
  // onLoad scroll to top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  let _categories;
  let _cats = [];

  const nav = useNavigate();
  const [showIntro, setShowIntro] = useState(true);

  try {
    _categories = fetchAPI("categories");
    _cats = _categories["docs"];
  } catch (e) {
    console.log(e);
  }

  return (
    <div className={"main--container"}>
      <GridUI />
        <Header></Header>
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
        <div onClick={() => setShowIntro(false)} className="button-mask">
          <p>let's go </p>
        </div>{" "}
      </div>
        <CategoryList categories={_cats} mapButton={true}/>
    </div>
  );
};

export default Categories;

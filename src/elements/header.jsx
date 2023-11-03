import React from "react";

import _logo from "./images/Untitled_Artwork.png";
import { useNavigate } from "react-router-dom";
import _map from "./images/map.png";
import _list from "./images/list.png";

const Header_A = (props) => {
  const nav = useNavigate();

  return (
    <header>
      <h1>
        <img src={_logo} alt="food club logo" />
      </h1>

      <nav>
        <div className="nav--button">
          <img onClick={() => nav("/")} src={_map}></img>
        </div>
        <div className="nav--button">
          <img onClick={() => nav("/categories")} src={_list}></img>
        </div>
      </nav>
    </header>
  );
};

export default Header_A;

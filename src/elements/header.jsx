import React from "react";

import _logo from "./SVG/Logo_blue.svg";
import _hamburger from "./SVG/Hamburger_menu.svg";
import _gent from "./SVG/City_ghent2.svg";
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
        <a>
          <img src={_hamburger} />
        </a>
      </nav>

      <nav className="gent">
        <a>
          <img src={_gent} />
        </a>
      </nav>
    </header>
  );
};

export default Header_A;

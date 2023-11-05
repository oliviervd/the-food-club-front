import React, { useState } from "react";

import _logo from "./SVG/Logo_blue.svg";
import _logoWhite from "./SVG/Logo_white.svg";
import _hamburger from "./SVG/Hamburger_menu.svg";
import _gent from "./SVG/City_ghent2.svg";
import { useNavigate } from "react-router-dom";
import _map from "./images/map.png";
import _list from "./images/list.png";
import _cross from "./SVG/Close_icon.svg";

const Header_A = (props) => {
  const nav = useNavigate();

  const [openMenu, setOpenMenu] = useState(false);

  return (
    <header>
      <h1>
        <img
          onClick={() => nav("/categories")}
          src={_logo}
          alt="food club logo"
        />
      </h1>

      <nav onClick={() => setOpenMenu(!openMenu)}>
        <a>
          <img onClick={() => setOpenMenu(!openMenu)} src={_hamburger} />
        </a>
      </nav>

      <nav className="gent">
        <a>
          <img src={_gent} />
        </a>
      </nav>

      {openMenu && (
        <div class="menu_container">
          <img
            className="closeIcon"
            src={_cross}
            onClick={() => setOpenMenu(false)}
            href=""
          />
          <nav>
            <a href="/">map</a>
            <a href="/categories">top list</a>
            <a href="">about</a>
            <div className="languageContainer">
              <p>NL</p>
            </div>
            <img className="logo" src={_logoWhite} />
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header_A;

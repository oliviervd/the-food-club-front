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
  const selected = props.location;

  return (
    <header>
      <h1>
        <img
          onClick={() => nav("/categories")}
          src={_logo}
          alt="food club logo"
        />
      </h1>

      <nav>
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
        <div
          class={
            openMenu ? "menu_container menu_container-open" : "menu_container"
          }
        >
          <a class="menu_container--close-icon">
            <img
              onClick={() => setOpenMenu(false)}
              src={_cross}
              alt="cross icon"
            />
          </a>
          <nav>
            <a className="button-mask" onClick={() => nav("/map")}>
              map
            </a>
            <a onClick={() => nav("/")}>top list</a>
            <a onClick={() => nav("/about")}>about</a>
          </nav>
          <h1>
            <img src={_logoWhite} alt="food club logo" />
          </h1>
        </div>
      )}
    </header>
  );
};

export default Header_A;

import React, { useState } from "react";

import _logo from "./SVG/Logo_blue.svg";
import _logoWhite from "./SVG/Logo_white.svg";
import _hamburger from "./SVG/Hamburger_menu.svg";
import _gent from "./SVG/City_ghent2.svg";
import { useNavigate } from "react-router-dom";
import _cross from "./SVG/cross.svg";
import {useMediaQuery} from "react-responsive";

const Header_A = (props) => {
  const nav = useNavigate();

  const [openMenu, setOpenMenu] = useState(false);
  const selected = props.location;

    let header, gent = {}
    let style = {
        display:"flex"
    }

    if (props.map) {
        // add styling for header used on the map page.
        style = {
            backgroundColor: "transparent",
            position: "fixed"
        }
        header = {
            position: "absolute",
            top: "20px",
            left: "20px"
        }
        gent={
            position: "absolute",
            top: "70px",
            left: "70px"
        }
    }

  return (
    <header style={style}>
      <h1 style={header}>
        <img
          onClick={() => nav("/categories")}
          src={_logo}
          alt="food club logo"
        />
      </h1>

        {!props.map &&
            <nav>
                <a>
                    <img onClick={()=> setOpenMenu(!openMenu)} src={_hamburger}></img>
                </a>
            </nav>
        }

        <nav className="gent" style={gent}>
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

import React from "react";
import { useNavigate } from "react-router-dom";
import _im from "/src/elements/images/Untitled_Artwork.png";

const Home = () => {
  const nav = useNavigate();

  return (
    <div className={"container home"} onClick={() => nav("/categories")}>
      <div className={"vertical-center"}>
        <img className={"home--logo"} src={_im} />
      </div>
      <div></div>
    </div>
  );
};

export default Home;

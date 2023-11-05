import { Icon } from "leaflet/dist/leaflet-src.esm.js";
import { Marker, TileLayer, MapContainer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import React, { useState } from "react";
import _im from "../elements/SVG/Location_indicator_1.svg";
import _logo from "../elements/SVG/Logo_blue.svg";
import _location from "../elements/images/my-location.png";
import _cross from "./SVG/Close_icon.svg";
import Header from "./header";
import { fetchAPI } from "../utils/utils.jsx";
import { useNavigate } from "react-router-dom";

const map = () => {
  const [openInfoPane, setOpenInfoPane] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [venue, setVenue] = useState("");
  const [activePillsCuisine, setActivePillsCuisine] = useState("");
  const [activePillsDay, setActivePillsDay] = useState([]);
  const [activePillsDish, setActivePillsDish] = useState([]);
  const [activePillsOcassion, setActivePillsOccasion] = useState([]);

  const nav = useNavigate();

  function handlePillClick(id, _type) {
    switch (_type) {
      //if cuisine
      case "cuisine":
        setActivePillsCuisine((prevActivePillsCuisine) => {
          if (prevActivePillsCuisine.includes(id)) {
            return prevActivePillsCuisine.filter((pillId) => pillId !== id);
          } else {
            return [...prevActivePillsCuisine, id];
          }
        });
        break;

      // if day
      case "day":
        setActivePillsDay((prevActivePillsDay) => {
          if (prevActivePillsDay.includes(id)) {
            return prevActivePillsDay.filter((pillId) => pillId !== id);
          } else {
            return [...prevActivePillsDay, id];
          }
        });
        break;

      // if dish
      case "dish":
        setActivePillsDish((prevActivePillsDish) => {
          if (prevActivePillsDish.includes(id)) {
            return prevActivePillsDish.filter((pillId) => pillId !== id);
          } else {
            return [...prevActivePillsDish, id];
          }
        });
        break;

      // if occasion
      case "occasion":
        setActivePillsOccasion((prevActivePillsOccasion) => {
          if (prevActivePillsOccasion.includes(id)) {
            return prevActivePillsOccasion.filter((pillId) => pillId !== id);
          } else {
            return [...prevActivePillsOccasion, id];
          }
        });
        break;
    }
  }

  function generateInfoPane(venue) {
    setOpenInfoPane(true);
    setVenue(venue);
  }

  function isObject(input) {
    if (typeof input === "object" && input.length !== 1) {
      return true;
    } else {
      return false;
    }
  }

  // open menu to filter selection
  function openSearchIndex() {
    setOpenFilter(!openFilter);
    setOpenInfoPane(false);
  }

  // fetch data

  let OPEN = ["MO", "TUE", "WED", "THU", "FR", "SAT", "SU"];
  let OCCASION = ["Breakfast", "Brunch", "Lunch", "Dinner", "Apero", "Drinks"];

  // venues
  let _venues;
  try {
    let _venueList = fetchAPI("venue");
    _venues = _venueList["docs"];
  } catch (e) {
    console.log(e);
  }

  // categories todo:
  let _categories;
  let _cuisines = [];
  let _dishes = [];

  try {
    let _categoryList = fetchAPI("cuisine");
    _categories = _categoryList["docs"];
    // iterate and push to right array
    for (let i = 0; i < _categories.length; i++) {
      if (_categories[i]["type"] === "cuisine") {
        _cuisines.push(_categories[i]);
      } else if (_categories[i]["type"] === "dish") {
        _dishes.push(_categories[i]);
      }
    }
  } catch (e) {
    console.log(e);
  }

  const CustomIcon = new Icon({
    iconUrl: _im,
    iconSize: [28, 38], // size
  });

  // change style of pill on click
  function changeState(pill) {}

  return (
    <div
      className={"container"}
      style={{ overflow: "hidden", maxWidth: "100vw" }}
    >
      <Header />

      {/*<img className={"UI-GRID"} src={GridUI} style={{height:"100vh", objectFit:"cover"}}/>*/}
      <MapContainer
        className={"map--ui"}
        center={[51.0544, 3.7256]}
        zoom={12.5}
        zoomControl={false}
      >
        <TileLayer
          //attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
          //url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          url="https://api.mapbox.com/styles/v1/oliviervd-tfc/clllwhqvq009s01pea2rw8mpt/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoib2xpdmllcnZkLXRmYyIsImEiOiJjbGxqZWFjd3MweTBzM2psaWFiemlnZnZnIn0.fMu0iJpz82mNYQ5Rrrwi-w"
        />

        <MarkerClusterGroup chunkedLoading maxClusterRadius="30">
          {_venues && (
            <div>
              {_venues.map((venue) => (
                <Marker
                  position={[venue.address.longitude, venue.address.latitude]}
                  icon={CustomIcon}
                  eventHandlers={{
                    click: (e) => {
                      generateInfoPane(venue);
                    },
                  }}
                ></Marker>
              ))}
            </div>
          )}
        </MarkerClusterGroup>
      </MapContainer>

      <div
        className={` ${
          openFilter
            ? "map--ui_container-search active"
            : "map--ui_container-search closed"
        }`}
      >
        {openFilter && (
          <div className={"map--ui_container-search_grid"}>
            <div className={"map--ui_pop-up-container-section"}>
              <p className={"map--ui_pop-up-container-search_prompt"}>
                open on:
              </p>
              {OPEN && (
                <div className={"map--ui_pop-up-container-search_pills"}>
                  {OPEN.map((day) => (
                    <p
                      key={day}
                      className={
                        activePillsDay.includes(day)
                          ? "map--ui_pop-up-container-search_pillbox selected"
                          : "map--ui_pop-up-container-search_pillbox"
                      }
                      onClick={() => handlePillClick(day, "day")}
                    >
                      {day}
                    </p>
                  ))}
                </div>
              )}
            </div>
            <div className={"map--ui_pop-up-container-section"}>
              <p className={"map--ui_pop-up-container-search_prompt"}>for:</p>
              <div className={"map--ui_pop-up-container-search_pills"}>
                {OCCASION.map((occ) => (
                  <p
                    key={occ}
                    className={
                      activePillsOcassion.includes(occ)
                        ? "map--ui_pop-up-container-search_pillbox selected"
                        : "map--ui_pop-up-container-search_pillbox"
                    }
                    onClick={() => handlePillClick(occ, "occasion")}
                  >
                    {occ}
                  </p>
                ))}
              </div>
            </div>

            <div className={"map--ui_pop-up-container-section"}>
              <p className={"map--ui_pop-up-container-search_prompt"}>
                cravings:
              </p>
              {_cuisines && (
                <div className={"map--ui_pop-up-container-search_pills"}>
                  {_cuisines.map((cat) => (
                    <p
                      key={cat.id}
                      className={
                        activePillsCuisine.includes(cat.id)
                          ? "map--ui_pop-up-container-search_pillbox selected"
                          : "map--ui_pop-up-container-search_pillbox"
                      }
                      onClick={() => handlePillClick(cat.id, "cuisine")}
                    >
                      {cat["name"]}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className={"map--ui_pop-up-container-section"}>
              <p className={"map--ui_pop-up-container-search_prompt"}>dish:</p>
              {_dishes && (
                <div className={"map--ui_pop-up-container-search_pills"}>
                  {_dishes.map((cat) => (
                    <p
                      key={cat.id}
                      className={
                        activePillsDish.includes(cat.id)
                          ? "map--ui_pop-up-container-search_pillbox selected"
                          : "map--ui_pop-up-container-search_pillbox"
                      }
                      onClick={() => handlePillClick(cat.id, "dish")}
                    >
                      {cat["name"]}
                    </p>
                  ))}
                </div>
              )}
            </div>
            {/* <div className={"map--ui_pop-up-container-section"}>
                            <p className={"map--ui_pop-up-container-search_prompt"}>diet</p>
                            <div className={"map--ui_pop-up-container-search_pills"}>
                                <p className={"map--ui_pop-up-container-search_pillbox"}>vegetarian</p>
                                <p className={"map--ui_pop-up-container-search_pillbox"}>vegan</p>
                            </div>
                        </div>*/}
          </div>
        )}
      </div>

      {openInfoPane && (
        <div className={"map--ui_pop-up-container"}>
          <div className="cross-ui">
            <img onClick={() => setOpenInfoPane(false)} src={_cross} />
          </div>
          <div className={"map--ui_pop-up-container--grid"}>
            <img
              onClick={() => nav(`/venue/${venue.venueName}`)}
              className={"map--ui_pop-up-container__img"}
              src={venue["media"]["sizes"]["tablet"]["url"]}
            />
            <p>
              {venue["address"]["street"]} {venue["address"]["houseNumber"]}{" "}
              {venue["address"]["postalCode"]} {venue["address"]["city"]}{" "}
            </p>
          </div>
          {/* WEB UI */}
          <div></div>
        </div>
      )}
    </div>
  );
};

export default map;

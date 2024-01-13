import * as React from "react";
import Highlighted from "../elements/highlight.jsx";
import _mapIcon from "../elements/SVG/Map_icon.svg";

const CategoryList = (props) => {
    const _cats = props.categories
    return (

        <div className={"categories--container"}>
            <a onClick={() => nav("/")} className="sticky--button_map">
                <img src={_mapIcon}/>
            </a>
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
    )
}
export default CategoryList
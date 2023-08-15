import React from "react";

const Header = (props) => {
    return(
        <div>
            <h1 className={"FC"}>{props.pageTitle}</h1>
        </div>
    )
}

export default Header
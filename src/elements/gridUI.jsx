import React from "react";

const GridUI = () => {
    return(
        <div className={"main--content"}>
            <svg className={"UI-GRID"} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                        <path d="M 8 0 L 0 0 0 8" fill="none" stroke="pink" stroke-width="1.5"/>
                    </pattern>
                    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                        <rect width="80" height="80" fill="url(#smallGrid)"/>
                        <path d="M 80 0 L 0 0 0 80" fill="none" stroke="pink" stroke-width="1"/>
                    </pattern>
                </defs>

                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            {/*
                <img className={"UI-GRID"} src={GridUI}/>
*/}
        </div>
    )
}

export default GridUI;
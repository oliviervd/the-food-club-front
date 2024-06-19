import AutoResizeText from "./AutoResizeText.jsx";
import {useNavigate} from "react-router-dom";

const Header = ({location, setLocation, interact}) => {
    // todo: add languages
    // todo: add map button
    // todo: make header logo "FOOD CLUB" (fold) when scrolling down.

    // navigate back to home
    const nav = useNavigate();

    return(
        <header>
            <div style={{width: '100%', height: 'auto'}} onClick={()=>{nav("/")}}>
                <AutoResizeText text="FOOD CLUB" maxFontSize={600} minFontSize={10}/>
            </div>
            <div style={{width: '100%', height: 'auto'}}>
                <AutoResizeText text="TAKING YOU OUT FOR SERIOUS GOOD FOOD IN .." maxFontSize={600} minFontSize={10}/>
            </div>

            <nav>
               <h2 className={`link ${location === "gent" ? "selected" : ""}`} onClick={interact ? ()=>{setLocation("gent")}: null}>GENT</h2>
               <h2 className={`link ${location === "antwerp" ? "selected" : ""}`} onClick={interact ? ()=>{setLocation("antwerp")}: null}>ANTWERP</h2>
               <h2 className={`link ${location === "brussels" ? "selected" : ""}`} onClick={interact ? ()=>{setLocation("brussels")}: null}>BRUSSELS</h2>
            </nav>
            
        </header>
    )
}
export default Header;
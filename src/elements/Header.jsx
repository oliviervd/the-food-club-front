import DitherImage from "./DitherImage.jsx";
import AutoResizeText from "./AutoResizeText.jsx";
import {useNavigate} from "react-router-dom";

const Header = () => {
    // todo: add languages
    // todo: add home button
    // todo: add map button

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
                <h2>GENT</h2>
                <h2>ANTWERP</h2>
                <h2>BRUSSELS</h2>
            </nav>
            
        </header>
    )
}
export default Header;
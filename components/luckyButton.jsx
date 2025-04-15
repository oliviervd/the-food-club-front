import {surprise} from "../utils/utils.jsx";

const LuckyButton = ({nav}) => {
    return (
        <div className={"surprise"} onClick={() => {
            surprise("all", nav)
        }}>
            feeling lucky ☉ ‿ ⚆
        </div>
    )
}

export default LuckyButton;



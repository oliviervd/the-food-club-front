import {surprise} from "../utils/utils.jsx";
import Link from "next/link";

const LuckyButton = () => {
    return (
        <div className={"surprise"}>
            <Link href={surprise("all")}>
                feeling lucky ☉ ‿ ⚆
            </Link>
        </div>
    )
}

export default LuckyButton;



"use client";

import { useRouter } from "next/navigation";
import { surprise } from "../utils/utils.jsx";

const LuckyButton = ({ venues }) => {
    const router = useRouter();

    const handleClick = async () => {
        const url = surprise(venues);
        if (url) {
            router.push(url);
        } else {
            console.warn("No venue found.");
        }
    };

    return (
        <div className={"surprise"}>
            <button onClick={handleClick}>
                feeling lucky ☉ ‿ ⚆
            </button>
        </div>
    );
};

export default LuckyButton;
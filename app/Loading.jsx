import logo from "../public/assets/img/logo-blue.png";
import Image from "next/image.js";

const Loading = () => {
    return (
        <div className={"loading--container"}>
            <Image src={logo} alt="Food Club Logo" className="logo" />
        </div>
    )
}
export default Loading
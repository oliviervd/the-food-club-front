const logo = '/assets/img/logo-blue.png';
import Image from "next/image.js";

const Loading = () => {
    return (
        <div className={"loading--container"}>
            <Image
                src={logo}
                alt="Food Club Logo"
                className="logo"
                width={200}
                height={100}
                style={{
                    width: '50%',
                    height: 'auto',
                }}
            />
        </div>
    )
}
export default Loading
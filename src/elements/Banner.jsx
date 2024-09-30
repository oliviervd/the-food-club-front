import Marquee from "react-fast-marquee";

// banner element
const Banner = ({content}) => {
    return (
        <div className={"banner-container"}>
                <Marquee className={"banner"} speed={30} pauseOnHover={false} gradient={false} autoFill={true}>
                        <h2>{content}</h2>
                        <h2>~</h2>
                </Marquee>
        </div>

    )
}

export default Banner;
import Marquee from "react-fast-marquee";

const Banner = ({content}) => {
    return (
        <Marquee className={"banner"} speed={30} pauseOnHover={false} gradient={false} autoFill={true}>
                <h2>{content}</h2>
                <h2>~</h2>
        </Marquee>
    )
}

export default Banner;
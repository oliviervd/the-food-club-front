const Banner = ({content}) => {
    return (
        <div className="scrolling-banner-container">
            <h2 className="banner">{content}</h2>
            <h2 className="banner">~</h2>
            <h2 className="banner">{content}</h2>
            <h2 className="banner">~</h2>
            <h2 className="banner">{content}</h2>
            <h2 className="banner">~</h2>
            <h2 className="banner">{content}</h2>
            <h2 className="banner">~</h2>
            <h2 className="banner">{content}</h2>
            <h2 className="banner">~</h2>
        </div>
    )
}

export default Banner;
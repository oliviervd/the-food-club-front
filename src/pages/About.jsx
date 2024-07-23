import Header from "../elements/Header.jsx";

const About = ({}) => {
    return(
        <div>
            <Header landing={true}/>
            <div className={"about"}>
                <h1>RULE #1.</h1>
                <p>ipsem lorum la autro quisto</p>
                <h1>RULE #2.</h1>
                <p>ipsem lorum la autro quisto</p>
                <h1>RULE #3.</h1>
                <p>ipsem lorum la autro quisto</p>
            </div>
        </div>
    )
}
export default About;
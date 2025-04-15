const Footer = ({position}) => {
    return(
        <section className={position ? "footer--container static" : "footer--container fixed"}>
            <div></div>
        </section>
    )
}
export default Footer
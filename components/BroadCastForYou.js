import useWeather from "../hooks/isSunny.tsx";
import "../styles/weather.css"

const BroadCastForYou = ({type}) => {
    const {weather, loading, error, isSunny} = useWeather('gent');
    if (loading) return <div>HOLD ON BABY, GETTING THAT WEATHER FOR YA!</div>;
    if (error) return <div>AH SHIT! {error.message}</div>;

    let LetMetTellYou = ""
    let RunningOutOfTime = ""
    let MomentOfDay = ""

    // TIME-BASED
    const d = new Date();
    let hours = d.getHours();

    if (hours < 11) {
        RunningOutOfTime = "WAKE UP PEOPLE! IT'S TIME TO GET SOME BREAKFAST IN YOUR FACE!"
        MomentOfDay = "morning"
    } else if (hours >= 11 && hours < 14) {
        MomentOfDay = "noon"
        RunningOutOfTime = "LUNCH TIME BABY! LET'S GET SOME FLAVOR IN YOUR LIFE!"
    } else if (hours >= 14 && hours < 19) {
        MomentOfDay = "afternoon"
        RunningOutOfTime = "IT'S SNACK O'CLOCK MY FRIENDS!"
    } else if (hours >= 19 && hours < 20) {
        MomentOfDay = "evening"
        RunningOutOfTime = "DINNER TIME! LET'S GET WEIRD WITH IT!"
    } else if (hours >= 20) {
        RunningOutOfTime = "YO! KITCHENS ARE WINDING DOWN! GET YOUR BUTT TO A TABLE NOW!"
        MomentOfDay = "evening"
    }

    // WEATHER-BASED
    if (weather?.temperature > 20) {
        LetMetTellYou = "HOLY SMOKES IT'S A SCORCHER! 🥵 GET YOURSELF TO A PATIO AND CRUSH SOME COLD ONES!"
    } else if (weather?.temperature > 10 && weather?.temperature < 20) {
        LetMetTellYou = "GRAB A JACKET! IT'S NOT COLD BUT IT'S GOT SOME BITE!"
    }

    if (type === "advice") {
        return (
            <div>
                <h2 style={{fontSize: "20px"}}>
                    <div>{RunningOutOfTime.toUpperCase()}</div>
                </h2>
            </div>
        );
    }

    else if (type === "time") {
        return (
            <div>
                <h2 style={{fontSize: "20px"}}>
                    <div>{LetMetTellYou.toLowerCase()}</div>
                </h2>
            </div>
        )
    }

}

export default BroadCastForYou;
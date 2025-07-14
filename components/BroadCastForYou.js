'use client'

import useWeather from "../hooks/isSunny.tsx";
import "../styles/weather.css"
import {useRouter} from "next/navigation.js";
import Link from "next/link";

const BroadCastForYou = ({ type, recommendations }) => {

    const router = useRouter();

    const { weather, loading, error, isSunny } = useWeather('gent');
    if (loading) return <div>HOLD ON BABY, GETTING THAT WEATHER FOR YA!</div>;
    if (error) return <div>AH SHIT! {error.message}</div>;

    // TIME-BASED
    const d = new Date();
    let hours = d.getHours();

    let RunningOutOfTime = "";
    let MomentOfDay = "";
    let query = "";
    let slug = ""

    if (hours < 11) {
        RunningOutOfTime = "WAKE UP PEOPLE! IT'S TIME TO GET SOME BREAKFAST IN YOUR FACE!";
        MomentOfDay = "morning";
    } else if (hours >= 11 && hours < 14) {
        MomentOfDay = "noon";
        RunningOutOfTime = "LUNCH TIME BABY! LET'S GET SOME FLAVOR IN YOUR LIFE!";
    } else if (hours >= 14 && hours < 19) {
        MomentOfDay = "afternoon";
        RunningOutOfTime = "IT'S SNACK O'CLOCK MY FRIENDS!";
    } else if (hours >= 19 && hours < 20) {
        MomentOfDay = "evening";
        RunningOutOfTime = "DINNER TIME! LET'S GET WEIRD WITH IT!";
    } else if (hours >= 20) {
        RunningOutOfTime = "YO! KITCHENS ARE WINDING DOWN! GET YOUR BUTT TO A TABLE NOW!";
        MomentOfDay = "evening";
    }

    // WEATHER-BASED
    let LetMetTellYou = "";
    let Caption = "";

    console.log(weather)

    if (weather?.temperature > 23) {
        LetMetTellYou = "we love the sunshine! ready to get sunkissed?";
        Caption = "these babies are burning to serve you."
        slug="/si-schiatta"
    } else if (weather?.temperature > 10 && weather?.temperature < 25) {
        LetMetTellYou = "GRAB A JACKET! IT'S NOT COLD BUT IT'S GOT SOME BITE!";

    }

    if (type === "advice") {
        return (
            <div>
                <h2 style={{ fontSize: "20px" }}>
                    <div>{RunningOutOfTime.toUpperCase()}</div>
                </h2>
            </div>
        );
    } else if (type === "time") {
        return (
            <Link href={"/recommendations/sun-kissed/"}>
                    <h2 style={{fontSize: "20px"}}>{LetMetTellYou.toLowerCase()}</h2>
                    <p>{Caption}</p>
            </Link>
        );
    }
    return null;
};

export default BroadCastForYou;
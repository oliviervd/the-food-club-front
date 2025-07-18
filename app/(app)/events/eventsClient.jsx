'use client'

import Header from "../../../components/Header.jsx";
import {useQuery} from "@tanstack/react-query";
import {fetchAPI} from "../../../utils/utils.jsx";
import ScrollToTop from "../../../components/scrollToTop.jsx";
import '../../../styles/events.css';
import Image from 'next/image'
import Link from 'next/link'


const eventsClient = () => {

    // fetch events
    const {data: eventsData, isLoading: eventsLoading, error:eventsError} = useQuery({
        queryKey: ["events"],
        queryFn: () => fetchAPI('events', 'en', {limit: 1000})
    });

    // setup calender boundaries
    const today = new Date();

// Start of this week (Monday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (today.getDay() + 6) % 7);

// End of this week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

// Start of next week (Monday)
    const startOfNextWeek = new Date(endOfWeek);
    startOfNextWeek.setDate(endOfWeek.getDate() + 1);

// End of next week (Sunday)
    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);

// End of Month
    const endOfMonth = new Date(today);
    endOfMonth.setMonth(today.getMonth() + 1);

// One year from today (keep for filtering upcoming)
    const oneYearFromToday = new Date(today);
    oneYearFromToday.setFullYear(today.getFullYear() + 1);

    // UTILITY FUNCTIONS
    function extractTime(event) {
        // utility function to extract time from event.
        // if timed event
        if (event.Information.startDate && event.Information.endDate){

            function prettyTime(date) {
                let ugly = new Date(date)
                return ugly.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                });
            }

            let start = prettyTime(event.Information.startDate);
            let end = prettyTime(event.Information.endDate);

            return (
                <p>{start} - {end}</p>
            )
        }

        if (event.Information.frequency === 'yearly') {

            let month = event.Information.month;
            let day = event.Information.day;

            return (
                <p>{month} {day}th</p>
            )
        }
    }

    const monthNameToNumber = (monthName) => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return months.findIndex(
            m => m.toLowerCase() === monthName.toLowerCase()
        );
    };

    function getEventDate(event) {
        if (event.Information.startDate) {
            return new Date(event.Information.startDate);
        }

        if (event.Information.frequency === 'yearly') {
            const today = new Date();
            const year = today.getFullYear();
            const monthNumber = monthNameToNumber(event.Information.month);
            const day = event.Information.day;

            let eventDate = new Date(year, monthNumber, day);

            // If the event already happened this year, roll to next year:
            if (eventDate < today) {
                eventDate = new Date(year + 1, monthNumber, day);
            }

            return eventDate;
        }

        return new Date(3000, 0, 1); // fallback far future
    }

    const eventsThisWeek = [];
    const eventsNextWeek = [];
    const eventsThisMonth = [];

    const eventsLater = [];

    if (!eventsLoading) {
        eventsData.docs.forEach(event => {
            if (event._status !== 'published') return;

            const date = getEventDate(event);
            if (date < today || date > oneYearFromToday) return;

            if (date >= startOfWeek && date <= endOfWeek) {
                eventsThisWeek.push(event);
            } else if (date > endOfWeek && date <= endOfMonth) {
                eventsThisMonth.push(event);
            } else {
                eventsLater.push(event);
            }
        });
    }

    function EventCard({ event }) {
        let ref = "";

        console.log(event)

        if (event.relatedToVenue && event.relatedToVenue[0]?.url) {
            ref = `/venue/${event.relatedToVenue[0].url}`;
            //console.log(ref);
        }

        if (event.Information && event.Information.externalLink) {
            ref = event.Information.externalLink;
        }

        return (
            <div className="event__container">
                <Link href={ref}>
                    <div style={{ position: "relative", width: "100%", height: "300px" }}>
                        <Image
                            src={event.Media.heroImage.url}
                            alt={event.name}
                            fill
                            style={{ objectFit: "cover", zIndex: -1 }}
                        />
                    </div>
                    <h2>{event.name}</h2>
                    <div className="event__time">
                        {extractTime(event)}
                    </div>
                </Link>
            </div>
        );
    }

    function EventList({event}) {
        return (
            <div className="event__list-item">
                <p className={"event__name"}>{event.name}</p>
                <div className="event__time">
                    {extractTime(event)}
                </div>
            </div>
        )
    }

    return (
        <>
            <Header landing={true}/>
            <ScrollToTop/>
            <section className={"events__main"}>
            <section >

                    <div className={"events__tiles"}>
                        <h1>this week</h1>
                        {eventsThisWeek.length === 0 && <p className={"no-events"}>No events this week</p>}
                        {eventsThisWeek.sort((a, b) => getEventDate(a) - getEventDate(b)).map((event, idx) => (
                            <EventCard key={idx} event={event}/>
                        ))}
                    </div>
                </section>

                <section>
                    <div className={"events__tiles"}>
                        <h1>the rest of the month</h1>
                        {eventsThisMonth.length === 0 && <p className={"no-events"}>No events this month</p>}
                        {eventsThisMonth.sort((a, b) => getEventDate(a) - getEventDate(b)).map((event, idx) => (
                            <EventCard key={idx} event={event}/>
                        ))}
                    </div>
                </section>

                <section className={"events__list"}>
                    <h1>upcoming</h1>
                    <div className="events__container">
                        {eventsLater.length === 0 && <p className={"no-events"}>No upcoming events</p>}
                        {eventsLater.sort((a, b) => getEventDate(a) - getEventDate(b)).map((event, idx) => (
                            <EventList key={idx} event={event}/>
                        ))}
                    </div>
                </section>

            </section>
        </>
    )
}

export default eventsClient
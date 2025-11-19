'use client'

import Header from "../../../components/Header.jsx";
import ScrollToTop from "../../../components/scrollToTop.jsx";
import Banner from "../../../components/Banner.jsx";
import {useQuery} from "@tanstack/react-query";
import {fetchAPI} from "../../../utils/utils.jsx";
import React, {useMemo} from "react";
import Link from "next/link";
import Image from "next/image";
import '../../../styles/events.css';

const EventsClient = () => {
    const { data: eventsData, isLoading: eventsLoading, error: eventsError } = useQuery({
        queryKey: ["events"],
        queryFn: () => fetchAPI('events', 'en', { limit: 500 })
    });

const categorizeEvent = (event, today, endOfWeek, endOfMonth, oneYearFromNow) => {
    // Handle one-time events with specific dates
    if (event.Information.startDate && event.Information.endDate) {
        const startDate = new Date(event.Information.startDate);
        const endDate = new Date(event.Information.endDate);

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        // Event is current if it overlaps with today
        if (endDate >= today && startDate <= today) {
            return 'thisWeek';
        }

        // Future events
        if (startDate > today) {
            if (startDate <= endOfWeek) return 'thisWeek';
            if (startDate <= endOfMonth) return 'thisMonth';
            if (startDate <= oneYearFromNow) return 'later';
        }
    }

    // Handle yearly recurring events
    if (event.Information.repeats && event.Information.frequency === 'yearly') {
        const monthNameToNumber = (monthName) => {
            const months = [
                "January", "February", "March", "April", "May", "June", 
                "July", "August", "September", "October", "November", "December"
            ];
            return months.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
        };

        const eventMonth = monthNameToNumber(event.Information.month);
        const eventDay = event.Information.day;

        // Create this year's event date
        const thisYearEventDate = new Date(today.getFullYear(), eventMonth, eventDay);
        thisYearEventDate.setHours(0, 0, 0, 0);

        // Create next year's event date
        const nextYearEventDate = new Date(today.getFullYear() + 1, eventMonth, eventDay);
        nextYearEventDate.setHours(0, 0, 0, 0);

        // If this year's event is in the past, use next year's
        const eventDate = thisYearEventDate < today ? nextYearEventDate : thisYearEventDate;

        if (eventDate <= endOfWeek) return 'thisWeek';
        if (eventDate <= endOfMonth) return 'thisMonth';
        if (eventDate <= oneYearFromNow) return 'later';
    }

    return null;
};

const processedEvents = useMemo(() => {
    if (!eventsData?.docs) return {
        thisWeek: [],
        thisMonth: [],
        later: []
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (today.getDay() + 6) % 7);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const endOfMonth = new Date(today);
    endOfMonth.setMonth(today.getMonth() + 1);
    endOfMonth.setDate(0);

    const oneYearFromNow = new Date(today);
    oneYearFromNow.setFullYear(today.getFullYear() + 1);

    const publishedEvents = eventsData.docs.filter(event => event._status === 'published');

    // Declare arrays before using them
    const thisWeek = [];
    const thisMonth = [];
    const later = [];

    publishedEvents.forEach(event => {
        const category = categorizeEvent(event, today, endOfWeek, endOfMonth, oneYearFromNow);
        
        if (category === 'thisWeek') thisWeek.push(event);
        else if (category === 'thisMonth') thisMonth.push(event);
        else if (category === 'later') later.push(event);
    });

    return {
        thisWeek: thisWeek.sort((a, b) => new Date(a.Information.startDate) - new Date(b.Information.startDate)),
        thisMonth: thisMonth.sort((a, b) => new Date(a.Information.startDate) - new Date(b.Information.startDate)),
        later: later.sort((a, b) => new Date(a.Information.startDate) - new Date(b.Information.startDate))
    };
}, [eventsData]);

    const EventCard = ({ event }) => {
        const link = event.relatedToVenue?.[0]?.url
            ? `/venue/${event.relatedToVenue[0].url}`
            : event.Information.externalLink || '#';

        return (
            <div className="event__container">
                <Link href={link}>
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
                        {formatEventDate(event)}
                    </div>
                    {event.Information.tags && event.Information.tags.length > 0 && (
                        <div className="event__type">
                            <p>{event.Information.tags[0]}</p>
                        </div>
                    )}
                </Link>
            </div>
        );
    };

    const formatEventDate = (event) => {
        if (event.Information.startDate && event.Information.endDate) {
            const start = new Date(event.Information.startDate);
            const end = new Date(event.Information.endDate);
            return `${start.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })} - ${end.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}`;
        }
        return 'Date TBA';
    };

    //if (eventsLoading) return <div>Loading events...</div>;
    //if (eventsError) return <div>Error loading events</div>;

    return (
        <>
            <Header landing={true}/>
            <ScrollToTop/>
            <section className="events__main">
                <section>
                    <div className="events__tiles">
                        <h1>this week</h1>
                        {processedEvents.thisWeek.length === 0 && <p className="no-events">No events this week</p>}
                        {processedEvents.thisWeek.map((event, idx) => (
                            <EventCard key={idx} event={event}/>
                        ))}

                        <h1>the rest of the month</h1>
                        {processedEvents.thisMonth.length === 0 && <div className="no-events-tile">stay tuned you hungry people.</div>}
                        {processedEvents.thisMonth.map((event, idx) => (
                            <EventCard key={idx} event={event}/>
                        ))}
                    </div>
                </section>

                <section className="events__list">
                    <h1 style={{fontFamily: "DM-serif-display-italic", fontSize: "2rem"}}>upcoming</h1>
                    <div className="events__container">
                        {processedEvents.later.length === 0 && <p className="no-events">stay tuned you hungry people.</p>}
                        {processedEvents.later.map((event, idx) => (
                            <div key={idx} className="event__list-item">
                                <p className="event__name">{event.name}</p>
                                {event.Information.repeats && event.Information.frequency === 'yearly' && (
                                    <div>
                                        <p style={{textAlign: "right"}}>
                                            {event.Information.month} {event.Information.day}
                                        </p>
                                    </div>
                                )}
                                {!event.repeats && event.Information.startDate && (
                                    <div>
                                        <p style={{textAlign: "right"}}>
                                            {formatEventDate(event)}
                                        </p>
                                    </div>
                                )}

                            </div>
                        ))}
                    </div>
                </section>
            </section>
        </>
    );
}

export default EventsClient;
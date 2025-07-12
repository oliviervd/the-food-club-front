// app/(app)/venue/[venue]/page.jsx
'use client'

import { useParams } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useLivePreview } from '@payloadcms/live-preview-react'
import { getClientSideURL } from '../../../../utils/getURL'
import Header from "../../../../components/Header.jsx"
import DitherImage from "../../../../components/DitherImage.jsx"
import AutoResizeText from "../../../../components/AutoResizeText.jsx"
import serialize from "../../../../utils/serialize.jsx"
import Loading from "../../Loading.jsx"
import Link from "next/link"
import { useEffect, useState, Suspense } from "react"


 const VenueClient = () => {
    const [isDesktop, setIsDesktop] = useState(false)
    const { venue: venueParam } = useParams()
    const baseUrl = getClientSideURL()
    const queryClient = useQueryClient()

    useEffect(() => {
        const checkWidth = () => setIsDesktop(window.innerWidth > 1200)
        checkWidth()
        window.addEventListener("resize", checkWidth)
        return () => window.removeEventListener("resize", checkWidth)
    }, [])

    const { data: initialVenue, isLoading, error } = useQuery({
        queryKey: ["venue", venueParam],
        queryFn: async () => {
            const response = await fetch(`${baseUrl}/api/venues?where[url][equals]=${venueParam}&depth=2`)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            return data.docs[0] || null
        },
        staleTime: 0,
        suspense: true,
        enabled: !!venueParam
    })

    const { data: venue } = useLivePreview({
        initialData: initialVenue,
        serverURL: baseUrl,
        depth: 2,
    })

    // Prefetch the data
    useEffect(() => {
        if (venueParam) {
            queryClient.prefetchQuery({
                queryKey: ["venue", venueParam],
                queryFn: async () => {
                    const response = await fetch(`${baseUrl}/api/venues?where[url][equals]=${venueParam}&depth=2`)
                    const data = await response.json()
                    return data.docs[0] || null
                }
            })
        }
    }, [venueParam, queryClient, baseUrl])

    if (error) return <div>Error loading venue data</div>
    if (!venue) return <div>Venue not found</div>

    return (
        <>
            <Header
                landing={true}
                setLocation={null}
                venueLocation={venue?.club || null}
                interact={false}
                greyOut={true}
                venue={true}
            />
            {isDesktop ? (
                <DesktopView venue={venue} />
            ) : (
                <MobileView venue={venue} />
            )}
        </>
    )
}


const DesktopView = ({ venue }) => (
    <section className="venue__container container-big_desktop">
        <div>
            {venue.venueName && (
                <div style={{width: "100%", height: 'auto', position: "relative", margin: "none"}}>
                    <AutoResizeText text={venue.venueName} padding="0 0 0 0" />
                </div>
            )}

            {venue.information?.address && (
                <h2 className="address">
                    {`${venue.information.address.street} ${venue.information.address.houseNumber}, ${venue.information.address.postalCode} ${venue.information.address.city}`}
                </h2>
            )}

            <CuisineList venue={venue} />

            <div className="text-main" style={{paddingTop: "20px"}}>
                {serialize(venue.review?.review)}
            </div>

            <section style={{display: "grid", gridTemplateColumns: "1fr 1fr", gridGap: "20px", marginBottom: "20px"}}>
                {venue.review?.foodClubOrder && (
                    <div className="venue-tip__container">
                        <div className="text-main">☞</div>
                        <p className="text-main">{serialize(venue.review.foodClubOrder)}</p>
                    </div>
                )}

                <OpeningHours venue={venue} />
            </section>

            {venue.information.reservations && (
                <div className="link reservations">
                    <a href={venue.information.reservations}>book a table</a>
                </div>
            )}
        </div>


        {venue.media?.hero?.sizes?.tablet?.url && (
            <div style={{marginTop: "30px"}}>
                <DitherImage
                    style={{justifyContent: "center", maxWidth: "99%"}}
                    url={venue.media.hero.sizes.original.url}
                />
            </div>

        )}
    </section>
)

const MobileView = ({ venue }) => (
    <section className="venue__container">
        <div className="grid">
            <div>
                <div className="image-hero">
                    {venue.media?.hero?.sizes?.tablet?.url && (
                        <DitherImage
                            style={{justifyContent: "center", maxWidth: "99%"}}
                            url={venue.media.hero.sizes.mobileFriendly.url}
                        />
                    )}
                </div>

                {venue.venueName && (
                    <div style={{width: "100%", height: 'auto', position: "relative"}}>
                        <AutoResizeText text={venue.venueName} padding="10px 0 10px 0" />
                    </div>
                )}

                {venue.information?.address && (
                    <h2 className="address">
                        {`${venue.information.address.street} ${venue.information.address.houseNumber}, ${venue.information.address.postalCode} ${venue.information.address.city}`}
                    </h2>
                )}

                <CuisineList venue={venue} />
            </div>

            <div className="container-big">
                {venue.review?.review && (
                    <div className="text-main">
                        {serialize(venue.review.review)}
                    </div>
                )}

                {venue.review?.foodClubOrder && (
                    <div className="venue-tip__container">
                        <div className="text-main">☞</div>
                        <p className="text-main">{serialize(venue.review.foodClubOrder)}</p>
                    </div>
                )}

                {venue.information.reservations && (
                    <div className="link reservations">
                        <a href={venue.information.reservations}>book a table</a>
                    </div>
                )}

                <OpeningHours venue={venue} />
            </div>
        </div>
    </section>
)

const CuisineList = ({ venue }) => (
    <div className="cuisines">
        {[...(venue.information?.cuisine || []), ...(venue.information?.dishes || []), ...(venue.information?.drinks || [])].map((item, index) => (
            <div key={index}>
                <h2 className="link">
                    <Link href={`/venues/?cuisine=${item.name}`}>
                        {item.name}
                    </Link>
                </h2>
            </div>
        ))}
    </div>
)

const OpeningHours = ({ venue }) => {
    if (!venue.information?.hours || venue.information.hours.length <= 1) return null

    return (
        <section className="venue-open">
            {venue.information.hours.map((day, index) => (
                <div key={index} style={{paddingBottom: "5px", borderBottom: "1px solid #ccc"}}>
                    <p className="day">{day.dayOfWeek}</p>
                    {day.isClosed ? (
                        <div>
                            <p>closed</p>
                        </div>
                    ) : (
                        <div className={"hours"}>
                            {day.periods[0].openTime !== "" &&
                                <div className={"slot"}>
                                    <p>{day.periods[0].openTime}</p>
                                    <p>-</p>
                                    {day.periods[0].closeTime !== "" &&
                                        <p>{day.periods[0].closeTime}</p>
                                    }
                                    {day.periods[0].closeTimeSpecial &&
                                        <p>{day.periods[0].closeTimeSpecial}</p>
                                    }
                                </div>
                            }
                            {day.periods[1] && !day.isClosed &&
                                <div>
                                    <p>{day.periods[1].openTime}</p>
                                    <p>-</p>
                                    {day.periods[1].closeTime !== "" &&
                                        <p>{day.periods[1].closeTime}</p>
                                    }
                                    {day.periods[1].closeTimeSpecial &&
                                        <p>{day.periods[1].closeTimeSpecial}</p>
                                    }
                                </div>
                            }
                        </div>
                    )}

                </div>
            ))}
            {venue.information.remarks &&
                <p style={{marginBottom: "0px", marginTop: "5px"}}>
                    {venue.information.remarks}
                </p>
            }
        </section>
    )
}

export default VenueClient
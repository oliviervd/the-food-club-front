import type { CollectionConfig } from 'payload'
import openingHours from "@/fields/openingHours";

export const Venue: CollectionConfig = {
    slug: "venues", // Make sure this is "venues" (plural)
    labels: {
        singular: {
            en: "venue",
            fr: "lieu",
            nl: "locatie"
        },
        plural: {
            en: "venues",
            fr: "lieux",
            nl: "locaties"
        }
    },
    admin: {
        useAsTitle: "venueName",
        livePreview: {
            url: ({ data }) => `/venue/${data?.url || ''}`,
            breakpoints: [
                {
                    label: 'Mobile',
                    name: 'mobile',
                    width: 600,
                    height: 844,
                },
                {
                    label: 'Desktop',
                    name: 'desktop',
                    width: 1440,
                    height: 900,
                },
            ],
        },

    },
    access: {
        read: () => true,
        create: () => true,
        update: () => true,
        delete: () => true
    },
    versions: {
        maxPerDoc: 20,
        drafts: true,
    },
    fields: [
        {
            name: "venueName",
            type: "text",
            label: {
                en: "venue name",
                nl: "naam locatie",
                fr: "nom de lieu"
            },
            admin: {
                description: "name of the venue",
                placeholder: {
                    en: "enter venue name",
                    fr: "entrez le nom du lieu",
                    nl: "voer locatienaam in"
                }
            },
            required:true,
        },
        {
            name: "url",
            label: "URL",
            type: "text",
            admin: {
                position: "sidebar",
                description: "NO SPACES! USE '-' INSTEAD. - example: 'da-luigi' or 'no-spaces-here'."
            },
            required:true,
        },
        {
            name: "club",
            label: "club",
            type: "select",
            admin: {
                position: "sidebar",
                description: {
                    en: "the club the venue belongs to (the city it is located in)",
                    nl: "de club tot waar deze plek toebehoord (de locatie)",
                    fr: "le club auquel appartient cette lieu (la ville où il se trouve)"
                }
            },
            options: [
                {
                    label:"brussels",
                    value: "brussels"
                },
                {
                    label: "gent",
                    value: "gent"
                },
                {
                    label: "antwerp",
                    value: "antwerp"
                }
            ],
            required:true
        },
        {
            name: "damage",
            label: "damage",
            type: "select",
            options: [
                {
                    label: "👊🏼",
                    value: "*"
                },
                {
                    label: "👊👊",
                    value: "**"
                },
                {
                    label: "👊👊👊",
                    value: "***"
                },
                {
                    label: "👊👊👊👊",
                    value: "****"
                },
                {
                    label: "👊👊👊👊👊",
                    value: "*****"
                },

            ],
            admin: {
                position: "sidebar"
            }
        },
        {
            name: "new",
            label: "new",
            type: "checkbox",
            defaultValue: true,
            admin: {
                position: "sidebar",
                description: {
                    en: "mark this venue as new",
                    nl: "markeer deze locatie als nieuw",
                    fr: "marquez cette lieu comme nouveau"
                }
            }
        },
        {
            type: "tabs",
            tabs: [
                {
                    name: "media",
                    admin: {
                        description: {
                            en: "media for the venue",
                            fr: "media pour le lieu",
                            nl: "media voor de locatie"
                        }
                    },
                    fields: [
                        {
                            name: "hero",
                            label: {
                                en: "hero image",
                                fr: "image principale",
                                nl: "hero image"
                            },
                            type: "upload",
                            relationTo: "media",
                            admin: {
                                description: {
                                    en: "hero image for the venue",
                                    nl: "hero image voor de locatie",
                                    fr: "image principale pour le lieu"
                                }
                            },
                            required: true,
                        }
                    ]
                },
                {
                    name: "information",
                    fields: [
                        {
                            name: "type",
                            label: "type",
                            type: "select",
                            options: ["market", "food-truck", "shop", "restaurant", "bar"],
                            admin: {
                                description: {
                                    en: "select the type of venue",
                                    fr: "sélectionner le type de lieu",
                                    nl: "selecteer het type van de locatie"
                                }
                            }
                        },
                        {
                            name: "cuisine",
                            label: {
                                en: "cuisine",
                                fr: "cuisine",
                                nl: "kitchen"
                            },
                            admin: {
                                description: {
                                    en: "select the kitchen/cuisine the venue belongs to, fe. Italian, French, Dutch, ...",
                                    fr: "sélectionner la cuisine/kitchen auquel appartient cette lieu, ex. Italien, Français, Néerlandais, ...",
                                    nl: "selecteer de keuken/kitchen waartoe deze locatie behoort, ex. Italiën, Frans, Nederlands, ..."
                                }
                            },
                            type: "relationship",
                            relationTo: "cuisines",
                            hasMany: true,
                        },
                        {
                            name: "dishes",
                            label: {
                                en: "dishes",
                                fr: "plats",
                                nl: "gerechten"
                            },
                            admin: {
                                description: {
                                    en: "select the dishes the venue serves, fe. Italian, French, Dutch, ...",
                                }
                            },
                            type: "relationship",
                            relationTo: "cuisines",
                            hasMany: true,
                        },
                        {
                            name: "drinks",
                            label: {
                                en: "drinks",
                                fr: "boissons",
                                nl: "dranken"
                            },
                            type: "relationship",
                            relationTo: "cuisines",
                            hasMany: true
                        },
                        {
                            label: "serves",
                            name: "serves",
                            type: "select",
                            options: ["breakfast", "brunch", "lunch", "dinner", "snack", "drinks", "coffee"],
                            hasMany: true,
                        },
                        {
                            type: "row",
                            fields: [
                                {
                                    type: "group",
                                    label: "terrace",
                                    fields: [
                                        {
                                            name: "hasTerrace",
                                            label: "terrace",
                                            type: "checkbox",
                                            admin: {
                                                description: {
                                                    en: "the venue has a terrace",
                                                    nl: "de locatie heeft een terras",
                                                    fr: "le lieu a un terrasse"
                                                }
                                            }
                                        },
                                        {
                                            name: "orientation",
                                            label: "orientation",
                                            type: "select",
                                            options: ["NE", "E", "SE", "S", "SW", "W", "NW", "N"],
                                        }
                                    ]
                                },
                                {
                                    name: "takeAway",
                                    label: "take away",
                                    type: "checkbox",
                                    admin: {
                                        description: {
                                            en: "the venue has take away",
                                            nl: "de locatie heeft take away",
                                            fr: "le lieu a take away"
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            name: "address",
                            type: "group",
                            fields: [
                                {
                                    type: "row",
                                    fields: [
                                        {
                                            name: "street",
                                            label: {
                                                en: "street",
                                                fr: "rue",
                                                nl: "straat"
                                            },
                                            type: "text",
                                            required: true,
                                        },
                                        {
                                            name: "houseNumber",
                                            label: {
                                                en: "house number",
                                                fr: "numéro de maison",
                                                nl: "huisnummer"
                                            },
                                            type: "text",
                                            required: true,
                                        },
                                        {
                                            name: "city",
                                            label: {
                                                en: "city",
                                                fr: "ville",
                                                nl: "gemeente"
                                            },
                                            type: "text",
                                            required: true,
                                        },
                                        {
                                            name: "postalCode",
                                            label: {
                                                en: "postal code",
                                                fr: "code postal",
                                                nl: "postcode"
                                            },
                                            type: "text",
                                            required: true,
                                        }
                                    ]
                                },
                                {
                                    type: "row",
                                    fields: [
                                        {
                                            name: "longitude",
                                            label: {
                                                en: "longitude",
                                                fr: "longitude",
                                                nl: "lengtegraad"
                                            },
                                            type: "number",
                                            required: true,
                                        },
                                        {
                                            name: "latitude",
                                            label: {
                                                en: "latitude",
                                                fr: "latitude",
                                                nl: "breedtegraad"
                                            },
                                            type: "number",
                                            required: true,
                                        }
                                    ]
                                }

                            ]
                        },
                        {
                            name: "sunKissed",
                            label: "sun kissed",
                            type: "checkbox",
                            admin: {
                                description: {
                                    en: "this venue is blessed, it only opens when the sun shines ☀️",
                                    fr: "ce restaurant est béni, il ne s'ouvre que lorsque le soleil brille ☀️",
                                    nl: "dit restaurant is geboren, het openen is alleen wanneer de zon hemelighoudt ☀️"
                                }
                            }

                        },
                        openingHours,
                        {
                            name: "remarks",
                            label: "remarks",
                            type: "text",
                            admin: {
                                description: {
                                    en: "remarks for the opening hours",
                                    fr: "remarques pour les heures d'ouverture",
                                    nl: "opmerkingen voor de openingstijden"
                                }
                            },
                        },
                        {
                            name: "reservations",
                            label: "booking URL",
                            type: "text",
                            admin: {
                                position: "sidebar",
                                description: {
                                    en: "url to booking service (Resengo or other)",
                                    fr: "url vers le service de réservation (Resengo ou autre)",
                                    nl: "url naar booking service (Resengo, ...)"
                                }
                            },
                        },
                    ]
                },
                {
                    name: "review",
                    fields: [
                        {
                            label: "review",
                            type: "richText",
                            admin: {
                                description: {
                                    en: "review for the venue",
                                    nl: "review voor de locatie",
                                    fr: "review pour le lieu"
                                }
                            },
                            name: "review",
                            required: true,
                        },
                        {
                            name: "foodClubOrder",
                            type: "richText",
                            localized: true,
                            label: "food club order",
                            admin: {
                                description: {
                                    en: "if the food club has an order for it prefers when visiting the venue, enter it here.",
                                    nl: "favoriete bestelling van TFC op deze plek",
                                    fr: "si le food club a une commande preferite pour cette lieu, entrez-la ici."
                                }
                            },
                            required: true,
                        },
                        {
                            name: "backstory",
                            type: "richText",
                            localized: true,
                            label: "back story",
                            admin: {
                                description: {
                                    en: "back story - more in depth info on the venue.",
                                    nl: "back story - verdiepende info over de locatie, chef, kaart..",
                                    fr: "back story - "
                                }
                            }
                        }
                    ]
                }
            ]
        }
    ]
}

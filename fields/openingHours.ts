import type { Field } from 'payload'

const openingHours: Field = {
    type: "array",
    label: {
        en: "Opening Hours",
        fr: "Horaires d'ouverture",
        nl: "Openingsuren"
    },
    labels: {
        singular: {
            en: "Day",
            fr: "Jour",
            nl: "Dag"
        },
        plural: {
            en: "Days",
            fr: "Jours",
            nl: "Dagen"
        }
    },
    name: "hours",
    fields: [
        {
            type: "row",
            fields: [
                {
                    name: "dayOfWeek",
                    label: {
                        en: "Day",
                        fr: "Jour",
                        nl: "Dag"
                    },
                    type: "select",
                    options: [
                        { value: "monday", label: { en: "Monday", fr: "Lundi", nl: "Maandag" } },
                        { value: "tuesday", label: { en: "Tuesday", fr: "Mardi", nl: "Dinsdag" } },
                        { value: "wednesday", label: { en: "Wednesday", fr: "Mercredi", nl: "Woensdag" } },
                        { value: "thursday", label: { en: "Thursday", fr: "Jeudi", nl: "Donderdag" } },
                        { value: "friday", label: { en: "Friday", fr: "Vendredi", nl: "Vrijdag" } },
                        { value: "saturday", label: { en: "Saturday", fr: "Samedi", nl: "Zaterdag" } },
                        { value: "sunday", label: { en: "Sunday", fr: "Dimanche", nl: "Zondag" } }
                    ]
                },
                {
                    name: "isClosed",
                    label: {
                        en: "Closed",
                        fr: "Fermé",
                        nl: "Gesloten"
                    },
                    type: "checkbox",
                    defaultValue: false
                }
            ]
        },
        {
            type: "collapsible",
            label: "Time Periods",
            fields: [
                {
                    name: "periods",
                    type: "array",
                    label: "Opening Periods",
                    admin: {
                        condition: (data, siblingData) => !siblingData.isClosed
                    },
                    fields: [
                        {
                            type: "row",
                            fields: [
                                {
                                    name: "openTime",
                                    label: {
                                        en: "Open Time",
                                        fr: "Heure d'ouverture",
                                        nl: "Openingstijd"
                                    },
                                    type: "text",
                                    admin: {
                                        placeholder: "09:00"
                                    },
                                    validate: (value) => {
                                        if (!value) return true;
                                        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
                                        return timeRegex.test(value) || "Please use HH:MM format";
                                    }
                                },
                                {
                                    name: "closeTime",
                                    label: {
                                        en: "Close Time",
                                        fr: "Heure de fermeture",
                                        nl: "Sluitingstijd"
                                    },
                                    type: "text",
                                    admin: {
                                        placeholder: "17:00"
                                    },
                                    validate: (value) => {
                                        if (!value) return true;
                                        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
                                        return timeRegex.test(value) || "Please use HH:MM format";
                                    }
                                },
                                {
                                    name: "closeTimeSpecial",
                                    label: {
                                        en: "Special Close Time",
                                        fr: "Heure de fermeture spéciale",
                                        nl: "Speciale sluitingstijd"
                                    },
                                    type: "text",
                                    admin: {
                                        placeholder: "sunset"
                                    }
                                }
                            ]
                        },
                        {
                            name: "label",
                            type: "text",
                            label: {
                                en: "Period Label (optional)",
                                fr: "Libellé de période (optionnel)",
                                nl: "Periode label (optioneel)"
                            },
                            admin: {
                                placeholder: "Lunch, Dinner, etc."
                            }
                        }
                    ]
                }
            ]
        }
    ],
}

export default openingHours;

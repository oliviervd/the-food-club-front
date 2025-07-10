import type { CollectionConfig } from 'payload';

export const Event: CollectionConfig = {
    slug: 'events',
    labels: {
        singular: 'Event',
        plural: 'Events',
    },
    admin: {
        useAsTitle: 'name',
        description: {
            en: 'Collection of food-related events: festivals, international days, pop-ups, openings, etc.',
            fr: 'Collection d\'événements liés à la gastronomie : festivals, journées internationales, pop-ups, ouvertures, etc.',
            nl: 'Collectie van food-gerelateerde evenementen: festivals, internationale dagen, pop-ups, openingen, enz.'
        },
    },
    versions: {drafts: true},
    fields: [
        {
            name: 'name',
            label: 'Event Name',
            type: 'text',
            required: true,
        },
        {
            name: 'slug',
            label: 'Slug',
            type: 'text',
            required: true,
            unique: true,
            admin: {
                description: 'Unique URL slug for this event.'
            }
        },
        {
            name: 'cta',
            label: 'Call To Action',
            type: 'relationship',
            relationTo: 'recommendations',
        },
        {
            type: "row",
            fields: [
                {
                   name: "relatedDishCuisine",
                   label: "Related Dish or Cuisine",
                    type: "relationship",
                    relationTo: "cuisines",
                    hasMany: true,
                    admin: {
                        description: "Dishes or Cuisines related to this event."
                    }
                },
                {
                    name: 'relatedToVenue',
                    label: 'Related Venues',
                    type: 'relationship',
                    relationTo: 'venues',
                    hasMany: true,
                    admin: {
                        description: 'Venues connected to this event.'
                    }
                },
            ]
        },

        {
            type: 'tabs',
            tabs: [
                {
                    name: 'Information',
                    fields: [
                        {
                            name: 'description',
                            label: 'Description',
                            type: 'richText',
                            required: true,
                        },
                        {
                            name: 'externalLink',
                            label: 'External Link',
                            type: 'text',
                            admin: {
                                description: 'Optional link to an official page, tickets, etc.'
                            }
                        },
                        {
                            name: 'location',
                            label: 'Location',
                            type: 'text',
                            admin: {
                                description: 'Free text location if not linked to a venue.'
                            }
                        },
                        {
                            name: 'tags',
                            label: 'Tags',
                            type: 'select',
                            hasMany: true,
                            options: [
                                'Festival',
                                'International Day',
                                'Pop-up',
                                'Opening',
                                'Special Menu',
                                'Market',
                                'Workshop'
                            ],
                        },
                        {
                            name: 'repeats',
                            label: 'Repeating Event',
                            type: 'checkbox',
                            defaultValue: false,
                            admin: {
                                description: 'Check if this event repeats (e.g., every year).'
                            },
                        },
                        {
                            type: 'row',
                            fields: [
                                {
                                    name: 'startDate',
                                    label: 'Start Date',
                                    type: 'date',
                                    admin: {
                                        condition: (data, siblingData) => !siblingData.repeats,
                                        description: 'Start date for one-off event.'
                                    }
                                },
                                {
                                    name: 'endDate',
                                    label: 'End Date',
                                    type: 'date',
                                    admin: {
                                        condition: (data, siblingData) => !siblingData.repeats,
                                        description: 'End date (optional).'
                                    }
                                },
                            ],
                        },
                        {
                            type: 'row',
                            fields: [
                                {
                                    name: 'startTime',
                                    label: 'Start Time',
                                    type: 'text',
                                    admin: {
                                        description: {
                                            en: "hour when the event starts",
                                            fr: "heure de début de l'événement",
                                            nl: "tijd waarop het evenement begint"
                                        }
                                    }
                                },
                                {
                                    name: 'endTime',
                                    label: 'End Time',
                                    type: 'text',
                                    admin: {
                                        description: {
                                            en: "hour when the event ends",
                                            fr: "heure de fin de l'événement",
                                            nl: "tijd waarop het evenement eindigt"
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            type: 'row',
                            fields: [
                                {
                                    name: 'frequency',
                                    label: 'Frequency',
                                    type: 'select',
                                    options: [
                                        { label: 'Yearly', value: 'yearly' },
                                        { label: 'Monthly', value: 'monthly' },
                                        { label: 'Weekly', value: 'weekly' },
                                    ],
                                    admin: {
                                        condition: (data, siblingData) => siblingData.repeats,
                                        description: 'Choose how often it repeats.'
                                    },
                                },
                                {
                                    name: 'month',
                                    label: 'Month',
                                    type: 'select',
                                    options: [
                                        'January', 'February', 'March', 'April',
                                        'May', 'June', 'July', 'August',
                                        'September', 'October', 'November', 'December'
                                    ],
                                    admin: {
                                        condition: (data, siblingData) =>
                                            siblingData.repeats && siblingData.frequency === 'yearly',
                                        description: 'Month for yearly events.'
                                    },
                                },
                                {
                                    name: 'day',
                                    label: 'Day of Month',
                                    type: 'number',
                                    min: 1,
                                    max: 31,
                                    admin: {
                                        condition: (data, siblingData) =>
                                            siblingData.repeats === true &&
                                            (siblingData.frequency === 'yearly' || siblingData.frequency === 'monthly'),
                                        description: 'Day of month for yearly or monthly events.'
                                    },
                                },
                                {
                                    name: 'every',
                                    label: 'Weekly Days',
                                    type: 'select',
                                    options: [
                                        'Monday', 'Tuesday', 'Wednesday',
                                        'Thursday', 'Friday', 'Saturday', 'Sunday',
                                    ],
                                    hasMany: true,
                                    admin: {
                                        condition: (data, siblingData) =>
                                            siblingData.repeats && siblingData.frequency === 'weekly',
                                        description: 'Days of the week for weekly repeats.'
                                    },
                                },
                            ],
                        }
                    ],
                },
                {
                    name: 'Media',
                    fields: [
                        {
                            name: 'heroImage',
                            label: 'Hero Image',
                            type: 'upload',
                            relationTo: 'media',
                            required: true,
                        },
                    ],
                },
            ],
        },
    ],
    hooks: {
        beforeValidate: [
            async ({ data }) => {
                // Auto-generate slug if not provided
                if (!data.slug && data.name) {
                    data.slug = data.name
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)+/g, '');
                }

                // Validation rules:
                const isRepeating = data.repeats;

                if (isRepeating) {
                    if (!data.frequency) {
                        throw new Error('Repeating events must have a frequency.');
                    }

                    if (data.frequency === 'yearly') {
                        if (!data.month || !data.day) {
                            throw new Error('Yearly repeating events must have a month and day.');
                        }
                    }

                    if (data.frequency === 'monthly') {
                        if (!data.day) {
                            throw new Error('Monthly repeating events must have a day of the month.');
                        }
                    }

                    if (data.frequency === 'weekly') {
                        if (!data.every || data.every.length === 0) {
                            throw new Error('Weekly repeating events must have at least one day selected.');
                        }
                    }
                } else {
                    if (!data.startDate) {
                        throw new Error('Non-repeating events must have a start date.');
                    }
                    if (data.endDate && data.startDate && data.endDate < data.startDate) {
                        throw new Error('End date cannot be before start date.');
                    }
                }

                return data;
            },
        ],
    },
};
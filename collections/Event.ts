import type { CollectionConfig} from "payload";

export const Event: CollectionConfig = {
    slug: 'events',
    labels: {
        singular: 'event',
        plural: 'events',
    },
    admin: {
        useAsTitle: 'name',
        description: {
            en: 'collection of events and calendar related to food, such as food festival, international food days etc.',
            fr: 'collection de évènements et calendrier liés au food, comme les festivals, les jours internationaux de food, etc.',
            nl: 'collectie van evenementen en kalender gerelateerd aan food, zoals food festivals, internationale food days etc.'
        }
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: "cta",
            label: "cta",
            type: "relationship",
            relationTo: "recommendations",
        },
        {
            type: "tabs",
            tabs: [
                {
                    name: 'information',
                    fields: [
                        {
                            name: 'startDate',
                            label: 'start date',
                            type: 'date',
                            required: true,
                            admin: {
                                description: 'start date of the event',
                            }
                        },
                        {
                            name: 'endDate',
                            label: 'end date',
                            type: 'date',
                            required: true,
                            admin: {
                                description: 'end date of the event',
                            }
                        }
                    ]
                }
            ]
        }
    ]
}
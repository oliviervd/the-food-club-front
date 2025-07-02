import { CollectionConfig } from "payload";

export const Recommendation:CollectionConfig = {
    slug: "recommendations",
    labels: {
        singular: "recommendation",
        plural: "recommendations",
    },
    admin: {
        useAsTitle: "title",
    },
    access: {
        read: () => true,
    },
    versions: true,
    fields: [
        {
            name: "title",
            type: "text",
            required: true,
        },
        {
            name: "cta",
            label: "call to action",
            type: "text",
            required: true,
            admin: {
                description: "call to action fo the recommendation",
                placeholder: "it's hot, let's get you some ice-cream?"
            }
        },

        {
            type: "group",
            fields: [
                {
                    name: "cuisines",
                    label: "cuisines",
                    type:  "relationship",
                    relationTo: "cuisines",
                    hasMany: true,
                    admin: {
                        description: "cuisines related to the recommendation",
                    }
                },
                {
                    name: "venues",
                    label: "venues",
                    type:  "relationship",
                    relationTo: "venues",
                    hasMany: true,
                    admin: {
                        description: "venues related to the recommendation",
                    }
                },
            ]
        },

        // tabs for different kind of rec
        {
            type: "tabs",
            tabs: [
                {
                    name: "weather",
                    label: "weather",
                    admin: {
                        description: "recommendations related to the weather",
                    },
                    fields: [
                        {
                            name: "matrix",
                            type: "array",
                            fields: [
                                {
                                    name: "weatherCondition",
                                    type: "select",
                                    options: ["sunny", "rainy", "cloudy"],
                                },
                                {
                                    type: "row",
                                    fields: [
                                        {
                                            name: "min",
                                            type: "number",
                                        },
                                        {
                                            name: "max",
                                            type: "number",
                                        }
                                    ]
                                },
                                {
                                    name: "timeSlots",
                                    type: "group",
                                    fields: [
                                        {
                                            name: "morning",
                                            type: "text",
                                        },
                                        {
                                            name: "afternoon",
                                            type: "text",
                                        },
                                        {
                                            name: "evening",
                                            type: "text",
                                        },
                                    ],
                                },
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
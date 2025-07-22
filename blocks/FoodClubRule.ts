import {Block} from "payload"

export const FoodClubRule:Block = {
    slug: "foodClubRule",
    labels: {
        singular: "food club rule",
        plural: "food club rules",
    },
    fields: [
        {
            type: "text",
            name: "ruleNumber",
            label: "rule number",
            required: true,
            admin: {
                description: "rule number (f.e #1)"
            }
        },
        {
            type: "richText",
            name: "rule",
            label: "rule",
            required: true,
            admin: {
                description: "rule"
            }
        }
    ]
}
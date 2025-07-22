import { Block } from 'payload';

export const TextBlock: Block = {
    slug: "textBlock",
    labels: {
        singular: "text block",
        plural: "text blocks",
    },
    fields: [
        {
            name: "text",
            type: "richText"
        }
    ]
}
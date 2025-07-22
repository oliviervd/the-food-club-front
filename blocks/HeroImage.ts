import {Block} from "payload";

export const HeroImage: Block = {
    slug: "heroImage",
    labels: {
        singular: "hero image block",
        plural: "hero image blocks",
    },
    fields: [
        {
            type: "upload",
            label: "image",
            name: "image",
            relationTo: "media"
        },
        {
            type: "text",
            label: "caption",
            name: "caption"
        }
    ]
}
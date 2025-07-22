import {Block} from "payload"

export const ContentWithMedia:Block = {
    slug: "contentWithMedia",
    labels: {
        singular: "content with media block",
        plural: "content with media blocks",
    },
    fields: [
        {
            type: "richText",
            name: "content"
        },
        {
            type: "upload",
            name: "image",
            relationTo: "media"
        },
        {
            type: "radio",
            name: "textPosition",
            options: [
                {
                    label: "left",
                    value: "left"
                },
                {
                    label: "right",
                    value: "right"
                }
            ]
        }
    ]

}
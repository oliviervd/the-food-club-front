import { CollectionConfig} from "payload";
import {ContentWithMedia} from "@/blocks/ContentWithMedia";
import {FoodClubRule} from "@/blocks/FoodClubRule";
import {HeroImage} from "@/blocks/HeroImage";
import {TextBlock} from "@/blocks/TextBlock";

export const Page: CollectionConfig = {
    slug: "page",
    admin: {
      useAsTitle: "title"
    },
    access: {
        read: () => true,
        create: () => true,
        update: () => true,
        delete: () => true,
    },
    fields: [
        {
            name: "slug",
            type: "text",
            required: true,
            admin: {
                description: "slug (url) of the page",
                position: "sidebar"
            }
        },
        {
            name: "title",
            type: "text",
            required: true,
        },
        {
            name: "content",
            type: "blocks",
            blocks: [
                //todo: image
                //todo: text
                ContentWithMedia,
                FoodClubRule,
                HeroImage,
                TextBlock
            ]
        }
    ]
}
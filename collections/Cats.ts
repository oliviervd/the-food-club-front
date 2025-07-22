import {CollectionConfig} from "payload";
import {isSuperAdmin} from "@/access/isSuperAdmin";

export const Cats: CollectionConfig = {
    slug: "cats",
    labels: {
        singular: "category",
        plural: "categories"
    },
    admin: {
        useAsTitle: "name",
        description: "cats - as in categories. Here we cluster and curate venues"
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: "name",
            type: "text",
            required: true,
        },
        {
            name: "slug",
            type: "text",
            admin: {
                description: "slug of the cat"
            },
        },
        {
            name: "description",
            admin: {
                description: "short description of the cat"
            },
            type: "text",
            required: true,
        },
        {
            type: "tabs",
            tabs: [
                {
                    name: "media",
                    fields: [
                        {
                            name: "hero",
                            label: "main image",
                            type: "upload",
                            relationTo: "media",
                            admin: {
                                description: "main image for the cat"
                            }
                        }
                    ]
                },
                {
                    name: "venues",
                    admin: {
                        description: "venues in this category"
                    },
                    fields: [
                        {
                            name: "venues",
                            label: "venues",
                            type: "relationship",
                            relationTo: "venues",
                            hasMany: true,
                        }
                    ]
                }
            ]
        },
        {
            name: "url",
            label: "URL",
            type: "text",
            admin: {
                position: "sidebar",
            }
        }
    ]
}
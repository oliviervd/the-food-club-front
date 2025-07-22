import type { CollectionConfig } from 'payload'

export const Cuisine: CollectionConfig = {
  slug: 'cuisines',
  labels: {
    singular: {
      en: "tag",
      fr: "tag",
      nl: "tag"
    },
    plural: {
      en: "tags",
      fr: "tags",
      nl: "tags"
    }
  },
  admin: {
    useAsTitle: 'name',
    description: {
      en: "collection of kitchens/cuisines/dishes used to type venues (tags)",
      nl: "collectie van keukens/gerechten gebruikt om venues te typeren (tags)",
      fr: "collection de cuisines/plats utilisés pour type de restaurants (tags)",
    }
  },
  access: {
    read: ()=> true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required:true,
      localized: true,
    },
    {
      // categorise tag
      name: "type",
      type: "select",
      required: true,
      admin: {
        description: {
          en: "select the type to which this category belongs",
          fr: "sélectionner le type auquel appartient cette catégorie",
          nl: "selecteer het type waartoe deze categorie behoort"
        }
      },
      options: [
        {
          label: {
            en:"drinks",
            fr:"boissons",
            nl:"dranken"
          },
          value: "drinks"
        },
        {
          label: {
            en: "kitchen",
            fr: "cuisine",
            nl: "keuken"
          },
          value: "cuisine"
        },
        {
          label: {
            en: "dish",
            nl: "gerecht",
            fr: "plat"
          },
          value: "dish"
        },
        {
          label: {
            en: "shop",
            fr: "shop",
            nl: "shop"
          },
          value: "shop"
        },
        {
          label: {
            en: "style",
            fr: "style",
            nl: "style"
          },
          value: "style"
        }
      ]
    },
    {
      name: "description",
      label: "description",
      type: "richText",
      localized: true,
      admin: {
        description: "write a short wiki-like text that explains what this category is about. This doesn't need to be formal, encyclopedic."
      }
    },
    {
      name: "active",
      admin:{
        position: "sidebar",
        description: "tick if this category needs to be displayed. - if unticked, the category keeps existing but isn\'t displayed on the website (homepage)."
      },
      label: {
        en: "show tag",
        fr: "afficher le tag",
        nl: "toon tag"
      },
      type: "checkbox",
    }
  ]
}
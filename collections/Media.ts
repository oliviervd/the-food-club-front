
import type { CollectionConfig } from 'payload'
// import { floydSteinbergDither } from "../utils/floydSteinberg" // Uncomment if you want to re-enable dithering

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
    update: () => true,
    create: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'alt',
      type: 'text',
    },
    {
      name: 'dish',
      type: 'text',
      admin: {
        description: 'if a picture of a dish on the menu, describe the dish in one or two sentences. Keep it short!',
      },
    },
    // Add your notes field here if you have it defined
    // notes,
  ],
  upload: {
    mimeTypes: ['image/*'], // Allow all image types

    // These are used as fallbacks when S3 is not available
    staticDir: 'media',
    //staticURL: '/media',

    // Add adminThumbnail to specify which size to use for the grid

    adminThumbnail: 'mobileThumbnail',
    // Disable local storage since we're using S3
    disableLocalStorage: true,

    // Keep your image sizes from Payload 2.0
    imageSizes: [
      {
        name: 'mobileThumbnail',
        width: 360,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'mobileFriendly',
        width: 550,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'original',
        width: undefined,
        height: undefined,
      },
    ],
  },
}
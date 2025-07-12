// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import {s3Storage} from "@payloadcms/storage-s3";
import { seoPlugin } from '@payloadcms/plugin-seo';

// import collections here.
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import {Venue} from "@/collections/Venue";
import {Cuisine} from "@/collections/Cuisine";
import {Event} from "@/collections/Event";
import {Cats} from "@/collections/Cats";
import {Recommendation} from "@/collections/Recommendation";
import {Page} from "@/collections/Page";

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // admin
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    dateFormat: 'dd/MM/yyyy', // set date format. fe. 03/05/1992
    livePreview: {
      collections: ["venues"], // expand to add live preview to other collections.
      breakpoints: [
        {
          name: "Desktop",
          label: "desktop",
          width: "1440",
          height: "1080"
        },
        {
          name: "Mobile",
          label: "mobile",
          width: "365",
          height: "667"
        }
      ],
      url: ({ data }) => `/venue/${data?.url || ''}`}
  },
  //collections - ADD NEW COLLECTIONS HERE.
  collections: [
    Users,
    Cats,
    Media,
    Venue,
    Cuisine,
    Event,
    Recommendation,
    Page,
  ],
  localization: {
    locales: ['en', 'fr', 'nl'],
    defaultLocale: 'en',
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '', // supersecret secret
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: [
        "venues", "cats"
      ],
      generateTitle: ({ doc }) => `thefoodclub.be — ${doc.venueName}`,
      generateURL: ({ doc }) => `thefoodclub.be/venue/${doc.url}`,
      //generateImage: ({ doc }) => `${doc.media.hero.sizes.tablet.url}`,

      uploadsCollection: 'media',
      tabbedUI: true
    }),
    payloadCloudPlugin(),
    // S3
    s3Storage({
      collections: {
        media: {
          // Custom generateFileURL to maintain your CloudFront URLs
          generateFileURL: ({ filename, prefix }) => {
            return ["https://d3nidktcupd88v.cloudfront.net", prefix, filename]
                .filter(Boolean)
                .join("/");
          },
        },
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        region: process.env.S3_REGION || '',
        endpoint: process.env.S3_ENDPOINT,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        // other S3 configs
      }
    })
  ],
})

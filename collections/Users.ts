import type { CollectionConfig } from 'payload'
import {isSuperAdmin} from "@/access/isSuperAdmin";
import {isAdmin} from "@/access/isAdmin";
import {isUser} from "@/access/isUser";

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  access: {
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      type: "row",
      fields: [
        {
          label: "name",
          type: "text",
          name: "name",
        },
        {
          label: "first name",
          type: "text",
          name: "firstName"
        }
      ]
    },
    {
      name: "role",
      label: "role",
      type: "select",
      hasMany: true,
      defaultValue: "editor",
      options: [
        {
          label: "super admin",
          value: "superAdmin"
        },
        {
          label: "admin",
          value: "admin"
        },
        {
          label: "editor",
          value: "editor"
        },
        {
          label: "user",
          value: "user"
        }
      ]
    }
  ],
}

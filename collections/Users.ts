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
    // only the user themselves or an admin can read/update their own profile
    read: ({ req }) => {
      if (!req.user) return false;
      if (req.user.role?.includes('admin') || req.user.role?.includes('superAdmin')) return true;
      return { id: { equals: req.user.id } };
    },
    update: ({ req }) => {
      if (!req.user) return false;
      if (req.user.role?.includes('admin') || req.user.role?.includes('superAdmin')) return true;
      return { id: { equals: req.user.id } };
    },
  },
  auth: true,
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-set savedAt for any newly added savedVenues entries
        if (Array.isArray(data.savedVenues)) {
          data.savedVenues = data.savedVenues.map((entry: any) => ({
            ...entry,
            savedAt: entry.savedAt || new Date().toISOString(),
          }));
        }
        return data;
      }
    ]
  },
  fields: [
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
      defaultValue: "user",
      options: [
        { label: "super admin", value: "superAdmin" },
        { label: "admin", value: "admin" },
        { label: "editor", value: "editor" },
        { label: "user", value: "user" }
      ]
    },
    {
      name: "savedVenues",
      label: "saved venues",
      type: "array",
      admin: {
        description: "venues saved by this user",
      },
      fields: [
        {
          name: "venue",
          type: "relationship",
          relationTo: "venues",
          required: true,
        },
        {
          name: "status",
          type: "select",
          required: true,
          options: [
            { label: "⭐ Favourite", value: "favourite" },
            { label: "📍 Want to go", value: "wantToGo" },
          ],
        },
        {
          name: "savedAt",
          type: "date",
          admin: {
            readOnly: true,
          },
        }
      ]
    }
  ],
}
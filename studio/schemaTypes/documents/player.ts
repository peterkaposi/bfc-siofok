import { UsersIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const player = defineType({
  name: "player",
  title: "Játékos",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "name",
      title: "Név",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Fotó",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "position",
      title: "Pozíció",
      type: "string",
      options: {
        list: [
          { title: "Kapus", value: "Kapus" },
          { title: "Védő", value: "Védő" },
          { title: "Középpályás", value: "Középpályás" },
          { title: "Támadó", value: "Támadó" },
        ],
      },
    }),
    defineField({
      name: "number",
      title: "Mezszám",
      type: "number",
      validation: (rule) => rule.min(1).max(99),
    }),
    defineField({
      name: "order",
      title: "Sorrend",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Sorrend",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "position",
      media: "photo",
      number: "number",
    },
    prepare({ title, subtitle, media, number }) {
      return {
        title: number ? `${number}. ${title}` : title,
        subtitle,
        media,
      };
    },
  },
});

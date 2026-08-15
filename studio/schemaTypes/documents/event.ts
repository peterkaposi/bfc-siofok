import { CalendarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const event = defineType({
  name: "event",
  title: "Esemény",
  type: "document",
  icon: CalendarIcon,
  fields: [
    defineField({
      name: "title",
      title: "Cím",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Időpont",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Helyszín",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Leírás",
      type: "text",
      rows: 4,
    }),
  ],
  orderings: [
    {
      title: "Időpont szerint",
      name: "dateAsc",
      by: [{ field: "date", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "date",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle
          ? new Date(subtitle).toLocaleString("hu-HU")
          : "Nincs időpont",
      };
    },
  },
});

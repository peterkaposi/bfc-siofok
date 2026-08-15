import { BookIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const clubHistory = defineType({
  name: "clubHistory",
  title: "Klub történelem",
  type: "document",
  icon: BookIcon,
  fields: [
    defineField({
      name: "title",
      title: "Cím",
      type: "string",
      initialValue: "Klub történelem",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Tartalom",
      type: "array",
      of: [{ type: "block" }],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title ?? "Klub történelem" };
    },
  },
});

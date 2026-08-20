import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const clubLeader = defineType({
  name: "clubLeader",
  title: "Klubvezetés",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      title: "Név",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Titulus",
      type: "string",
      description: "Pl.: klubtulajdonos, edző, ügyvezető",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Kép",
      type: "image",
      options: { hotspot: true },
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
      subtitle: "title",
      media: "photo",
    },
  },
});

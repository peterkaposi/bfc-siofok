import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const newsArticle = defineType({
  name: "newsArticle",
  title: "Hír",
  type: "document",
  icon: DocumentTextIcon,
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
      name: "category",
      title: "Kategória",
      type: "string",
      options: {
        list: [
          { title: "Hírek", value: "Hírek" },
          { title: "Mérkőzés", value: "Mérkőzés" },
          { title: "Esemény", value: "Esemény" },
          { title: "Klub", value: "Klub" },
        ],
        layout: "radio",
      },
      initialValue: "Hírek",
    }),
    defineField({
      name: "excerpt",
      title: "Kivonat",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "mainImage",
      title: "Borítókép",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "body",
      title: "Tartalom",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "publishedAt",
      title: "Közzététel dátuma",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Közzététel dátuma, újabb elöl",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "publishedAt",
      media: "mainImage",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle
          ? new Date(subtitle).toLocaleDateString("hu-HU")
          : "Nincs dátum",
        media,
      };
    },
  },
});

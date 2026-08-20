import { PlayIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const youtube = defineType({
  name: "youtube",
  title: "YouTube videó",
  type: "object",
  icon: PlayIcon,
  fields: [
    defineField({
      name: "url",
      title: "YouTube link",
      type: "url",
      description: "Pl.: https://www.youtube.com/watch?v=... vagy https://youtu.be/...",
      validation: (rule) =>
        rule.required().uri({ scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    select: { url: "url" },
    prepare({ url }) {
      return {
        title: "YouTube videó",
        subtitle: url,
      };
    },
  },
});

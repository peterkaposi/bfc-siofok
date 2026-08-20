import { VideoIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const videoUpload = defineType({
  name: "videoUpload",
  title: "Feltöltött videó",
  type: "object",
  icon: VideoIcon,
  fields: [
    defineField({
      name: "file",
      title: "Videó fájl",
      type: "file",
      options: {
        accept: "video/mp4,video/webm,video/quicktime",
      },
      description: "Ajánlott: MP4, max. néhány perc hosszúság.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Felirat (opcionális)",
      type: "string",
    }),
  ],
  preview: {
    select: {
      caption: "caption",
      filename: "file.asset->originalFilename",
    },
    prepare({ caption, filename }) {
      return {
        title: caption || "Feltöltött videó",
        subtitle: filename,
      };
    },
  },
});

import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Tartalom")
    .items([
      S.listItem()
        .title("Klub történelem")
        .id("clubHistory")
        .child(
          S.document()
            .schemaType("clubHistory")
            .documentId("clubHistory"),
        ),
      S.divider(),
      S.documentTypeListItem("newsArticle").title("Hírek, események"),
      S.documentTypeListItem("player").title("Játékosok"),
      S.documentTypeListItem("clubLeader").title("Klubvezetés"),
      S.documentTypeListItem("sponsor").title("Szponzorok"),
    ]);

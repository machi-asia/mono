import type { Metadata } from "next";
import { ItemListAdminView } from "../../components/itemlist-admin-view";

export const metadata: Metadata = {
  title: "ItemList Moderation",
  description:
    "Review community recipe consensus overrides and triage Minecraft Create and RimWorld issue reports.",
};

export default function ItemListAdminPage() {
  return <ItemListAdminView />;
}

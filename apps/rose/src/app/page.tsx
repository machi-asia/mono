import type { Metadata } from "next";
import { RoseChat, RoseChatModalProvider } from "@mono/rose";
import "./page.css";

export const metadata: Metadata = {
  title: "Chat with Rose",
  description:
    "Start a conversation with Rose, your AI companion with voice mode and long-term memory.",
};

export default function Home() {
  return (
    <main className="m-rose-page-wrapper">
      <RoseChatModalProvider>
        <RoseChat
          variant="floating"
          showHeader={false}
          showUsage={true}
        />
      </RoseChatModalProvider>
    </main>
  );
}

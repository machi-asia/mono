import type { Metadata } from "next";
import { RoseChat, RoseChatModalProvider } from "@mono/rose";

export const metadata: Metadata = {
  title: "Chat with Rose",
  description:
    "Start a conversation with Rose, your AI companion with voice mode and long-term memory.",
};

export default function Home() {
  return (
    <main style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <RoseChatModalProvider>
        <RoseChat
          title="Rose"
          subtitle="Custom AI agent application"
          showUsage={true}
        />
      </RoseChatModalProvider>
    </main>
  );
}

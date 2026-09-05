import { RoseChat, RoseChatModalProvider } from "@mono/rose";

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

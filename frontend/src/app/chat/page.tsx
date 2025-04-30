import ChatInterface from "@/components/chatcomponents/chat-interface"
import ThemeRegistry from "@/components/chatcomponents/theme-registry"

export default function Home() {
  return (
    <ThemeRegistry>
      <main style={{ minHeight: "100vh", background: "linear-gradient(to bottom right, #f0f7ff, #ffffff)" }}>
        <ChatInterface />
      </main>
    </ThemeRegistry>
  )
}

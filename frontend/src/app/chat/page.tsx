import ChatInterface from "@/app/components/chatcomponents/chat-interface"
import ThemeRegistry from "@/app/components/chatcomponents/theme-registry"
import styles from "./styles.module.css"

export default function Home() {
  return (
    <ThemeRegistry>
      <main className={styles.mainContainer}>
        <ChatInterface />
      </main>
    </ThemeRegistry>
  )
}

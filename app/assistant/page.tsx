import { Header } from "@/components/header"
import { ChatInterface } from "@/components/assistant/chat-interface"

export default function AssistantPage() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <ChatInterface />
    </div>
  )
}

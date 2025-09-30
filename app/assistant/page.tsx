import { Header } from "@/components/header"
import { ChatInterface } from "@/components/assistant/chat-interface"

export default function AssistantPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <div className="flex-1 min-h-0">
        <ChatInterface />
      </div>
    </div>
  )
}

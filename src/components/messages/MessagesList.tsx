
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message } from "./types";

interface MessagesListProps {
  messages: Message[];
  currentUserId: string | undefined;
}

export function MessagesList({ messages, currentUserId }: MessagesListProps) {
  if (messages.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 pr-4">
      <div className="space-y-4 py-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender_id === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.sender_id === currentUserId
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p>{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(message.created_at).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

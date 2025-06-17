
import { User, Bot } from "lucide-react";
import { RecommendationDisplay } from "./RecommendationDisplay";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  recommendations?: {
    type: 'cars' | 'parts';
    items: any[];
    title: string;
  };
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[90%] space-x-2 ${
          message.isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'
        }`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            message.isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}>
          {message.isUser ? (
            <User className="h-4 w-4" />
          ) : (
            <Bot className="h-4 w-4" />
          )}
        </div>
        <div className="flex flex-col">
          <div className={`rounded-lg px-3 py-2 ${
              message.isUser
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            }`}>
            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
            <p className={`text-xs mt-1 ${
                message.isUser
                  ? 'text-primary-foreground/70'
                  : 'text-muted-foreground'
              }`}>
              {formatTime(message.timestamp)}
            </p>
          </div>
          {message.recommendations && !message.isUser && (
            <div className="mt-2">
              <RecommendationDisplay
                type={message.recommendations.type}
                items={message.recommendations.items}
                title={message.recommendations.title}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

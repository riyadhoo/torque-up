
import { Bot } from "lucide-react";

export function LoadingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex space-x-2 max-w-[80%]">
        <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center flex-shrink-0">
          <Bot className="h-4 w-4" />
        </div>
        <div className="bg-muted rounded-lg px-3 py-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Car } from "lucide-react";

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
}

export function ChatInput({ 
  inputMessage, 
  setInputMessage, 
  onSendMessage, 
  isLoading 
}: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleQuickRecommendation = () => {
    setInputMessage("I need car recommendations. Can you help me find the perfect car?");
    setTimeout(() => onSendMessage(), 100);
  };

  return (
    <div className="border-t p-4 flex-shrink-0">
      <div className="flex space-x-2 mb-2">
        <Button
          onClick={handleQuickRecommendation}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="text-xs"
        >
          <Car className="h-3 w-3 mr-1" />
          Get Car Recommendations
        </Button>
      </div>
      <div className="flex space-x-2">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask for car recommendations, troubleshooting help, or general advice..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button 
          onClick={onSendMessage} 
          disabled={!inputMessage.trim() || isLoading}
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Try: "I need car recommendations" or "My car won't start" for personalized help!
      </p>
    </div>
  );
}

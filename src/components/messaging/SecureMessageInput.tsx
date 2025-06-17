
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { messageValidationSchema, RateLimiter } from "@/lib/validation";
import { toast } from "@/hooks/use-toast";

interface SecureMessageInputProps {
  onSendMessage: (content: string) => Promise<boolean>;
  disabled?: boolean;
  placeholder?: string;
}

// Rate limiter for message sending - 10 messages per minute
const messageLimiter = new RateLimiter(10, 60 * 1000);

export function SecureMessageInput({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Type your message..." 
}: SecureMessageInputProps) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || sending || disabled) return;

    // Rate limiting check
    const clientKey = `message_${Date.now()}`;
    if (!messageLimiter.isAllowed(clientKey)) {
      toast({
        title: "Rate limit exceeded",
        description: "Please wait before sending another message."
      });
      return;
    }

    // Validate and sanitize message content
    try {
      const validationResult = messageValidationSchema.safeParse({ content });
      
      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(err => err.message);
        toast({
          title: "Message validation failed",
          description: errors[0]
        });
        return;
      }

      setSending(true);
      
      const success = await onSendMessage(validationResult.data.content);
      
      if (success) {
        setContent("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message"
      });
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isValid = content.trim().length > 0 && content.length <= 1000;

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 bg-white border-t">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled || sending}
        className="flex-1 min-h-[60px] max-h-[120px] resize-none"
        maxLength={1000}
      />
      <Button
        type="submit"
        disabled={!isValid || disabled || sending}
        size="sm"
        className="self-end"
      >
        <Send className="h-4 w-4" />
      </Button>
      {content.length > 900 && (
        <div className="text-sm text-gray-500 self-end pb-2">
          {content.length}/1000
        </div>
      )}
    </form>
  );
}

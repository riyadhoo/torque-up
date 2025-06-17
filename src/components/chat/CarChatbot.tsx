
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { CarProps } from "@/types/car";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ChatHeader } from "./ChatHeader";
import { LoadingIndicator } from "./LoadingIndicator";
import { Message } from "./types";

interface CarChatbotProps {
  cars: CarProps[];
  isFloating?: boolean;
}

export function CarChatbot({ cars, isFloating = false }: CarChatbotProps) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your automotive assistant. What can I help you with today?\n\n• Looking for a car recommendation?\n• Having car trouble that needs diagnosing?\n• Need help finding specific parts?\n• General automotive advice?\n\nJust tell me what's on your mind!",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          message: inputMessage,
          cars: cars,
          context: {
            // Send last 10 messages for better context retention in recommendation flow
            previousMessages: messages.slice(-10).map(m => ({ text: m.text, isUser: m.isUser }))
          }
        }
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date(),
        recommendations: data.recommendations
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: t('chat.error'),
        description: t('chat.errorDescription')
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFloating) {
    return (
      <div className="h-full flex flex-col">
        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <div className={`space-y-4 ${isMobile ? 'p-3' : 'p-4'}`}>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && <LoadingIndicator />}
          </div>
        </ScrollArea>
        
        <div className={`border-t ${isMobile ? 'p-3' : 'p-4'}`}>
          <ChatInput
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            onSendMessage={sendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col">
      <ChatHeader />
      
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 h-full" ref={scrollAreaRef}>
          <div className="space-y-4 p-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && <LoadingIndicator />}
          </div>
        </ScrollArea>
        
        <div className="border-t p-4">
          <ChatInput
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            onSendMessage={sendMessage}
            isLoading={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
}

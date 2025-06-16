
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";
import { MessagesList } from "./MessagesList";
import { MessageInput } from "./MessageInput";
import type { Message } from "./types";

interface MessagesContainerProps {
  selectedUserId: string | null;
  displayUserInfo: { username: string; avatar_url: string | null } | null;
  messages: Message[];
  currentUserId: string | undefined;
  onSendMessage: (content: string) => Promise<boolean>;
  onBack: () => void;
}

export function MessagesContainer({
  selectedUserId,
  displayUserInfo,
  messages,
  currentUserId,
  onSendMessage,
  onBack
}: MessagesContainerProps) {
  if (!selectedUserId) {
    return (
      <Card className="md:col-span-2">
        <CardContent className="flex items-center justify-center h-[calc(100vh-16rem)]">
          <div className="text-center text-muted-foreground">
            <p>Select a conversation to start messaging</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="md:col-span-2">
      <CardHeader className="border-b">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="md:hidden"
          >
            <ArrowLeft size={16} />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src={displayUserInfo?.avatar_url || undefined} />
            <AvatarFallback>
              {displayUserInfo?.username?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <CardTitle>{displayUserInfo?.username || "Unknown User"}</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-col h-[calc(100vh-16rem)]">
        <MessagesList messages={messages} currentUserId={currentUserId} />
        <MessageInput onSendMessage={onSendMessage} />
      </CardContent>
    </Card>
  );
}

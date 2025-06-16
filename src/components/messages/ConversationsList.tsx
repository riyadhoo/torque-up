
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Conversation } from "./types";

interface ConversationsListProps {
  conversations: Conversation[];
  selectedUserId: string | null;
  onSelectConversation: (userId: string) => void;
}

export function ConversationsList({ 
  conversations, 
  selectedUserId, 
  onSelectConversation 
}: ConversationsListProps) {
  console.log("ConversationsList rendering with:", { 
    conversationsCount: conversations.length, 
    conversations,
    selectedUserId 
  });

  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle>Messages ({conversations.length})</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-12rem)]">
          {conversations.length > 0 ? (
            conversations.map((conversation) => {
              console.log("Rendering conversation:", conversation);
              return (
                <div
                  key={conversation.user_id}
                  className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedUserId === conversation.user_id ? "bg-muted" : ""
                  }`}
                  onClick={() => onSelectConversation(conversation.user_id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.avatar_url || undefined} />
                      <AvatarFallback>
                        {conversation.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">
                          {conversation.username || "Unknown User"}
                        </p>
                        {conversation.unread_count > 0 && (
                          <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {conversation.unread_count}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.last_message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No conversations yet
              <br />
              <small className="text-xs">Debug: Check console for details</small>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

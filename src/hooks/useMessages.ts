
import { useEffect } from "react";
import { useEnhancedAuth } from "@/lib/securityAuth";
import { useConversations } from "./messaging/useConversations";
import { useCurrentConversation } from "./messaging/useCurrentConversation";

export function useMessages() {
  const { user, isAuthenticated } = useEnhancedAuth();
  
  const {
    conversations,
    isLoading,
    fetchConversations
  } = useConversations(user?.id);

  const {
    selectedUserId,
    setSelectedUserId,
    selectedUserInfo,
    messages,
    sendMessage,
    fetchMessages
  } = useCurrentConversation(user?.id);

  useEffect(() => {
    console.log("useMessages: Auth state changed", { user: user?.id, isAuthenticated });
    
    if (!isAuthenticated || !user?.id) {
      console.log("useMessages: User not authenticated, clearing state");
      return;
    }
  }, [user?.id, isAuthenticated]);

  const handleSendMessage = async (content: string) => {
    const success = await sendMessage(content, () => {
      // Refresh conversations after sending message
      fetchConversations();
    });
    return success;
  };

  return {
    conversations,
    selectedUserId,
    setSelectedUserId,
    selectedUserInfo,
    messages,
    isLoading,
    sendMessage: handleSendMessage,
    fetchConversations,
    fetchMessages
  };
}

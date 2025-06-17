
import { useState, useEffect } from "react";
import type { Conversation } from "@/components/messages/types";
import { 
  fetchUserMessages, 
  fetchUserProfiles, 
  fetchUserInfo 
} from "./utils/conversationQueries";
import { 
  processMessagesToConversations, 
  addTargetUserToConversations 
} from "./utils/conversationProcessors";
import { 
  useTargetUserId, 
  handleEmptyConversations, 
  getUniqueUserIds 
} from "./utils/conversationHelpers";

export function useConversations(userId: string | undefined) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const targetUserId = useTargetUserId();

  const fetchConversations = async () => {
    if (!userId) {
      console.log("fetchConversations: No user ID available");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log("fetchConversations: Starting fetch for user:", userId);
      
      // Fetch all messages involving the current user
      const messagesData = await fetchUserMessages(userId);
      if (!messagesData) {
        setIsLoading(false);
        return;
      }

      // Handle empty messages case
      if (messagesData.length === 0) {
        const emptyConversations = await handleEmptyConversations(targetUserId);
        setConversations(emptyConversations);
        setIsLoading(false);
        return;
      }

      // Get unique user IDs and fetch their profiles
      const userIds = getUniqueUserIds(messagesData, userId);
      const profilesData = await fetchUserProfiles(userIds);

      // Process messages to create conversations
      let conversationsList = processMessagesToConversations(messagesData, profilesData, userId);
      
      // Add target user from URL if not in conversations
      if (targetUserId) {
        const userData = await fetchUserInfo(targetUserId);
        conversationsList = addTargetUserToConversations(conversationsList, targetUserId, userData);
      }
      
      setConversations(conversationsList);
      console.log("fetchConversations: Final conversations set:", conversationsList);
    } catch (error) {
      console.error("fetchConversations: Error in catch block:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchConversations();
    }
  }, [userId, targetUserId]);

  return {
    conversations,
    isLoading,
    fetchConversations
  };
}

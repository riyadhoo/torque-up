
import { useSearchParams } from "react-router-dom";
import { fetchUserInfo } from "./conversationQueries";
import { createNewConversation } from "./conversationProcessors";
import type { Conversation } from "@/components/messages/types";

export function useTargetUserId() {
  const [searchParams] = useSearchParams();
  return searchParams.get("user");
}

export async function handleEmptyConversations(targetUserId: string | null): Promise<Conversation[]> {
  console.log("handleEmptyConversations: No messages found, checking for target user from URL");
  
  if (!targetUserId) {
    console.log("handleEmptyConversations: No target user, setting empty conversations");
    return [];
  }

  const userData = await fetchUserInfo(targetUserId);
  if (!userData) {
    return [];
  }

  const newConversation = createNewConversation(targetUserId, userData);
  console.log("handleEmptyConversations: Created new conversation for target user:", newConversation);
  return [newConversation];
}

export function getUniqueUserIds(messages: any[], currentUserId: string): string[] {
  const userIds = new Set<string>();
  messages.forEach((message: any) => {
    const partnerId = message.sender_id === currentUserId ? message.recipient_id : message.sender_id;
    userIds.add(partnerId);
  });
  return Array.from(userIds);
}

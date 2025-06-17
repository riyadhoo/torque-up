
import type { Conversation } from "@/components/messages/types";

interface ProcessedMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
}

export function processMessagesToConversations(
  messages: ProcessedMessage[],
  profiles: Profile[],
  currentUserId: string
): Conversation[] {
  console.log("processMessagesToConversations: Processing messages:", messages);
  
  // Create a map of profiles for quick lookup
  const profilesMap = new Map<string, Profile>();
  profiles.forEach(profile => {
    profilesMap.set(profile.id, profile);
  });

  // Group messages by conversation partner
  const conversationMap = new Map<string, Conversation>();
  
  messages.forEach((message: ProcessedMessage) => {
    const isReceived = message.recipient_id === currentUserId;
    const partnerId = isReceived ? message.sender_id : message.recipient_id;
    const partner = profilesMap.get(partnerId);
    
    console.log("processMessagesToConversations: Processing message:", {
      messageId: message.id,
      isReceived,
      partnerId,
      partner: partner?.username
    });

    if (!conversationMap.has(partnerId)) {
      conversationMap.set(partnerId, {
        user_id: partnerId,
        username: partner?.username || "Unknown User",
        avatar_url: partner?.avatar_url,
        last_message: message.content,
        last_message_time: message.created_at,
        unread_count: 0
      });
    }
    
    if (isReceived && !message.is_read) {
      const conv = conversationMap.get(partnerId)!;
      conv.unread_count++;
    }
  });

  const conversationsList = Array.from(conversationMap.values());
  console.log("processMessagesToConversations: Processed conversations:", conversationsList);
  
  return conversationsList;
}

export function createNewConversation(userId: string, userData: { username: string; avatar_url: string | null }): Conversation {
  const newConversation: Conversation = {
    user_id: userId,
    username: userData.username || "Unknown User",
    avatar_url: userData.avatar_url,
    last_message: "Start a conversation...",
    last_message_time: new Date().toISOString(),
    unread_count: 0
  };
  
  console.log("createNewConversation: Created new conversation:", newConversation);
  return newConversation;
}

export function addTargetUserToConversations(
  conversations: Conversation[],
  targetUserId: string,
  userData: { username: string; avatar_url: string | null } | null
): Conversation[] {
  if (!targetUserId || !userData || conversations.find(c => c.user_id === targetUserId)) {
    return conversations;
  }

  const newConversation = createNewConversation(targetUserId, userData);
  return [newConversation, ...conversations];
}


import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Message, Conversation } from "@/components/messages/types";

export function useMessagesApi() {
  const fetchUserInfo = async (userId: string) => {
    try {
      console.log("fetchUserInfo: Fetching user info for", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user info:", error);
        return null;
      }

      console.log("fetchUserInfo: User info fetched", data);
      return data;
    } catch (error) {
      console.error("Error in fetchUserInfo:", error);
      return null;
    }
  };

  const fetchMessagesForConversation = async (userId: string, currentUserId: string) => {
    try {
      console.log("fetchMessages: Fetching messages between", currentUserId, "and", userId);
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${currentUserId},recipient_id.eq.${userId}),and(sender_id.eq.${userId},recipient_id.eq.${currentUserId})`)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("fetchMessages: Error fetching messages:", error);
        return [];
      }

      console.log("fetchMessages: Fetched messages:", data);
      
      // Mark unread messages as read
      const unreadMessages = data?.filter(msg => 
        msg.recipient_id === currentUserId && !msg.is_read
      );

      if (unreadMessages && unreadMessages.length > 0) {
        await supabase
          .from("messages")
          .update({ is_read: true })
          .in("id", unreadMessages.map(msg => msg.id));
      }

      return data || [];
    } catch (error) {
      console.error("fetchMessages: Error in catch block:", error);
      return [];
    }
  };

  const sendMessageToUser = async (content: string, recipientId: string, senderId: string) => {
    if (!content.trim()) {
      console.log("sendMessage: Empty content");
      return false;
    }

    try {
      console.log("sendMessage: Sending message:", { content, from: senderId, to: recipientId });
      const { error } = await supabase
        .from("messages")
        .insert({
          sender_id: senderId,
          recipient_id: recipientId,
          content: content.trim()
        });

      if (error) {
        console.error("sendMessage: Error sending message:", error);
        toast({
          title: "Error",
          description: "Failed to send message"
        });
        return false;
      }

      console.log("sendMessage: Message sent successfully");
      return true;
    } catch (error) {
      console.error("sendMessage: Error in catch block:", error);
      return false;
    }
  };

  return {
    fetchUserInfo,
    fetchMessagesForConversation,
    sendMessageToUser
  };
}

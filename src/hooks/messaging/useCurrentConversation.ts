
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useMessagesApi } from "./useMessagesApi";
import type { Message } from "@/components/messages/types";

export function useCurrentConversation(userId: string | undefined) {
  const [searchParams] = useSearchParams();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserInfo, setSelectedUserInfo] = useState<{ username: string; avatar_url: string | null } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const { fetchUserInfo, fetchMessagesForConversation, sendMessageToUser } = useMessagesApi();

  useEffect(() => {
    const targetUserId = searchParams.get("user");
    if (targetUserId) {
      setSelectedUserId(targetUserId);
      fetchUserInfoForSelected(targetUserId);
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedUserId && userId) {
      fetchMessages(selectedUserId);
    }
  }, [selectedUserId, userId]);

  const fetchUserInfoForSelected = async (targetUserId: string) => {
    if (!userId) {
      console.log("fetchUserInfo: No authenticated user");
      return;
    }

    const userInfo = await fetchUserInfo(targetUserId);
    if (userInfo) {
      setSelectedUserInfo(userInfo);
    }
  };

  const fetchMessages = async (targetUserId: string) => {
    if (!userId) {
      console.log("fetchMessages: No authenticated user");
      return;
    }

    const fetchedMessages = await fetchMessagesForConversation(targetUserId, userId);
    setMessages(fetchedMessages);
  };

  const sendMessage = async (content: string, onSuccess?: () => void) => {
    if (!content.trim() || !selectedUserId || !userId) {
      console.log("sendMessage: Missing required data", { content: !!content.trim(), selectedUserId, userId });
      return false;
    }

    const success = await sendMessageToUser(content, selectedUserId, userId);
    if (success) {
      await fetchMessages(selectedUserId);
      onSuccess?.();
    }
    return success;
  };

  return {
    selectedUserId,
    setSelectedUserId,
    selectedUserInfo,
    messages,
    sendMessage,
    fetchMessages
  };
}

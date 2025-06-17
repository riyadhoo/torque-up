
import { supabase } from "@/integrations/supabase/client";

export async function fetchUserMessages(userId: string) {
  console.log("fetchUserMessages: Starting fetch for user:", userId);
  
  const { data: messagesData, error } = await supabase
    .from("messages")
    .select("*")
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchUserMessages: Error fetching messages:", error);
    return null;
  }

  console.log("fetchUserMessages: Raw messages data:", messagesData);
  return messagesData || [];
}

export async function fetchUserProfiles(userIds: string[]) {
  if (userIds.length === 0) return [];
  
  const { data: profilesData, error: profilesError } = await supabase
    .from("profiles")
    .select("id, username, avatar_url")
    .in("id", userIds);

  if (profilesError) {
    console.error("fetchUserProfiles: Error fetching profiles:", profilesError);
    return [];
  }

  return profilesData || [];
}

export async function fetchUserInfo(userId: string) {
  const { data: userData, error: userError } = await supabase
    .from("profiles")
    .select("username, avatar_url")
    .eq("id", userId)
    .single();

  if (userError) {
    console.error("fetchUserInfo: Error fetching user data:", userError);
    return null;
  }

  return userData;
}

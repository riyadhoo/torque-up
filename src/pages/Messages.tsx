
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { useMessages } from "@/hooks/useMessages";
import { ConversationsList } from "@/components/messages/ConversationsList";
import { MessagesContainer } from "@/components/messages/MessagesContainer";

export default function Messages() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const {
    conversations,
    selectedUserId,
    setSelectedUserId,
    selectedUserInfo,
    messages,
    isLoading,
    sendMessage
  } = useMessages();

  useEffect(() => {
    console.log("Messages page: Auth state", { isAuthenticated, userId: user?.id });
    if (!isAuthenticated) {
      console.log("Messages page: Redirecting to login");
      navigate("/login");
      return;
    }
  }, [isAuthenticated, navigate, user?.id]);

  const selectedConversation = conversations.find(c => c.user_id === selectedUserId);
  const displayUserInfo = selectedConversation || selectedUserInfo;

  // Show loading while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] pt-16">
          <div className="text-foreground">Redirecting to login...</div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] pt-16">
          <div className="text-foreground">Loading messages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-6xl py-6 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
          <ConversationsList
            conversations={conversations}
            selectedUserId={selectedUserId}
            onSelectConversation={setSelectedUserId}
          />
          
          <MessagesContainer
            selectedUserId={selectedUserId}
            displayUserInfo={displayUserInfo}
            messages={messages}
            currentUserId={user?.id}
            onSendMessage={sendMessage}
            onBack={() => setSelectedUserId(null)}
          />
        </div>
      </div>
    </div>
  );
}

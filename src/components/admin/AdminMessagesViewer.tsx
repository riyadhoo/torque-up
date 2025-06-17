
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { MessageSquare, User } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  is_read: boolean;
  created_at: string;
}

export function AdminMessagesViewer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100); // Limit to recent 100 messages

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error({
        title: "Error",
        description: "Failed to fetch messages"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) {
    return <div className="text-center">Loading messages...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Messages Overview
        </CardTitle>
        <CardDescription>
          View recent messages between users (latest 100)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((message) => (
              <TableRow key={message.id}>
                <TableCell className="font-mono text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {message.sender_id.slice(0, 8)}...
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {message.recipient_id.slice(0, 8)}...
                  </div>
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate">
                    {message.content}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={message.is_read ? "default" : "secondary"}>
                    {message.is_read ? "Read" : "Unread"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(message.created_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
            {messages.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No messages found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

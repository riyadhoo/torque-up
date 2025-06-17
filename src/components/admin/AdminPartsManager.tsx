
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Clock, Trash2, Eye, RotateCcw } from "lucide-react";

interface Part {
  id: string;
  title: string;
  price: number;
  condition: string;
  approval_status: string;
  created_at: string;
  seller_id: string;
}

export function AdminPartsManager() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchParts = async () => {
    try {
      const { data, error } = await supabase
        .from('parts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setParts(data || []);
    } catch (error) {
      console.error('Error fetching parts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch parts"
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePartStatus = async (partId: string, status: 'approved' | 'rejected' | 'pending') => {
    try {
      const { error } = await supabase
        .from('parts')
        .update({ approval_status: status })
        .eq('id', partId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Part ${status} successfully`,
      });

      fetchParts(); // Refresh the list
    } catch (error) {
      console.error('Error updating part status:', error);
      toast({
        title: "Error",
        description: "Failed to update part status"
      });
    }
  };

  const deletePart = async (partId: string) => {
    try {
      const { error } = await supabase
        .from('parts')
        .delete()
        .eq('id', partId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Part deleted successfully",
      });

      fetchParts(); // Refresh the list
    } catch (error) {
      console.error('Error deleting part:', error);
      toast({
        title: "Error",
        description: "Failed to delete part"
      });
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const renderActionButtons = (part: Part) => {
    return (
      <div className="flex items-center gap-2">
        {part.approval_status === 'pending' && (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => updatePartStatus(part.id, 'approved')}
              className="bg-green-50 hover:bg-green-100"
              title="Approve"
            >
              <CheckCircle className="h-4 w-4 text-green-600" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => updatePartStatus(part.id, 'rejected')}
              className="bg-red-50 hover:bg-red-100"
              title="Reject"
            >
              <XCircle className="h-4 w-4 text-red-600" />
            </Button>
          </>
        )}
        
        {part.approval_status === 'approved' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => updatePartStatus(part.id, 'pending')}
            className="bg-yellow-50 hover:bg-yellow-100"
            title="Move to Pending"
          >
            <RotateCcw className="h-4 w-4 text-yellow-600" />
          </Button>
        )}
        
        {part.approval_status === 'rejected' && (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => updatePartStatus(part.id, 'approved')}
              className="bg-green-50 hover:bg-green-100"
              title="Approve"
            >
              <CheckCircle className="h-4 w-4 text-green-600" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => updatePartStatus(part.id, 'pending')}
              className="bg-yellow-50 hover:bg-yellow-100"
              title="Move to Pending"
            >
              <RotateCcw className="h-4 w-4 text-yellow-600" />
            </Button>
          </>
        )}
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => window.open(`/parts/${part.id}`, '_blank')}
          title="View Part"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => deletePart(part.id)}
          className="bg-red-50 hover:bg-red-100"
          title="Delete Part"
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center">Loading parts...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parts Management</CardTitle>
        <CardDescription>
          Review and manage all parts listings. You can change status between pending and approved.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parts.map((part) => (
              <TableRow key={part.id}>
                <TableCell className="font-medium">
                  {part.title}
                </TableCell>
                <TableCell>
                  {part.price} Da
                </TableCell>
                <TableCell>
                  {part.condition}
                </TableCell>
                <TableCell>
                  {getStatusBadge(part.approval_status)}
                </TableCell>
                <TableCell>
                  {new Date(part.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {renderActionButtons(part)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

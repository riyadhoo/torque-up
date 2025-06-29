
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PartListing {
  id: string;
  title: string;
  price: number;
  condition: string;
  image_url: string | null;
  created_at: string;
  approval_status?: string;
}

interface UserListingsProps {
  listings: PartListing[];
  showAddButton?: boolean;
  showStatus?: boolean;
  onListingDeleted?: () => void;
}

export function UserListings({ listings, showAddButton = false, showStatus = false, onListingDeleted }: UserListingsProps) {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (listingId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/parts/edit/${listingId}`);
  };

  const handleDeleteClick = (listingId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setListingToDelete(listingId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!listingToDelete) return;

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('parts')
        .delete()
        .eq('id', listingToDelete);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Listing deleted successfully"
      });

      if (onListingDeleted) {
        onListingDeleted();
      }
    } catch (error: any) {
      console.error("Error deleting listing:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete listing"
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setListingToDelete(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Listings ({listings.length})</CardTitle>
            {showAddButton && (
              <Button onClick={() => navigate('/parts/create')} className="flex items-center gap-2">
                <Plus size={16} />
                Add Part
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((listing) => (
                <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow relative group">
                  <div className="aspect-video relative overflow-hidden cursor-pointer" onClick={() => navigate(`/parts/${listing.id}`)}>
                    {listing.image_url ? (
                      <img 
                        src={listing.image_url} 
                        alt={listing.title} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <p className="text-muted-foreground">No image</p>
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary">{listing.condition}</Badge>
                    </div>
                    {showStatus && listing.approval_status && (
                      <div className="absolute top-2 right-2">
                        <Badge className={getStatusColor(listing.approval_status)}>
                          {listing.approval_status}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-medium text-lg mb-1 cursor-pointer" onClick={() => navigate(`/parts/${listing.id}`)}>{listing.title}</h3>
                    <p className="text-2xl font-bold mb-2">{listing.price.toFixed(2)} Da</p>
                    <div className="text-xs text-muted-foreground mb-3">
                      Listed on {new Date(listing.created_at).toLocaleDateString()}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleEdit(listing.id, e)}
                        className="flex items-center gap-1 flex-1"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleDeleteClick(listing.id, e)}
                        className="flex items-center gap-1 flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No listings found</p>
              {showAddButton && (
                <Button onClick={() => navigate('/parts/create')} className="flex items-center gap-2 mx-auto">
                  <Plus size={16} />
                  Add Part
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this listing? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

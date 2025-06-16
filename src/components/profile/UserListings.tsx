
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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
}

export function UserListings({ listings, showAddButton = false, showStatus = false }: UserListingsProps) {
  const navigate = useNavigate();

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

  return (
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
              <Card key={listing.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/parts/${listing.id}`)}>
                <div className="aspect-video relative overflow-hidden">
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
                  <h3 className="font-medium text-lg mb-1">{listing.title}</h3>
                  <p className="text-2xl font-bold mb-2">{listing.price.toFixed(2)} Da</p>
                  <div className="text-xs text-muted-foreground">
                    Listed on {new Date(listing.created_at).toLocaleDateString()}
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
  );
}

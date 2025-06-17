
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Store, MapPin, Phone, Globe, Clock, Plus, Star, Edit, Save, X, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StoreProfileData {
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  store_name: string | null;
  store_description: string | null;
  store_address: string | null;
  store_phone: string | null;
  store_website: string | null;
  store_opening_hours: string | null;
}

interface PartListing {
  id: string;
  title: string;
  price: number;
  condition: string;
  image_url: string | null;
  created_at: string;
  approval_status: string;
  compatible_cars: string[] | null;
}

export function StoreProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<StoreProfileData>({
    username: "",
    bio: "",
    avatar_url: null,
    phone_number: null,
    store_name: "",
    store_description: "",
    store_address: "",
    store_phone: "",
    store_website: "",
    store_opening_hours: ""
  });
  const [listings, setListings] = useState<PartListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();
          
        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Error fetching profile:", profileError);
          toast({
            title: "Error",
            description: "Failed to load store profile"
          });
        } else if (profileData) {
          setProfileData({
            username: profileData.username || "",
            bio: profileData.bio || "",
            avatar_url: profileData.avatar_url,
            phone_number: profileData.phone_number || "",
            store_name: profileData.store_name || "",
            store_description: profileData.store_description || "",
            store_address: profileData.store_address || "",
            store_phone: profileData.store_phone || "",
            store_website: profileData.store_website || "",
            store_opening_hours: profileData.store_opening_hours || ""
          });
          
          if (profileData.avatar_url) {
            try {
              const { data: publicUrlData } = supabase.storage
                .from("avatars")
                .getPublicUrl(profileData.avatar_url);
                
              if (publicUrlData) {
                setAvatarPreview(publicUrlData.publicUrl);
              }
            } catch (err) {
              console.error("Error getting avatar URL:", err);
            }
          }
        }

        // Fetch store listings
        const { data: listingsData, error: listingsError } = await supabase
          .from("parts")
          .select("*")
          .eq("seller_id", user.id)
          .order("created_at", { ascending: false });
          
        if (listingsError) {
          console.error("Error fetching listings:", listingsError);
          toast({
            title: "Error",
            description: "Failed to load store listings"
          });
        } else if (listingsData) {
          const enhancedListings = listingsData.map(listing => {
            let publicImageUrl = listing.image_url;
            
            if (listing.image_url && !listing.image_url.startsWith('http')) {
              try {
                const { data: urlData } = supabase.storage
                  .from("parts")
                  .getPublicUrl(listing.image_url);
                  
                if (urlData) {
                  publicImageUrl = urlData.publicUrl;
                }
              } catch (err) {
                console.error(`Error getting URL for image ${listing.image_url}:`, err);
              }
            }
            
            return {
              ...listing,
              image_url: publicImageUrl
            };
          });
          
          setListings(enhancedListings);
        }
      } catch (error) {
        console.error("Error in fetchStoreData:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreData();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    try {
      setIsSaving(true);
      
      // Upload avatar if a new one is selected
      let avatarPath = profileData.avatar_url;
      
      if (avatarFile) {
        const fileName = `${user.id}-${Date.now()}.${avatarFile.name.split('.').pop()}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, avatarFile, {
            upsert: true,
          });
          
        if (uploadError) {
          console.error("Avatar upload error:", uploadError);
          throw new Error(`Failed to upload avatar: ${uploadError.message}`);
        }
        
        if (uploadData) {
          avatarPath = fileName;
        }
      }
      
      // Update profile data
      const updateData = {
        id: user.id,
        username: profileData.username,
        bio: profileData.bio,
        avatar_url: avatarPath,
        phone_number: profileData.phone_number,
        store_name: profileData.store_name,
        store_description: profileData.store_description,
        store_address: profileData.store_address,
        store_phone: profileData.store_phone,
        store_website: profileData.store_website,
        store_opening_hours: profileData.store_opening_hours,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from("profiles")
        .upsert(updateData);
        
      if (error) {
        console.error("Profile update error:", error);
        throw new Error(`Failed to update profile: ${error.message}`);
      }
      
      setIsEditing(false);
      toast({
        title: "Store profile updated",
        description: "Your store profile has been successfully updated."
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update store profile"
      });
    } finally {
      setIsSaving(false);
    }
  };

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

  if (isLoading) {
    return <div className="text-center py-8 text-foreground">Loading store...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-6xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Store className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">My Store</h1>
          <div className="ml-auto flex gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={isSaving} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Store Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={avatarPreview || undefined} alt="Store logo" />
                  <AvatarFallback className="bg-muted text-muted-foreground text-2xl">
                    {profileData.store_name ? profileData.store_name.charAt(0).toUpperCase() : 'S'}
                  </AvatarFallback>
                </Avatar>
                
                {isEditing && (
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="w-40 text-xs"
                  />
                )}
              </div>
              
              <div className="flex-1 space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Store Name</label>
                      <Input
                        name="store_name"
                        value={profileData.store_name || ""}
                        onChange={handleChange}
                        placeholder="Enter your store name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Store Description</label>
                      <Textarea
                        name="store_description"
                        value={profileData.store_description || ""}
                        onChange={handleChange}
                        placeholder="Describe your store"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <User size={16} />
                          Owner Name
                        </label>
                        <Input
                          name="username"
                          value={profileData.username || ""}
                          onChange={handleChange}
                          placeholder="Store owner name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Phone size={16} />
                          Personal Phone
                        </label>
                        <Input
                          name="phone_number"
                          value={profileData.phone_number || ""}
                          onChange={handleChange}
                          placeholder="Personal phone number"
                          type="tel"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <MapPin size={16} />
                          Store Address
                        </label>
                        <Input
                          name="store_address"
                          value={profileData.store_address || ""}
                          onChange={handleChange}
                          placeholder="Store address"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Phone size={16} />
                          Store Phone
                        </label>
                        <Input
                          name="store_phone"
                          value={profileData.store_phone || ""}
                          onChange={handleChange}
                          placeholder="Store phone number"
                          type="tel"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Globe size={16} />
                          Website
                        </label>
                        <Input
                          name="store_website"
                          value={profileData.store_website || ""}
                          onChange={handleChange}
                          placeholder="https://your-store-website.com"
                          type="url"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Clock size={16} />
                          Opening Hours
                        </label>
                        <Input
                          name="store_opening_hours"
                          value={profileData.store_opening_hours || ""}
                          onChange={handleChange}
                          placeholder="e.g., Mon-Fri: 9AM-6PM"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold">
                      {profileData.store_name || "Store Name"}
                    </h2>
                    <p className="text-muted-foreground">
                      {profileData.store_description || "Store description goes here"}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {profileData.username && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>Owner: {profileData.username}</span>
                        </div>
                      )}
                      {profileData.store_address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{profileData.store_address}</span>
                        </div>
                      )}
                      {profileData.store_phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{profileData.store_phone}</span>
                        </div>
                      )}
                      {profileData.store_website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <a href={profileData.store_website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            Visit Website
                          </a>
                        </div>
                      )}
                      {profileData.store_opening_hours && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{profileData.store_opening_hours}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
              
              {!isEditing && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">4.8</span>
                    <span className="text-muted-foreground">(24 reviews)</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Listings Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold">Store Inventory</h3>
            <p className="text-muted-foreground">
              {listings.length} parts total
            </p>
          </div>
          <Button onClick={() => navigate('/parts/create')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Part
          </Button>
        </div>

        {listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <Card 
                key={listing.id} 
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/parts/${listing.id}`)}
              >
                <div className="aspect-video relative">
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
                  <div className="absolute top-2 right-2">
                    <Badge className={getStatusColor(listing.approval_status)}>
                      {listing.approval_status}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h4 className="font-medium text-lg mb-1">{listing.title}</h4>
                  <p className="text-2xl font-bold mb-2">{listing.price.toFixed(2)} Da</p>
                  {listing.compatible_cars && listing.compatible_cars.length > 0 && (
                    <p className="text-sm text-muted-foreground mb-2">
                      Compatible: {listing.compatible_cars.join(', ')}
                    </p>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Listed on {new Date(listing.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Store className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No parts in inventory</h3>
              <p className="text-muted-foreground mb-6">
                Start building your inventory by adding parts to your store.
              </p>
              <Button onClick={() => navigate('/parts/create')} className="flex items-center gap-2 mx-auto">
                <Plus className="h-4 w-4" />
                Add Your First Part
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

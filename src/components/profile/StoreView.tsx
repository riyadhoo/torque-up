import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import Navbar from "@/components/layout/Navbar";
import { toast } from "@/hooks/use-toast";
import { Store, MapPin, Phone, Globe, Clock, Search, Star, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface StoreData {
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
  compatible_cars: string[] | null;
}

export function StoreView() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState<StoreData>({
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
  const [filteredListings, setFilteredListings] = useState<PartListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<number[]>([0, 50000]);
  const [conditions, setConditions] = useState<Record<string, boolean>>({});
  const [carMakes, setCarMakes] = useState<Record<string, boolean>>({});

  const conditionOptions = ["New", "Used", "Refurbished"];
  const carMakeOptions = ["Renault", "Dacia", "Toyota", "Peugeot", "Hyundai", "Volkswagen", "Chevrolet", "Chery", "Kia", "Citroën"];

  useEffect(() => {
    const fetchStoreData = async () => {
      if (!userId) return;
      
      try {
        setIsLoading(true);
        
        // Fetch store profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();
          
        if (profileError) {
          console.error("Error fetching store profile:", profileError);
          toast({
            title: "Error",
            description: "Failed to load store profile"
          });
          return;
        }

        if (profileData) {
          setStoreData({
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

        // Fetch store's approved listings only
        const { data: listingsData, error: listingsError } = await supabase
          .from("parts")
          .select("*")
          .eq("seller_id", userId)
          .eq("approval_status", "approved")
          .order("created_at", { ascending: false });
          
        if (listingsError) {
          console.error("Error fetching listings:", listingsError);
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
  }, [userId]);

  // Apply filters
  useEffect(() => {
    let filtered = listings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.compatible_cars?.some(car => 
          car.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Price range filter
    filtered = filtered.filter(listing => 
      listing.price >= priceRange[0] && listing.price <= priceRange[1]
    );

    // Condition filter
    const selectedConditions = Object.keys(conditions).filter(key => conditions[key]);
    if (selectedConditions.length > 0) {
      filtered = filtered.filter(listing => 
        selectedConditions.includes(listing.condition)
      );
    }

    // Car make filter
    const selectedMakes = Object.keys(carMakes).filter(key => carMakes[key]);
    if (selectedMakes.length > 0) {
      filtered = filtered.filter(listing => 
        listing.compatible_cars?.some(car => 
          selectedMakes.some(make => 
            car.toLowerCase().includes(make.toLowerCase())
          )
        )
      );
    }

    setFilteredListings(filtered);
  }, [listings, searchTerm, priceRange, conditions, carMakes]);

  const handleConditionChange = (condition: string, checked: boolean) => {
    setConditions(prev => ({ ...prev, [condition]: checked }));
  };

  const handleCarMakeChange = (make: string, checked: boolean) => {
    setCarMakes(prev => ({ ...prev, [make]: checked }));
  };

  const resetFilters = () => {
    setSearchTerm("");
    setPriceRange([0, 50000]);
    setConditions({});
    setCarMakes({});
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] pt-16">
          <div className="text-foreground">Loading store...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-7xl py-10 pt-24">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block md:w-1/4`}>
            <div className="bg-card rounded-lg shadow-sm border p-4 sticky top-24">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  className="md:hidden"
                >
                  ×
                </Button>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium">Price Range</h4>
                  <div className="text-xs text-muted-foreground">
                    {priceRange[0]} - {priceRange[1]} DA
                  </div>
                </div>
                <Slider
                  defaultValue={[0, 50000]}
                  max={50000}
                  step={100}
                  onValueChange={(value) => setPriceRange(value)}
                  value={priceRange}
                />
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="condition">
                  <AccordionTrigger className="text-sm font-medium">
                    Condition
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {conditionOptions.map((condition, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`condition-${i}`}
                            checked={conditions[condition] || false}
                            onCheckedChange={(checked) => 
                              handleConditionChange(condition, checked === true)
                            }
                          />
                          <label htmlFor={`condition-${i}`} className="text-sm">
                            {condition}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="car-make">
                  <AccordionTrigger className="text-sm font-medium">
                    Car Make
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {carMakeOptions.map((make, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`car-make-${i}`}
                            checked={carMakes[make.toLowerCase()] || false}
                            onCheckedChange={(checked) => 
                              handleCarMakeChange(make.toLowerCase(), checked === true)
                            }
                          />
                          <label htmlFor={`car-make-${i}`} className="text-sm">
                            {make}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="mt-6 space-y-2">
                <Button variant="outline" className="w-full" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Store Header */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarPreview || undefined} alt="Store logo" />
                    <AvatarFallback className="bg-muted text-muted-foreground text-2xl">
                      {storeData.store_name ? storeData.store_name.charAt(0).toUpperCase() : 'S'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">
                      {storeData.store_name || "Store Name"}
                    </h1>
                    <p className="text-muted-foreground mb-4">
                      {storeData.store_description || "Store description goes here"}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {storeData.store_address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{storeData.store_address}</span>
                        </div>
                      )}
                      {storeData.store_phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{storeData.store_phone}</span>
                        </div>
                      )}
                      {storeData.store_website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <a href={storeData.store_website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            Visit Website
                          </a>
                        </div>
                      )}
                      {storeData.store_opening_hours && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{storeData.store_opening_hours}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">4.8</span>
                      <span className="text-muted-foreground">(24 reviews)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search parts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Parts Grid */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Available Parts ({filteredListings.length})
              </h2>
              
              {filteredListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredListings.map((listing) => (
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
                      </div>
                      
                      <CardContent className="p-4">
                        <h3 className="font-medium text-lg mb-1">{listing.title}</h3>
                        <p className="text-2xl font-bold mb-2 text-primary">{listing.price.toFixed(2)} Da</p>
                        {listing.compatible_cars && listing.compatible_cars.length > 0 && (
                          <p className="text-sm text-muted-foreground mb-2">
                            Compatible: {listing.compatible_cars.join(', ')}
                          </p>
                        )}
                        <div className="text-xs text-muted-foreground">
                          Listed {new Date(listing.created_at).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Store className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No parts available</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || Object.values(conditions).some(Boolean) || Object.values(carMakes).some(Boolean)
                        ? "No parts match your search criteria."
                        : "This store doesn't have any parts listed yet."
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
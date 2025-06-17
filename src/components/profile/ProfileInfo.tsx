
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Phone, User } from "lucide-react";

interface ProfileData {
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  user_type: 'individual' | 'store' | null;
  store_name: string | null;
  store_description: string | null;
  store_address: string | null;
  store_phone: string | null;
  store_website: string | null;
  store_opening_hours: string | null;
}

export function ProfileInfo() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    username: "",
    bio: "",
    avatar_url: null,
    phone_number: "",
    user_type: null,
    store_name: "",
    store_description: "",
    store_address: "",
    store_phone: "",
    store_website: "",
    store_opening_hours: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error("Error fetching profile:", error);
          toast({
            title: "Error",
            description: "Failed to load profile data"
          });
          return;
        }
        
        if (!data) {
          // If profile doesn't exist, create one with user metadata
          const userMetadata = user.user_metadata || {};
          const newProfileData = {
            id: user.id,
            username: userMetadata.username || null,
            phone_number: userMetadata.phone_number || null,
            user_type: userMetadata.user_type || 'individual',
            store_name: userMetadata.storeName || null,
            store_description: userMetadata.storeDescription || null,
            store_address: userMetadata.storeAddress || null,
            store_phone: userMetadata.storePhone || null,
            store_website: userMetadata.storeWebsite || null,
            store_opening_hours: userMetadata.storeOpeningHours || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          const { error: createError } = await supabase
            .from("profiles")
            .insert(newProfileData);
            
          if (createError) {
            console.error("Failed to create profile:", createError);
            toast({
              title: "Error",
              description: "Failed to create profile"
            });
            return;
          }
          
          // Set the profile data from metadata
          setProfileData({
            username: userMetadata.username || "",
            bio: "",
            avatar_url: null,
            phone_number: userMetadata.phone_number || "",
            user_type: userMetadata.user_type || 'individual',
            store_name: userMetadata.storeName || "",
            store_description: userMetadata.storeDescription || "",
            store_address: userMetadata.storeAddress || "",
            store_phone: userMetadata.storePhone || "",
            store_website: userMetadata.storeWebsite || "",
            store_opening_hours: userMetadata.storeOpeningHours || ""
          });
        } else {
          // Set profile data from database
          setProfileData({
            username: data.username || "",
            bio: data.bio || "",
            avatar_url: data.avatar_url,
            phone_number: data.phone_number || "",
            user_type: data.user_type,
            store_name: data.store_name || "",
            store_description: data.store_description || "",
            store_address: data.store_address || "",
            store_phone: data.store_phone || "",
            store_website: data.store_website || "",
            store_opening_hours: data.store_opening_hours || ""
          });
          
          // Set avatar preview if exists
          if (data.avatar_url) {
            try {
              const { data: publicUrlData } = supabase.storage
                .from("avatars")
                .getPublicUrl(data.avatar_url);
                
              if (publicUrlData) {
                setAvatarPreview(publicUrlData.publicUrl);
              }
            } catch (err) {
              console.error("Error getting avatar URL:", err);
            }
          }
        }
      } catch (error) {
        console.error("Error in fetchProfile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      const updateData: any = {
        id: user.id,
        username: profileData.username,
        bio: profileData.bio,
        avatar_url: avatarPath,
        phone_number: profileData.phone_number,
        updated_at: new Date().toISOString(),
      };

      // Add store fields if user is a store
      if (profileData.user_type === 'store') {
        updateData.store_name = profileData.store_name;
        updateData.store_description = profileData.store_description;
        updateData.store_address = profileData.store_address;
        updateData.store_phone = profileData.store_phone;
        updateData.store_website = profileData.store_website;
        updateData.store_opening_hours = profileData.store_opening_hours;
      }
      
      const { error } = await supabase
        .from("profiles")
        .upsert(updateData);
        
      if (error) {
        console.error("Profile update error:", error);
        throw new Error(`Failed to update profile: ${error.message}`);
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-foreground">Loading profile...</div>;
  }

  const isStore = profileData.user_type === 'store';

  return (
    <div className="bg-card text-card-foreground rounded-lg border p-6">
      <h1 className="text-3xl font-bold mb-8">
        {isStore ? 'Store Profile' : 'Your Profile'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center mb-8">
          <Avatar className="h-32 w-32 mb-4">
            <AvatarImage src={avatarPreview || undefined} alt="Profile picture" />
            <AvatarFallback className="bg-muted text-muted-foreground">
              {profileData.username ? profileData.username.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex items-center gap-2">
            <Input 
              type="file" 
              id="avatar"
              accept="image/*" 
              onChange={handleFileChange}
              className="w-56 bg-background border-input"
            />
          </div>
        </div>
      
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-foreground flex items-center gap-2">
              <User size={16} />
              {isStore ? 'Store Owner Name' : 'Username'}
            </label>
            <Input
              id="username"
              name="username"
              value={profileData.username || ""}
              onChange={handleChange}
              placeholder={isStore ? "Enter store owner name" : "Choose a username"}
              className="bg-background border-input text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {isStore && (
            <div className="space-y-2">
              <label htmlFor="store_name" className="text-sm font-medium text-foreground">
                Store Name
              </label>
              <Input
                id="store_name"
                name="store_name"
                value={profileData.store_name || ""}
                onChange={handleChange}
                placeholder="Enter your store name"
                className="bg-background border-input text-foreground placeholder:text-muted-foreground"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="phone_number" className="text-sm font-medium text-foreground flex items-center gap-2">
              <Phone size={16} />
              {isStore ? 'Personal Phone' : 'Phone Number'}
            </label>
            <Input
              id="phone_number"
              name="phone_number"
              value={profileData.phone_number || ""}
              onChange={handleChange}
              placeholder="Add your phone number"
              type="tel"
              className="bg-background border-input text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {isStore && (
            <>
              <div className="space-y-2">
                <label htmlFor="store_phone" className="text-sm font-medium text-foreground">
                  Store Phone
                </label>
                <Input
                  id="store_phone"
                  name="store_phone"
                  value={profileData.store_phone || ""}
                  onChange={handleChange}
                  placeholder="Store phone number"
                  type="tel"
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="store_address" className="text-sm font-medium text-foreground">
                  Store Address
                </label>
                <Input
                  id="store_address"
                  name="store_address"
                  value={profileData.store_address || ""}
                  onChange={handleChange}
                  placeholder="Store address"
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="store_website" className="text-sm font-medium text-foreground">
                  Store Website
                </label>
                <Input
                  id="store_website"
                  name="store_website"
                  value={profileData.store_website || ""}
                  onChange={handleChange}
                  placeholder="https://your-store-website.com"
                  type="url"
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="store_opening_hours" className="text-sm font-medium text-foreground">
                  Opening Hours
                </label>
                <Input
                  id="store_opening_hours"
                  name="store_opening_hours"
                  value={profileData.store_opening_hours || ""}
                  onChange={handleChange}
                  placeholder="e.g., Mon-Fri: 9AM-6PM, Sat: 9AM-4PM"
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="store_description" className="text-sm font-medium text-foreground">
                  Store Description
                </label>
                <Textarea
                  id="store_description"
                  name="store_description"
                  value={profileData.store_description || ""}
                  onChange={handleChange}
                  placeholder="Describe your store and what you specialize in"
                  rows={4}
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </>
          )}

          {!isStore && (
            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium text-foreground">
                Bio
              </label>
              <Textarea
                id="bio"
                name="bio"
                value={profileData.bio || ""}
                onChange={handleChange}
                placeholder="Tell us about yourself"
                rows={4}
                className="bg-background border-input text-foreground placeholder:text-muted-foreground"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <Input
              id="email"
              value={user?.email || ""}
              disabled
              className="bg-muted border-input text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Account Type
            </label>
            <Input
              value={isStore ? "Store Account" : "Individual Account"}
              disabled
              className="bg-muted border-input text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground">
              Account type cannot be changed after registration
            </p>
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </div>
  );
}

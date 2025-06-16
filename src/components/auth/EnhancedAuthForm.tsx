
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { UserTypeSelector } from "./UserTypeSelector";
import { StoreSignupFields } from "./StoreSignupFields";

export function EnhancedAuthForm() {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    phoneNumber: "",
    userType: "individual" as 'individual' | 'store',
    // Store-specific fields
    storeName: "",
    storeDescription: "",
    storeAddress: "",
    storePhone: "",
    storeWebsite: "",
    storeOpeningHours: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Prepare store data if user type is store
        const storeData = formData.userType === 'store' ? {
          storeName: formData.storeName,
          storeDescription: formData.storeDescription,
          storeAddress: formData.storeAddress,
          storePhone: formData.storePhone,
          storeWebsite: formData.storeWebsite,
          storeOpeningHours: formData.storeOpeningHours
        } : undefined;

        await signUp(
          formData.email, 
          formData.password, 
          formData.username, 
          formData.phoneNumber,
          formData.userType,
          storeData
        );
      } else {
        await signIn(formData.email, formData.password);
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isSignUp ? "Create Account" : "Sign In"}</CardTitle>
        <CardDescription>
          {isSignUp ? "Create your TorqueUp account" : "Sign in to your account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
            />
          </div>

          {isSignUp && (
            <>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                />
              </div>

              <UserTypeSelector
                value={formData.userType}
                onChange={(value) => handleInputChange('userType', value)}
              />

              {formData.userType === 'store' && (
                <StoreSignupFields
                  storeName={formData.storeName}
                  storeDescription={formData.storeDescription}
                  storeAddress={formData.storeAddress}
                  storePhone={formData.storePhone}
                  storeWebsite={formData.storeWebsite}
                  storeOpeningHours={formData.storeOpeningHours}
                  onChange={handleInputChange}
                />
              )}
            </>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

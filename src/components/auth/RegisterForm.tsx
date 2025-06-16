
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { UserTypeSelector } from "./UserTypeSelector";
import { StoreSignupFields } from "./StoreSignupFields";
import { Eye, EyeOff } from "lucide-react";

export function RegisterForm() {
  const { signUp } = useAuth();
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
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
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
    } catch (error) {
      console.error("Registration error:", error);
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
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Create your TorqueUp account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Choose a username"
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
              placeholder="+1 (555) 123-4567"
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Loading..." : "Sign Up"}
          </Button>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

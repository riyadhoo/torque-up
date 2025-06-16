
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface StoreSignupFieldsProps {
  storeName: string;
  storeDescription: string;
  storeAddress: string;
  storePhone: string;
  storeWebsite: string;
  storeOpeningHours: string;
  onChange: (field: string, value: string) => void;
}

export function StoreSignupFields({
  storeName,
  storeDescription,
  storeAddress,
  storePhone,
  storeWebsite,
  storeOpeningHours,
  onChange
}: StoreSignupFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="store-name">Store Name *</Label>
        <Input
          id="store-name"
          type="text"
          value={storeName}
          onChange={(e) => onChange('storeName', e.target.value)}
          placeholder="Enter your store name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="store-description">Store Description</Label>
        <Textarea
          id="store-description"
          value={storeDescription}
          onChange={(e) => onChange('storeDescription', e.target.value)}
          placeholder="Describe your store and what you specialize in"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="store-address">Store Address</Label>
        <Input
          id="store-address"
          type="text"
          value={storeAddress}
          onChange={(e) => onChange('storeAddress', e.target.value)}
          placeholder="Enter your store address"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="store-phone">Store Phone</Label>
        <Input
          id="store-phone"
          type="tel"
          value={storePhone}
          onChange={(e) => onChange('storePhone', e.target.value)}
          placeholder="Enter your store phone number"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="store-website">Store Website</Label>
        <Input
          id="store-website"
          type="url"
          value={storeWebsite}
          onChange={(e) => onChange('storeWebsite', e.target.value)}
          placeholder="https://your-store-website.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="store-hours">Opening Hours</Label>
        <Input
          id="store-hours"
          type="text"
          value={storeOpeningHours}
          onChange={(e) => onChange('storeOpeningHours', e.target.value)}
          placeholder="e.g., Mon-Fri: 9AM-6PM, Sat: 9AM-4PM"
        />
      </div>
    </div>
  );
}


import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Store } from "lucide-react";

interface UserTypeSelectorProps {
  value: 'individual' | 'store';
  onChange: (value: 'individual' | 'store') => void;
}

export function UserTypeSelector({ value, onChange }: UserTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Account Type</Label>
      <RadioGroup 
        value={value} 
        onValueChange={onChange}
        className="grid grid-cols-2 gap-4"
      >
        <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
          <RadioGroupItem value="individual" id="individual" />
          <Label htmlFor="individual" className="flex items-center gap-2 cursor-pointer">
            <User size={16} />
            Individual
          </Label>
        </div>
        <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
          <RadioGroupItem value="store" id="store" />
          <Label htmlFor="store" className="flex items-center gap-2 cursor-pointer">
            <Store size={16} />
            Store
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}

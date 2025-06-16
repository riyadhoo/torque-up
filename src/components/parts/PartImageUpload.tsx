
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PartImageUploadProps {
  imagePreview: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PartImageUpload({ imagePreview, handleImageChange }: PartImageUploadProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="image">Part Image</Label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {imagePreview ? (
          <div className="mb-4">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="max-h-64 mx-auto object-contain" 
            />
          </div>
        ) : (
          <div className="text-muted-foreground mb-4">
            No image selected
          </div>
        )}
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("image")?.click()}
        >
          {imagePreview ? "Change Image" : "Select Image"}
        </Button>
      </div>
    </div>
  );
}

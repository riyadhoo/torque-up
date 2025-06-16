
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CarChatbot } from "./CarChatbot";
import { CarProps } from "@/types/car";
import { useLanguage } from "@/contexts/LanguageContext";

interface NavbarAssistantProps {
  cars: CarProps[];
  isOpen: boolean;
  onClose: () => void;
}

export function NavbarAssistant({ cars, isOpen, onClose }: NavbarAssistantProps) {
  const { t } = useLanguage();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background border rounded-lg shadow-xl w-full max-w-2xl h-[600px] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">{t('chat.aiAssistant')}</h3>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-hidden">
          <CarChatbot cars={cars} isFloating={true} />
        </div>
      </div>
    </div>
  );
}

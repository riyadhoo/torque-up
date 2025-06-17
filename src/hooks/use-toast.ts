
import { type ToastActionElement, type ToastProps } from "@/components/ui/toast";
import { toast as sonnerToast, type ToastT, type ExternalToast } from "sonner";
import { ReactNode } from "react";

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

// Create a custom toast function that matches our expected API
const createCustomToast = () => {
  // Base toast function to handle simple cases with variant support
  const customToast = (props: { title?: string; description?: string; variant?: "default" | "destructive" }) => {
    if (props.variant === "destructive") {
      return sonnerToast.error(props.title || "", {
        description: props.description,
      });
    }
    return sonnerToast(props.title || "", { description: props.description });
  };

  // Copy all existing methods from sonnerToast
  Object.assign(customToast, sonnerToast);

  // Override specific methods to match our expected API
  customToast.error = (props: { title?: string; description?: string }) => {
    return sonnerToast.error(props.title || "", {
      description: props.description,
    });
  };

  customToast.success = (props: { title?: string; description?: string }) => {
    return sonnerToast.success(props.title || "", {
      description: props.description,
    });
  };

  customToast.warning = (props: { title?: string; description?: string }) => {
    return sonnerToast.warning(props.title || "", {
      description: props.description,
    });
  };

  customToast.info = (props: { title?: string; description?: string }) => {
    return sonnerToast.info(props.title || "", {
      description: props.description,
    });
  };

  customToast.custom = (props: { title?: string; description?: string; variant?: "default" | "destructive" }) => {
    if (props.variant === "destructive") {
      return sonnerToast.error(props.title || "", {
        description: props.description,
      });
    }
    return sonnerToast(props.title || "", {
      description: props.description,
    });
  };

  return customToast;
};

// Create our custom toast instance
const toast = createCustomToast();

// Create a hook that simulates the old useToast API but uses Sonner internally
function useToast() {
  return {
    toast,
    // This used to return the toast list, but we don't need it with Sonner
    // as it manages its own state
    toasts: [] as ToasterToast[],
  };
}

export { useToast, toast };

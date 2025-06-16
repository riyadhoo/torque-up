
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { RateLimiter } from "@/lib/validation";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string, phoneNumber?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Rate limiters for authentication
const loginLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
const signupLimiter = new RateLimiter(3, 60 * 60 * 1000); // 3 attempts per hour

// Helper function to clean up auth state
const cleanupAuthState = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

// Enhanced input validation for auth
const validateAuthInput = (email: string, password: string, username?: string) => {
  const errors: string[] = [];
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push("Please enter a valid email address");
  }
  
  // Password validation
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    errors.push("Password must contain at least one uppercase letter, one lowercase letter, and one number");
  }
  
  // Username validation for signup
  if (username !== undefined) {
    if (username.length < 3) {
      errors.push("Username must be at least 3 characters long");
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      errors.push("Username can only contain letters, numbers, underscores, and hyphens");
    }
  }
  
  return errors;
};

export const EnhancedAuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up the subscription first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (event === 'SIGNED_IN') {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in."
        });
      }
      
      if (event === 'SIGNED_OUT') {
        // Clean state without forced reload
        setSession(null);
        setUser(null);
      }
    });

    // Then get the current session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, username: string, phoneNumber?: string): Promise<void> => {
    const clientKey = `signup_${email}`;
    
    if (!signupLimiter.isAllowed(clientKey)) {
      throw new Error("Too many signup attempts. Please try again later.");
    }
    
    // Validate input
    const validationErrors = validateAuthInput(email, password, username);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors[0]);
    }
    
    try {
      cleanupAuthState();
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username,
            phone_number: phoneNumber,
          }
        }
      });
      
      if (error) throw error;
      
      // Create profile entry with error handling
      if (data.user) {
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              username,
              phone_number: phoneNumber,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
            
          if (profileError) {
            console.error("Profile creation error:", profileError);
            // Log but don't fail signup
          }
        } catch (profileErr) {
          console.error("Profile creation failed:", profileErr);
        }
      }
      
      toast({
        title: "Account created",
        description: "Please check your email to confirm your registration."
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    const clientKey = `login_${email}`;
    
    if (!loginLimiter.isAllowed(clientKey)) {
      const remaining = loginLimiter.getRemainingAttempts(clientKey);
      throw new Error(`Too many login attempts. ${remaining} attempts remaining.`);
    }
    
    // Validate input
    const validationErrors = validateAuthInput(email, password);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors[0]);
    }
    
    try {
      cleanupAuthState();
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      // Navigate without forced reload
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message
      });
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      cleanupAuthState();
      
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) throw error;
      
      // Navigate to login without forced reload
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message
      });
      throw error;
    }
  };

  const value = {
    session,
    user,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useEnhancedAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useEnhancedAuth must be used within an EnhancedAuthProvider");
  }
  return context;
};

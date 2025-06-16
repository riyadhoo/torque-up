
import { Session, User } from "@supabase/supabase-js";

interface StoreData {
  storeName: string;
  storeDescription?: string;
  storeAddress?: string;
  storePhone?: string;
  storeWebsite?: string;
  storeOpeningHours?: string;
}

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (
    email: string, 
    password: string, 
    username: string, 
    phoneNumber?: string,
    userType?: 'individual' | 'store',
    storeData?: StoreData
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
};

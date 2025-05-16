
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, UserRole } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/components/ui/sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (universityIdOrEmail: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, universityIdOrEmail: string, role: UserRole, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to clean up any Supabase auth state
const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set up auth state listener and check for existing session
  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session && session.user) {
          // Fetch user profile from our profiles table
          const fetchProfile = async () => {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (error) {
              console.error('Error fetching user profile:', error);
              return;
            }

            if (profile) {
              setUser({
                id: profile.id,
                name: profile.name,
                role: profile.role as UserRole,
                universityId: profile.university_id || undefined,
                email: profile.email || undefined,
                avatar: profile.avatar_url || '/placeholder.svg'
              });
            }
          };

          // Defer profile fetching to prevent deadlocks
          setTimeout(() => {
            fetchProfile();
          }, 0);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Then check for existing session
    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && session.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          return;
        }

        if (profile) {
          setUser({
            id: profile.id,
            name: profile.name,
            role: profile.role as UserRole,
            universityId: profile.university_id || undefined,
            email: profile.email || undefined,
            avatar: profile.avatar_url || '/placeholder.svg'
          });
        }
      }
      
      setIsLoading(false);
    };

    loadSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (universityIdOrEmail: string, password: string) => {
    setIsLoading(true);
    try {
      // Clean up existing auth state
      cleanupAuthState();
      
      // Try global sign out first
      await supabase.auth.signOut({ scope: 'global' });

      // Determine if we're using email or universityId
      let email = universityIdOrEmail;
      
      // If it doesn't look like an email, try to find the user by university ID
      if (!email.includes('@')) {
        const { data, error } = await supabase
          .from('profiles')
          .select('email')
          .eq('university_id', universityIdOrEmail)
          .single();
        
        if (error || !data?.email) {
          throw new Error('Invalid university ID');
        }
        
        email = data.email;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (name: string, universityIdOrEmail: string, role: UserRole, password: string) => {
    setIsLoading(true);
    
    try {
      // Clean up existing auth state
      cleanupAuthState();
      
      // Try global sign out first
      await supabase.auth.signOut({ scope: 'global' });

      // For students, universityIdOrEmail is their ID
      // For staff, universityIdOrEmail is their email
      let email, universityId;
      
      if (role === 'student') {
        // Generate a dummy email for students based on their university ID
        // This is needed because Supabase auth requires an email
        universityId = universityIdOrEmail;
        email = `${universityId.toLowerCase()}@student.university.edu`;
      } else {
        // For staff, use the provided email
        email = universityIdOrEmail;
        universityId = null;
      }

      // Register the user
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            universityId
          },
        }
      });

      if (error) throw error;

    } catch (error: any) {
      toast.error(error.message || 'Registration failed. Please try again.');
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      setUser(null);
      
      // Force page reload for a clean state
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to sign out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

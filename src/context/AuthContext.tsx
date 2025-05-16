
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, UserRole } from "../types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (universityIdOrEmail: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  register: (name: string, universityIdOrEmail: string, role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Emma Johnson',
    universityId: 'EJ2023',
    role: 'student',
    avatar: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'Professor Ibukun',
    email: 'ibukun@university.edu',
    role: 'academic',
    avatar: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'Sarah Admin',
    email: 'sarah@university.edu',
    role: 'nonacademic',
    avatar: '/placeholder.svg'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('universityAppUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (universityIdOrEmail: string, role?: UserRole) => {
    setIsLoading(true);
    
    // In a real app, this would be an API call
    // For demo, we'll use the mock users
    const foundUser = MOCK_USERS.find(u => 
      u.universityId === universityIdOrEmail || 
      u.email === universityIdOrEmail
    );
    
    if (!foundUser) {
      throw new Error('Invalid credentials');
    }
    
    setUser(foundUser);
    localStorage.setItem('universityAppUser', JSON.stringify(foundUser));
    setIsLoading(false);
  };

  const register = async (name: string, universityIdOrEmail: string, role: UserRole) => {
    setIsLoading(true);
    
    // In a real app, this would validate and create a user via API
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      role,
      avatar: '/placeholder.svg'
    };
    
    if (role === 'student') {
      newUser.universityId = universityIdOrEmail;
    } else {
      newUser.email = universityIdOrEmail;
    }
    
    // Add the new user to our mock users (in a real app, this would be handled by the backend)
    // For demo purposes only
    MOCK_USERS.push(newUser);
    
    setUser(newUser);
    localStorage.setItem('universityAppUser', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('universityAppUser');
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

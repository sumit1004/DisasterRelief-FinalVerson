import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'volunteer' | 'victim' | 'management';
  specialization?: string;
  volunteerType?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  error?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy user data
const DUMMY_USERS = [
  {
    id: 'v1',
    name: 'John Volunteer',
    email: 'volunteer@test.com',
    password: 'password123',
    role: 'volunteer',
    volunteerType: 'Medical & Health Response Roles',
    specialization: 'Doctor (Emergency & Trauma)'
  },
  {
    id: 'vic1',
    name: 'Alice Victim',
    email: 'victim@test.com',
    password: 'password123',
    role: 'victim'
  },
  {
    id: 'm1',
    name: 'Bob Manager',
    email: 'manager@test.com',
    password: 'password123',
    role: 'management'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string, role: string) => {
    try {
      setError(null);
      const foundUser = DUMMY_USERS.find(
        (u) => u.email === email && u.password === password && u.role === role
      );

      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword as User);
        // Store in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('user');
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 
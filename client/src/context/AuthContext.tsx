import { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'farmer' | 'veterinarian' | 'buyer' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, role: UserRole) => {
    // TODO: remove mock functionality - implement real authentication
    console.log('Login attempt:', { email, role });
    
    // Mock user data
    const mockUser: User = {
      id: '1',
      name: role === 'farmer' ? 'John Smith' : role === 'veterinarian' ? 'Dr. Sarah Johnson' : 
            role === 'buyer' ? 'Mike Chen' : 'Admin User',
      email,
      role,
      avatar: undefined
    };
    
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
    }}>
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
import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { User, Users, ShoppingCart, Shield, Heart, Globe } from 'lucide-react';

type UserRole = 'farmer' | 'veterinarian' | 'buyer' | 'admin';

const roles = [
  {
    id: 'farmer' as UserRole,
    icon: User,
    titleKey: 'login.farmer',
    description: 'Manage your livestock health and records'
  },
  {
    id: 'veterinarian' as UserRole,
    icon: Heart,
    titleKey: 'login.veterinarian',
    description: 'Provide medical care and health monitoring'
  },
  {
    id: 'buyer' as UserRole,
    icon: ShoppingCart,
    titleKey: 'login.buyer',
    description: 'Source healthy livestock for purchase'
  },
  {
    id: 'admin' as UserRole,
    icon: Shield,
    titleKey: 'login.admin',
    description: 'System administration and oversight'
  }
];

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [, setLocation] = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    setLoading(true);
    console.log('Login attempt:', { email, role: selectedRole });
    
    try {
      await login(email, password, selectedRole);
      console.log('Login successful, redirecting...');
      // Small delay to ensure state updates
      setTimeout(() => {
        setLocation('/dashboard');
      }, 100);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Heart className="h-4 w-4" />
            </div>
            <span className="font-semibold">Livestock Health Meter</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
              data-testid="button-language-toggle"
            >
              <Globe className="h-4 w-4" />
              {language === 'en' ? 'اردو' : 'English'}
            </Button>
            <ThemeToggle />
          </div>
        </div>

        <Card data-testid="card-login">
          <CardHeader>
            <CardTitle>{t('login.title')}</CardTitle>
            <CardDescription>{t('login.selectRole')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <Button
                    key={role.id}
                    variant={selectedRole === role.id ? "default" : "outline"}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    onClick={() => setSelectedRole(role.id)}
                    data-testid={`button-role-${role.id}`}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{t(role.titleKey)}</span>
                  </Button>
                );
              })}
            </div>

            {selectedRole && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    data-testid="input-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    data-testid="input-password"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                  data-testid="button-login"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import Login from '@/pages/Login';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';

export default function LoginExample() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </LanguageProvider>
  );
}
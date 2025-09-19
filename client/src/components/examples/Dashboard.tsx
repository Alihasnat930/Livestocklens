import Dashboard from '@/pages/Dashboard';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';

export default function DashboardExample() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </LanguageProvider>
  );
}
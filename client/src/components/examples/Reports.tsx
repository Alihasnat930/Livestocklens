import Reports from '@/pages/Reports';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';

export default function ReportsExample() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Reports />
      </AuthProvider>
    </LanguageProvider>
  );
}
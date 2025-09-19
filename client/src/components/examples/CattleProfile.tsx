import CattleProfile from '@/pages/CattleProfile';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';

export default function CattleProfileExample() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CattleProfile />
      </AuthProvider>
    </LanguageProvider>
  );
}
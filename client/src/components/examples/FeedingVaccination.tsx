import FeedingVaccination from '@/pages/FeedingVaccination';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';

export default function FeedingVaccinationExample() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <FeedingVaccination />
      </AuthProvider>
    </LanguageProvider>
  );
}
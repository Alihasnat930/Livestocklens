import DiseaseDetection from '@/pages/DiseaseDetection';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';

export default function DiseaseDetectionExample() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <DiseaseDetection />
      </AuthProvider>
    </LanguageProvider>
  );
}
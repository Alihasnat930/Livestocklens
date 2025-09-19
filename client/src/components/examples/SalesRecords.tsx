import SalesRecords from '@/pages/SalesRecords';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';

export default function SalesRecordsExample() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SalesRecords />
      </AuthProvider>
    </LanguageProvider>
  );
}
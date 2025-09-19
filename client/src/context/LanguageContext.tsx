import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'en' | 'ur';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// TODO: remove mock functionality - implement real translations
const translations = {
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.cattle': 'Cattle',
    'nav.disease': 'Disease Detection',
    'nav.feeding': 'Feeding & Vaccination',
    'nav.sales': 'Sales & Records',
    'nav.reports': 'Reports',
    'nav.logout': 'Logout',
    'dashboard.title': 'Livestock Health Overview',
    'dashboard.totalCattle': 'Total Cattle',
    'dashboard.healthyCattle': 'Healthy',
    'dashboard.sickCattle': 'Sick',
    'dashboard.criticalCattle': 'Critical',
    'login.title': 'Login to Livestock Health Meter',
    'login.selectRole': 'Select Your Role',
    'login.farmer': 'Farmer',
    'login.veterinarian': 'Veterinarian',
    'login.buyer': 'Buyer',
    'login.admin': 'Admin',
    'cattle.profile': 'Cattle Profile',
    'cattle.feeding': 'Feeding',
    'cattle.vaccination': 'Vaccination',
    'cattle.disease': 'Disease Detection',
    'cattle.sales': 'Sales History'
  },
  ur: {
    'nav.dashboard': 'ڈیش بورڈ',
    'nav.cattle': 'مویشی',
    'nav.disease': 'بیماری کی تشخیص',
    'nav.feeding': 'خوراک اور ویکسینیشن',
    'nav.sales': 'فروخت اور ریکارڈ',
    'nav.reports': 'رپورٹس',
    'nav.logout': 'لاگ آؤٹ',
    'dashboard.title': 'مویشیوں کی صحت کا جائزہ',
    'dashboard.totalCattle': 'کل مویشی',
    'dashboard.healthyCattle': 'صحت مند',
    'dashboard.sickCattle': 'بیمار',
    'dashboard.criticalCattle': 'نازک',
    'login.title': 'لائیو سٹاک ہیلتھ میٹر میں لاگ ان کریں',
    'login.selectRole': 'اپنا کردار منتخب کریں',
    'login.farmer': 'کسان',
    'login.veterinarian': 'ویٹرنرین',
    'login.buyer': 'خریدار',
    'login.admin': 'ایڈمن',
    'cattle.profile': 'مویشی پروفائل',
    'cattle.feeding': 'خوراک',
    'cattle.vaccination': 'ویکسینیشن',
    'cattle.disease': 'بیماری کی تشخیص',
    'cattle.sales': 'فروخت کی تاریخ'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Set RTL direction for Urdu
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
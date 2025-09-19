import { 
  Home, 
  Activity, 
  Camera, 
  Calendar, 
  DollarSign, 
  BarChart3, 
  LogOut,
  Heart,
  Globe
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Link, useLocation } from 'wouter';

const menuItems = [
  {
    title: 'nav.dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'nav.cattle',
    url: '/cattle',
    icon: Activity,
  },
  {
    title: 'nav.disease',
    url: '/disease-detection',
    icon: Camera,
  },
  {
    title: 'nav.feeding',
    url: '/feeding',
    icon: Calendar,
  },
  {
    title: 'nav.sales',
    url: '/sales',
    icon: DollarSign,
  },
  {
    title: 'nav.reports',
    url: '/reports',
    icon: BarChart3,
  },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [location] = useLocation();

  const handleLogout = () => {
    console.log('Logout triggered');
    logout();
  };

  return (
    <Sidebar data-testid="sidebar-main">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Heart className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Livestock Health</span>
            <span className="truncate text-xs">{user?.name}</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('nav.dashboard')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.url}
                    data-testid={`nav-${item.url.replace('/', '')}`}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{t(item.title)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />
      
      <SidebarFooter>
        <div className="flex flex-col gap-2 p-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
              className="flex-1"
              data-testid="button-language-toggle"
            >
              <Globe className="h-4 w-4" />
              {language === 'en' ? 'اردو' : 'English'}
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start"
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4" />
            {t('nav.logout')}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
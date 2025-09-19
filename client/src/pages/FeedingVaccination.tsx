import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  Activity, 
  AlertCircle,
  CheckCircle
} from 'lucide-react';

// TODO: remove mock functionality - replace with real data
const mockFeedingSchedule = [
  {
    id: 1,
    cattleId: 'C-1247',
    cattleName: 'Bella',
    time: '06:00',
    feedType: 'Hay + Grain Mix',
    amount: '15kg',
    status: 'completed',
    notes: 'Normal appetite'
  },
  {
    id: 2,
    cattleId: 'C-1189',
    cattleName: 'Luna',
    time: '06:30',
    feedType: 'Silage',
    amount: '12kg',
    status: 'pending',
    notes: 'Monitor appetite'
  },
  {
    id: 3,
    cattleId: 'C-1156',
    cattleName: 'Max',
    time: '07:00',
    feedType: 'Hay + Supplements',
    amount: '18kg',
    status: 'overdue',
    notes: 'Requires vitamin supplement'
  }
];

const mockVaccinationSchedule = [
  {
    id: 1,
    cattleId: 'C-1247',
    cattleName: 'Bella',
    vaccine: 'FMD Vaccine',
    dueDate: '2024-02-01',
    status: 'upcoming',
    veterinarian: 'Dr. Sarah Johnson',
    notes: 'Annual booster due'
  },
  {
    id: 2,
    cattleId: 'C-1189',
    cattleName: 'Luna',
    vaccine: 'Anthrax Vaccine',
    dueDate: '2024-01-25',
    status: 'overdue',
    veterinarian: 'Dr. Sarah Johnson',
    notes: 'Urgent - schedule immediately'
  },
  {
    id: 3,
    cattleId: 'C-1156',
    cattleName: 'Max',
    vaccine: 'Brucellosis Vaccine',
    dueDate: '2024-02-15',
    status: 'upcoming',
    veterinarian: 'Dr. Mike Chen',
    notes: 'First vaccination'
  }
];

const mockFeedInventory = [
  {
    id: 1,
    name: 'Hay',
    quantity: '2,500kg',
    unit: 'kg',
    lastRestocked: '2024-01-10',
    lowThreshold: '500kg',
    status: 'good'
  },
  {
    id: 2,
    name: 'Grain Mix',
    quantity: '400kg',
    unit: 'kg',
    lastRestocked: '2024-01-15',
    lowThreshold: '300kg',
    status: 'low'
  },
  {
    id: 3,
    name: 'Silage',
    quantity: '1,800kg',
    unit: 'kg',
    lastRestocked: '2024-01-12',
    lowThreshold: '800kg',
    status: 'good'
  }
];

export default function FeedingVaccination() {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState('feeding');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'overdue':
        return 'destructive';
      case 'upcoming':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'upcoming':
        return <CalendarIcon className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getInventoryStatus = (status: string) => {
    switch (status) {
      case 'good':
        return 'default';
      case 'low':
        return 'destructive';
      case 'critical':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6" data-testid="page-feeding-vaccination">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t('nav.feeding')}</h2>
        <p className="text-muted-foreground">
          Manage feeding schedules, vaccination records, and inventory
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} data-testid="tabs-feeding-vaccination">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="feeding" data-testid="tab-feeding">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Feeding Schedule
          </TabsTrigger>
          <TabsTrigger value="vaccination" data-testid="tab-vaccination">
            <Activity className="h-4 w-4 mr-2" />
            Vaccination
          </TabsTrigger>
          <TabsTrigger value="inventory" data-testid="tab-inventory">
            <Plus className="h-4 w-4 mr-2" />
            Feed Inventory
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feeding" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <Card data-testid="card-feeding-calendar">
                <CardHeader>
                  <CardTitle>Schedule Calendar</CardTitle>
                  <CardDescription>
                    Select a date to view feeding schedule
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card data-testid="card-daily-feeding">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Daily Feeding Schedule</CardTitle>
                    <CardDescription>
                      {selectedDate?.toLocaleDateString()} - Today's feeding plan
                    </CardDescription>
                  </div>
                  <Button data-testid="button-add-feeding">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feeding
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockFeedingSchedule.map((feeding) => (
                    <div key={feeding.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(feeding.status)}
                        <div>
                          <p className="font-medium">{feeding.cattleName} ({feeding.cattleId})</p>
                          <p className="text-sm text-muted-foreground">
                            {feeding.time} - {feeding.feedType} ({feeding.amount})
                          </p>
                          {feeding.notes && (
                            <p className="text-xs text-muted-foreground">{feeding.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(feeding.status)}>
                          {feeding.status}
                        </Badge>
                        <Button size="sm" variant="outline" data-testid={`button-edit-feeding-${feeding.id}`}>
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="vaccination" className="space-y-6">
          <Card data-testid="card-vaccination-schedule">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Vaccination Schedule</CardTitle>
                <CardDescription>
                  Upcoming and overdue vaccinations for your livestock
                </CardDescription>
              </div>
              <Button data-testid="button-add-vaccination">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Vaccination
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockVaccinationSchedule.map((vaccination) => (
                <div key={vaccination.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(vaccination.status)}
                    <div>
                      <p className="font-medium">{vaccination.cattleName} ({vaccination.cattleId})</p>
                      <p className="text-sm text-muted-foreground">
                        {vaccination.vaccine} - Due: {vaccination.dueDate}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Veterinarian: {vaccination.veterinarian}
                      </p>
                      {vaccination.notes && (
                        <p className="text-xs text-muted-foreground">{vaccination.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(vaccination.status)}>
                      {vaccination.status}
                    </Badge>
                    <Button size="sm" variant="outline" data-testid={`button-edit-vaccination-${vaccination.id}`}>
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card data-testid="card-feed-inventory">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Feed Inventory</CardTitle>
                <CardDescription>
                  Current stock levels and reorder alerts
                </CardDescription>
              </div>
              <Button data-testid="button-add-inventory">
                <Plus className="h-4 w-4 mr-2" />
                Add Stock
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockFeedInventory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Current Stock: {item.quantity}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last Restocked: {item.lastRestocked} | Threshold: {item.lowThreshold}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getInventoryStatus(item.status)}>
                      {item.status}
                    </Badge>
                    <Button size="sm" variant="outline" data-testid={`button-reorder-${item.id}`}>
                      Reorder
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
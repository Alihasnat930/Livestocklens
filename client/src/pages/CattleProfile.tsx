import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Calendar, 
  Activity, 
  Camera, 
  DollarSign, 
  Heart, 
  Weight, 
  MapPin,
  Edit
} from 'lucide-react';
import holsteinImage from '@assets/generated_images/Holstein_dairy_cow_profile_ac0481c3.png';

// TODO: remove mock functionality - replace with real data
const mockCattleData = {
  id: 'C-1247',
  name: 'Bella',
  breed: 'Holstein',
  age: '3 years 4 months',
  weight: '650 kg',
  rfidId: 'RF-8834-2156',
  location: 'Barn A, Section 2',
  healthStatus: 'healthy',
  lastCheckup: '2024-01-15',
  nextVaccination: '2024-02-01',
  owner: 'Farm A',
  photo: holsteinImage,
  feeding: [
    {
      id: 1,
      date: '2024-01-18',
      type: 'Morning Feed',
      amount: '15kg',
      feedType: 'Hay + Grain Mix',
      notes: 'Normal appetite'
    },
    {
      id: 2,
      date: '2024-01-18',
      type: 'Evening Feed',
      amount: '12kg',
      feedType: 'Silage',
      notes: 'Good condition'
    }
  ],
  vaccinations: [
    {
      id: 1,
      date: '2023-12-01',
      vaccine: 'FMD Vaccine',
      batchNumber: 'FMD-2023-12',
      veterinarian: 'Dr. Sarah Johnson',
      nextDue: '2024-02-01'
    },
    {
      id: 2,
      date: '2023-11-15',
      vaccine: 'Anthrax Vaccine',
      batchNumber: 'ANT-2023-11',
      veterinarian: 'Dr. Sarah Johnson',
      nextDue: '2024-01-15'
    }
  ],
  diseaseHistory: [
    {
      id: 1,
      date: '2023-10-15',
      disease: 'Minor Respiratory Infection',
      severity: 'Mild',
      treatment: 'Antibiotics - 7 days',
      recovery: 'Full recovery'
    }
  ],
  salesHistory: [
    {
      id: 1,
      date: '2023-08-15',
      type: 'Milk Production',
      quantity: '25L/day',
      price: '$150/month',
      buyer: 'Local Dairy Co.'
    }
  ]
};

export default function CattleProfile() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('profile');

  const getHealthBadgeVariant = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'default';
      case 'sick':
        return 'secondary';
      case 'critical':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6" data-testid="page-cattle-profile">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t('cattle.profile')}</h2>
        <p className="text-muted-foreground">
          Detailed information and history for {mockCattleData.name}
        </p>
      </div>

      {/* Cattle Overview Card */}
      <Card data-testid="card-cattle-overview">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0">
              <Avatar className="h-32 w-32 rounded-lg">
                <AvatarImage 
                  src={mockCattleData.photo} 
                  alt={mockCattleData.name}
                  className="object-cover"
                />
                <AvatarFallback className="text-lg font-bold rounded-lg">
                  {mockCattleData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold">{mockCattleData.name}</h3>
                  <p className="text-muted-foreground">ID: {mockCattleData.id}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={getHealthBadgeVariant(mockCattleData.healthStatus)}>
                    <Heart className="h-3 w-3 mr-1" />
                    {mockCattleData.healthStatus}
                  </Badge>
                  <Button size="sm" variant="outline" data-testid="button-edit-cattle">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Breed</p>
                  <p className="font-medium">{mockCattleData.breed}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Age</p>
                  <p className="font-medium">{mockCattleData.age}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Weight</p>
                  <p className="font-medium">{mockCattleData.weight}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">RFID</p>
                  <p className="font-medium">{mockCattleData.rfidId}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {mockCattleData.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Last checkup: {mockCattleData.lastCheckup}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} data-testid="tabs-cattle-details">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="feeding" data-testid="tab-feeding">
            <Calendar className="h-4 w-4 mr-2" />
            {t('cattle.feeding')}
          </TabsTrigger>
          <TabsTrigger value="vaccination" data-testid="tab-vaccination">
            <Activity className="h-4 w-4 mr-2" />
            {t('cattle.vaccination')}
          </TabsTrigger>
          <TabsTrigger value="disease" data-testid="tab-disease">
            <Camera className="h-4 w-4 mr-2" />
            {t('cattle.disease')}
          </TabsTrigger>
          <TabsTrigger value="sales" data-testid="tab-sales">
            <DollarSign className="h-4 w-4 mr-2" />
            {t('cattle.sales')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feeding" className="space-y-4">
          <Card data-testid="card-feeding-schedule">
            <CardHeader>
              <CardTitle>Feeding Schedule</CardTitle>
              <CardDescription>Daily feeding records and schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockCattleData.feeding.map((feed) => (
                <div key={feed.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{feed.type}</p>
                    <p className="text-sm text-muted-foreground">{feed.feedType} - {feed.amount}</p>
                    <p className="text-xs text-muted-foreground">{feed.notes}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{feed.date}</p>
                  </div>
                </div>
              ))}
              <Button className="w-full" variant="outline" data-testid="button-add-feeding">
                Add Feeding Record
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vaccination" className="space-y-4">
          <Card data-testid="card-vaccination-history">
            <CardHeader>
              <CardTitle>Vaccination History</CardTitle>
              <CardDescription>Complete vaccination records and schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockCattleData.vaccinations.map((vaccination) => (
                <div key={vaccination.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{vaccination.vaccine}</p>
                    <p className="text-sm text-muted-foreground">Batch: {vaccination.batchNumber}</p>
                    <p className="text-xs text-muted-foreground">By: {vaccination.veterinarian}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium">{vaccination.date}</p>
                    <p className="text-xs text-muted-foreground">Next: {vaccination.nextDue}</p>
                  </div>
                </div>
              ))}
              <Button className="w-full" variant="outline" data-testid="button-add-vaccination">
                Add Vaccination Record
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disease" className="space-y-4">
          <Card data-testid="card-disease-history">
            <CardHeader>
              <CardTitle>Disease Detection History</CardTitle>
              <CardDescription>Past health issues and treatments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockCattleData.diseaseHistory.map((disease) => (
                <div key={disease.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{disease.disease}</p>
                    <p className="text-sm text-muted-foreground">Treatment: {disease.treatment}</p>
                    <p className="text-xs text-muted-foreground">Outcome: {disease.recovery}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant="outline">{disease.severity}</Badge>
                    <p className="text-xs text-muted-foreground">{disease.date}</p>
                  </div>
                </div>
              ))}
              <Button className="w-full" variant="outline" data-testid="button-new-detection">
                Run Disease Detection
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card data-testid="card-sales-history">
            <CardHeader>
              <CardTitle>Sales History</CardTitle>
              <CardDescription>Transaction records and productivity data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockCattleData.salesHistory.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{sale.type}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {sale.quantity}</p>
                    <p className="text-xs text-muted-foreground">Buyer: {sale.buyer}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium text-green-600">{sale.price}</p>
                    <p className="text-xs text-muted-foreground">{sale.date}</p>
                  </div>
                </div>
              ))}
              <Button className="w-full" variant="outline" data-testid="button-add-sale">
                Add Sales Record
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
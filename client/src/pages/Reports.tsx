import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/LanguageContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Activity, 
  Calendar, 
  Download,
  Filter,
  Heart
} from 'lucide-react';

// TODO: remove mock functionality - replace with real analytics data
const mockHealthData = [
  { month: 'Jan', healthy: 198, sick: 32, critical: 17 },
  { month: 'Feb', healthy: 205, sick: 28, critical: 14 },
  { month: 'Mar', healthy: 215, sick: 22, critical: 10 },
  { month: 'Apr', healthy: 220, sick: 18, critical: 9 },
  { month: 'May', healthy: 225, sick: 15, critical: 7 },
  { month: 'Jun', healthy: 230, sick: 12, critical: 5 }
];

const mockFeedingData = [
  { month: 'Jan', hay: 2500, grain: 1800, silage: 2200, supplements: 400 },
  { month: 'Feb', hay: 2200, grain: 1900, silage: 2100, supplements: 450 },
  { month: 'Mar', hay: 2800, grain: 2000, silage: 2300, supplements: 500 },
  { month: 'Apr', hay: 2600, grain: 1850, silage: 2150, supplements: 480 },
  { month: 'May', hay: 2750, grain: 1950, silage: 2250, supplements: 520 },
  { month: 'Jun', hay: 2900, grain: 2100, silage: 2400, supplements: 550 }
];

const mockVaccinationData = [
  { month: 'Jan', scheduled: 45, completed: 42, missed: 3 },
  { month: 'Feb', scheduled: 38, completed: 36, missed: 2 },
  { month: 'Mar', scheduled: 52, completed: 50, missed: 2 },
  { month: 'Apr', scheduled: 41, completed: 39, missed: 2 },
  { month: 'May', scheduled: 36, completed: 35, missed: 1 },
  { month: 'Jun', scheduled: 48, completed: 47, missed: 1 }
];

const mockHealthDistribution = [
  { name: 'Healthy', value: 230, color: '#22c55e' },
  { name: 'Sick', value: 12, color: '#f59e0b' },
  { name: 'Critical', value: 5, color: '#ef4444' }
];

const mockSalesData = [
  { month: 'Jan', revenue: 45000, transactions: 12 },
  { month: 'Feb', revenue: 52000, transactions: 14 },
  { month: 'Mar', revenue: 48000, transactions: 13 },
  { month: 'Apr', revenue: 61000, transactions: 16 },
  { month: 'May', revenue: 58000, transactions: 15 },
  { month: 'Jun', revenue: 67000, transactions: 18 }
];

export default function Reports() {
  const { t } = useLanguage();

  return (
    <div className="flex-1 space-y-6 p-6" data-testid="page-reports">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t('nav.reports')}</h2>
        <p className="text-muted-foreground">
          Comprehensive analytics and insights for your livestock operation
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card data-testid="card-health-score">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
            <Heart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">93.2%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>

        <Card data-testid="card-vaccination-rate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vaccination Rate</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">97.9%</div>
            <p className="text-xs text-muted-foreground">+0.5% from last month</p>
          </CardContent>
        </Card>

        <Card data-testid="card-feeding-efficiency">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feeding Efficiency</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">94.8%</div>
            <p className="text-xs text-muted-foreground">+1.2% from last month</p>
          </CardContent>
        </Card>

        <Card data-testid="card-revenue-growth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+15.7%</div>
            <p className="text-xs text-muted-foreground">vs last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="health" data-testid="tabs-reports">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="health" data-testid="tab-health-analytics">Health</TabsTrigger>
            <TabsTrigger value="feeding" data-testid="tab-feeding-analytics">Feeding</TabsTrigger>
            <TabsTrigger value="vaccination" data-testid="tab-vaccination-analytics">Vaccination</TabsTrigger>
            <TabsTrigger value="sales" data-testid="tab-sales-analytics">Sales</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button variant="outline" data-testid="button-filter-reports">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" data-testid="button-export-reports">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <TabsContent value="health" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card data-testid="card-health-trends">
              <CardHeader>
                <CardTitle>Health Trends</CardTitle>
                <CardDescription>Monthly health status distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockHealthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="healthy" fill="#22c55e" name="Healthy" />
                    <Bar dataKey="sick" fill="#f59e0b" name="Sick" />
                    <Bar dataKey="critical" fill="#ef4444" name="Critical" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card data-testid="card-current-health-distribution">
              <CardHeader>
                <CardTitle>Current Health Distribution</CardTitle>
                <CardDescription>Today's livestock health breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockHealthDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {mockHealthDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="feeding" className="space-y-6">
          <Card data-testid="card-feeding-consumption">
            <CardHeader>
              <CardTitle>Feed Consumption Trends</CardTitle>
              <CardDescription>Monthly feed consumption by type (kg)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={mockFeedingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="hay" stroke="#8884d8" name="Hay" />
                  <Line type="monotone" dataKey="grain" stroke="#82ca9d" name="Grain" />
                  <Line type="monotone" dataKey="silage" stroke="#ffc658" name="Silage" />
                  <Line type="monotone" dataKey="supplements" stroke="#ff7300" name="Supplements" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vaccination" className="space-y-6">
          <Card data-testid="card-vaccination-compliance">
            <CardHeader>
              <CardTitle>Vaccination Compliance</CardTitle>
              <CardDescription>Monthly vaccination schedule tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={mockVaccinationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#22c55e" name="Completed" />
                  <Bar dataKey="missed" fill="#ef4444" name="Missed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card data-testid="card-revenue-trends">
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly sales revenue ($)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockSalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card data-testid="card-transaction-volume">
              <CardHeader>
                <CardTitle>Transaction Volume</CardTitle>
                <CardDescription>Monthly number of sales transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockSalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="transactions" fill="#3b82f6" name="Transactions" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
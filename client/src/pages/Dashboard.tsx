import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Activity, 
  AlertTriangle, 
  Heart, 
  Clock, 
  Users, 
  TrendingUp,
  AlertCircle 
} from 'lucide-react';

// TODO: remove mock functionality - replace with real data
const mockData = {
  totalCattle: 247,
  healthyCattle: 198,
  sickCattle: 32,
  criticalCattle: 17,
  alerts: [
    {
      id: 1,
      type: 'critical',
      title: 'Cattle #C-1247 requires immediate attention',
      description: 'High fever detected - isolate immediately',
      timestamp: '2 minutes ago'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Vaccination due for 12 cattle',
      description: 'Next vaccination round scheduled',
      timestamp: '1 hour ago'
    },
    {
      id: 3,
      type: 'info',
      title: 'Feed inventory running low',
      description: 'Order feed supplies within 3 days',
      timestamp: '3 hours ago'
    }
  ],
  recentActivity: [
    {
      id: 1,
      action: 'Health check completed',
      cattle: 'C-1256',
      timestamp: '15 minutes ago',
      status: 'healthy'
    },
    {
      id: 2,
      action: 'Vaccination administered',
      cattle: 'C-1198',
      timestamp: '1 hour ago',
      status: 'completed'
    },
    {
      id: 3,
      action: 'Disease detected',
      cattle: 'C-1247',
      timestamp: '2 hours ago',
      status: 'critical'
    }
  ]
};

export default function Dashboard() {
  const { t } = useLanguage();

  const healthPercentage = Math.round((mockData.healthyCattle / mockData.totalCattle) * 100);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6" data-testid="page-dashboard">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h2>
        <p className="text-muted-foreground">
          Monitor your livestock health status and recent activities
        </p>
      </div>

      {/* Health Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card data-testid="card-total-cattle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.totalCattle')}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.totalCattle}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-healthy-cattle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.healthyCattle')}
            </CardTitle>
            <Heart className="h-4 w-4 text-health-healthy" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-health-healthy">{mockData.healthyCattle}</div>
            <p className="text-xs text-muted-foreground">
              {healthPercentage}% of total herd
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-sick-cattle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.sickCattle')}
            </CardTitle>
            <Activity className="h-4 w-4 text-health-sick" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-health-sick">{mockData.sickCattle}</div>
            <p className="text-xs text-muted-foreground">
              Requires monitoring
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-critical-cattle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.criticalCattle')}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-health-critical" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-health-critical">{mockData.criticalCattle}</div>
            <p className="text-xs text-muted-foreground">
              Immediate attention required
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Health Progress */}
      <Card data-testid="card-health-overview">
        <CardHeader>
          <CardTitle>Herd Health Overview</CardTitle>
          <CardDescription>
            Overall health status of your livestock
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Healthy Cattle</span>
              <span>{healthPercentage}%</span>
            </div>
            <Progress value={healthPercentage} className="h-2" />
          </div>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-health-healthy"></div>
              <span>Healthy ({mockData.healthyCattle})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-health-sick"></div>
              <span>Sick ({mockData.sickCattle})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-health-critical"></div>
              <span>Critical ({mockData.criticalCattle})</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Alerts */}
        <Card data-testid="card-alerts">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>
              Important notifications and warnings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockData.alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border">
                {getAlertIcon(alert.type)}
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{alert.title}</p>
                  <p className="text-xs text-muted-foreground">{alert.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                    <Badge variant={getAlertVariant(alert.type) as any} className="text-xs">
                      {alert.type}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full" data-testid="button-view-all-alerts">
              View All Alerts
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card data-testid="card-recent-activity">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions and updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockData.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg border">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">
                    Cattle: {activity.cattle} • {activity.timestamp}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {activity.status}
                </Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full" data-testid="button-view-all-activity">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, TrendingUp, TrendingDown, Plus, Stethoscope } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface HealthRecord {
  id: number;
  cattleId: string;
  cattleName: string;
  date: Date;
  weight: number;
  temperature: number;
  heartRate: number;
  respiratoryRate: number;
  bodyConditionScore: number;
  notes: string;
  status: 'healthy' | 'attention' | 'critical';
}

export default function HealthMonitoring() {
  const [showAddForm, setShowAddForm] = useState(false);

  // Mock data for health records
  const healthRecords: HealthRecord[] = [
    {
      id: 1,
      cattleId: 'C001',
      cattleName: 'Bessie',
      date: new Date(2024, 0, 15),
      weight: 550,
      temperature: 38.5,
      heartRate: 72,
      respiratoryRate: 25,
      bodyConditionScore: 3.5,
      notes: 'Normal health indicators',
      status: 'healthy',
    },
    {
      id: 2,
      cattleId: 'C002',
      cattleName: 'Daisy',
      date: new Date(2024, 0, 14),
      weight: 520,
      temperature: 39.2,
      heartRate: 85,
      respiratoryRate: 32,
      bodyConditionScore: 3.0,
      notes: 'Slightly elevated temperature',
      status: 'attention',
    },
  ];

  // Mock data for weight tracking
  const weightData = [
    { month: 'Jan', weight: 520 },
    { month: 'Feb', weight: 535 },
    { month: 'Mar', weight: 545 },
    { month: 'Apr', weight: 550 },
  ];

  // Mock data for health metrics
  const healthMetrics = [
    { name: 'Healthy', value: 75, color: 'bg-green-500' },
    { name: 'Needs Attention', value: 20, color: 'bg-yellow-500' },
    { name: 'Critical', value: 5, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Health Monitoring</h1>
          <p className="text-muted-foreground">Track vital signs and health metrics for your cattle</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Health Record
        </Button>
      </div>

      {/* Health Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cattle</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100</div>
            <p className="text-xs text-muted-foreground">Active in farm</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy Cattle</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75</div>
            <p className="text-xs text-muted-foreground">+5 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Need Attention</CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">20</div>
            <p className="text-xs text-muted-foreground">-3 from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Health Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Herd Health Distribution</CardTitle>
          <CardDescription>Overall health status of your cattle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {healthMetrics.map((metric) => (
              <div key={metric.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{metric.name}</span>
                  <span className="text-sm text-muted-foreground">{metric.value}%</span>
                </div>
                <Progress value={metric.value} className={metric.color} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Health Record Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Health Record</CardTitle>
            <CardDescription>Record health metrics for your cattle</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cattle">Cattle</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cattle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="C001">Bessie (C001)</SelectItem>
                      <SelectItem value="C002">Daisy (C002)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" type="number" placeholder="550" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <Input id="temperature" type="number" step="0.1" placeholder="38.5" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                  <Input id="heartRate" type="number" placeholder="72" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="respiratoryRate">Respiratory Rate (breaths/min)</Label>
                  <Input id="respiratoryRate" type="number" placeholder="25" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bcs">Body Condition Score (1-5)</Label>
                  <Input id="bcs" type="number" step="0.5" min="1" max="5" placeholder="3.5" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" placeholder="Any observations or concerns" />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  <Stethoscope className="mr-2 h-4 w-4" />
                  Save Health Record
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tabs for different views */}
      <Tabs defaultValue="records" className="space-y-4">
        <TabsList>
          <TabsTrigger value="records">Health Records</TabsTrigger>
          <TabsTrigger value="trends">Trends & Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Health Records</CardTitle>
              <CardDescription>Latest health checkups and vital signs</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cattle</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Weight (kg)</TableHead>
                    <TableHead>Temp (°C)</TableHead>
                    <TableHead>Heart Rate</TableHead>
                    <TableHead>BCS</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {healthRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        {record.cattleName}
                        <br />
                        <span className="text-xs text-muted-foreground">{record.cattleId}</span>
                      </TableCell>
                      <TableCell>{record.date.toLocaleDateString()}</TableCell>
                      <TableCell>{record.weight}</TableCell>
                      <TableCell>{record.temperature}</TableCell>
                      <TableCell>{record.heartRate}</TableCell>
                      <TableCell>{record.bodyConditionScore}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            record.status === 'healthy'
                              ? 'default'
                              : record.status === 'critical'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weight Trend</CardTitle>
              <CardDescription>Average cattle weight over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="weight" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Health Status Distribution</CardTitle>
              <CardDescription>Number of cattle by health status</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { status: 'Healthy', count: 75 },
                  { status: 'Attention', count: 20 },
                  { status: 'Critical', count: 5 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

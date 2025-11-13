import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Plus, Syringe, CalendarIcon, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface VaccinationRecord {
  id: number;
  cattleId: string;
  cattleName: string;
  vaccineName: string;
  date: Date;
  nextDueDate: Date;
  administeredBy: string;
  status: 'completed' | 'upcoming' | 'overdue';
}

export default function Vaccination() {
  const [date, setDate] = useState<Date>();
  const [nextDueDate, setNextDueDate] = useState<Date>();
  const [showAddForm, setShowAddForm] = useState(false);

  // Mock data
  const vaccinationRecords: VaccinationRecord[] = [
    {
      id: 1,
      cattleId: 'C001',
      cattleName: 'Bessie',
      vaccineName: 'FMD Vaccine',
      date: new Date(2024, 0, 15),
      nextDueDate: new Date(2024, 6, 15),
      administeredBy: 'Dr. Smith',
      status: 'upcoming',
    },
    {
      id: 2,
      cattleId: 'C002',
      cattleName: 'Daisy',
      vaccineName: 'Anthrax Vaccine',
      date: new Date(2023, 11, 10),
      nextDueDate: new Date(2024, 5, 10),
      administeredBy: 'Dr. Johnson',
      status: 'overdue',
    },
  ];

  const upcomingVaccinations = vaccinationRecords.filter(
    (record) => record.status === 'upcoming' || record.status === 'overdue'
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vaccination Management</h1>
          <p className="text-muted-foreground">Track and schedule vaccinations for your cattle</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Vaccination Record
        </Button>
      </div>

      {/* Alerts for upcoming vaccinations */}
      {upcomingVaccinations.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Bell className="h-5 w-5" />
              Vaccination Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingVaccinations.map((record) => (
                <div key={record.id} className="flex items-center justify-between">
                  <span className="text-sm">
                    {record.cattleName} - {record.vaccineName}
                  </span>
                  <Badge variant={record.status === 'overdue' ? 'destructive' : 'default'}>
                    {record.status === 'overdue' ? 'Overdue' : 'Due'}: {format(record.nextDueDate, 'MMM dd, yyyy')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Vaccination Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Vaccination Record</CardTitle>
            <CardDescription>Record a new vaccination for your cattle</CardDescription>
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
                  <Label htmlFor="vaccine">Vaccine Name</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vaccine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fmd">FMD Vaccine</SelectItem>
                      <SelectItem value="anthrax">Anthrax Vaccine</SelectItem>
                      <SelectItem value="brucellosis">Brucellosis Vaccine</SelectItem>
                      <SelectItem value="rabies">Rabies Vaccine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Vaccination Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !date && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Next Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !nextDueDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {nextDueDate ? format(nextDueDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={nextDueDate} onSelect={setNextDueDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="administeredBy">Administered By</Label>
                  <Input id="administeredBy" placeholder="Veterinarian name" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batchNo">Batch Number</Label>
                  <Input id="batchNo" placeholder="Vaccine batch number" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" placeholder="Any additional notes" />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  <Syringe className="mr-2 h-4 w-4" />
                  Save Vaccination
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Vaccination Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vaccination History</CardTitle>
          <CardDescription>Complete vaccination records for all cattle</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cattle ID</TableHead>
                <TableHead>Cattle Name</TableHead>
                <TableHead>Vaccine</TableHead>
                <TableHead>Date Given</TableHead>
                <TableHead>Next Due</TableHead>
                <TableHead>Administered By</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vaccinationRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.cattleId}</TableCell>
                  <TableCell>{record.cattleName}</TableCell>
                  <TableCell>{record.vaccineName}</TableCell>
                  <TableCell>{format(record.date, 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{format(record.nextDueDate, 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{record.administeredBy}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        record.status === 'completed'
                          ? 'default'
                          : record.status === 'overdue'
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
    </div>
  );
}

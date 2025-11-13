import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Users, Edit, Trash2 } from 'lucide-react';

interface CattleGroup {
  id: number;
  name: string;
  description: string;
  cattleCount: number;
  ageRange: string;
  purpose: string;
  createdDate: Date;
}

export default function GroupManagement() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [purpose, setPurpose] = useState('');

  // Mock data for cattle groups
  const cattleGroups: CattleGroup[] = [
    {
      id: 1,
      name: 'Dairy Cows - High Production',
      description: 'High-yield dairy cows in peak lactation',
      cattleCount: 25,
      ageRange: '3-5 years',
      purpose: 'Dairy',
      createdDate: new Date(2024, 0, 1),
    },
    {
      id: 2,
      name: 'Beef Cattle - Finishing',
      description: 'Cattle in final stage before market',
      cattleCount: 30,
      ageRange: '2-3 years',
      purpose: 'Beef',
      createdDate: new Date(2024, 0, 15),
    },
    {
      id: 3,
      name: 'Calves - Weaning',
      description: 'Newly weaned calves',
      cattleCount: 15,
      ageRange: '6-8 months',
      purpose: 'Growing',
      createdDate: new Date(2024, 1, 1),
    },
  ];

  const handleCreateGroup = () => {
    // Handle group creation logic here
    console.log('Creating group:', { groupName, description, purpose });
    setShowCreateDialog(false);
    // Reset form
    setGroupName('');
    setDescription('');
    setPurpose('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Group Management</h1>
          <p className="text-muted-foreground">Create and manage cattle groups for organized feeding and care</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Cattle Group</DialogTitle>
              <DialogDescription>
                Create a new group to organize your cattle for feeding plans and management
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                  id="groupName"
                  placeholder="e.g., Dairy Cows - High Production"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Brief description of this group"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Select value={purpose} onValueChange={setPurpose}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dairy">Dairy Production</SelectItem>
                    <SelectItem value="beef">Beef Production</SelectItem>
                    <SelectItem value="growing">Growing/Development</SelectItem>
                    <SelectItem value="breeding">Breeding</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateGroup}>
                <Users className="mr-2 h-4 w-4" />
                Create Group
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cattleGroups.length}</div>
            <p className="text-xs text-muted-foreground">Active cattle groups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cattle in Groups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cattleGroups.reduce((sum, group) => sum + group.cattleCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Organized in groups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Group Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(cattleGroups.reduce((sum, group) => sum + group.cattleCount, 0) / cattleGroups.length)}
            </div>
            <p className="text-xs text-muted-foreground">Cattle per group</p>
          </CardContent>
        </Card>
      </div>

      {/* Groups Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cattle Groups</CardTitle>
          <CardDescription>Manage and organize your cattle into groups</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Cattle Count</TableHead>
                <TableHead>Age Range</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cattleGroups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell className="font-medium">{group.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{group.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{group.purpose}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {group.cattleCount}
                    </div>
                  </TableCell>
                  <TableCell>{group.ageRange}</TableCell>
                  <TableCell>{group.createdDate.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Group Details - could expand to show cattle in each group */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cattleGroups.map((group) => (
          <Card key={group.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">{group.name}</span>
                <Badge variant="secondary">{group.cattleCount}</Badge>
              </CardTitle>
              <CardDescription>{group.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Purpose:</span>
                  <span className="font-medium">{group.purpose}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age Range:</span>
                  <span className="font-medium">{group.ageRange}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">{group.createdDate.toLocaleDateString()}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Cattle
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Feed Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

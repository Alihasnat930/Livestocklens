import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Package, AlertTriangle, TrendingUp } from 'lucide-react';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  reorderLevel: number;
  supplier: string;
  lastUpdated: Date;
}

export default function Inventory() {
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Mock inventory data
  const inventoryItems: InventoryItem[] = [
    {
      id: 1,
      name: 'Alfalfa Hay',
      category: 'Forage',
      quantity: 500,
      unit: 'kg',
      costPerUnit: 2.5,
      reorderLevel: 200,
      supplier: 'Green Fields Farm',
      lastUpdated: new Date(2024, 0, 15),
    },
    {
      id: 2,
      name: 'Corn Grain',
      category: 'Grain',
      quantity: 150,
      unit: 'kg',
      costPerUnit: 1.8,
      reorderLevel: 300,
      supplier: 'Prairie Grains Co.',
      lastUpdated: new Date(2024, 0, 14),
    },
    {
      id: 3,
      name: 'Soybean Meal',
      category: 'Protein',
      quantity: 800,
      unit: 'kg',
      costPerUnit: 3.2,
      reorderLevel: 400,
      supplier: 'Protein Plus Ltd.',
      lastUpdated: new Date(2024, 0, 13),
    },
    {
      id: 4,
      name: 'Mineral Mix',
      category: 'Supplement',
      quantity: 50,
      unit: 'kg',
      costPerUnit: 5.0,
      reorderLevel: 30,
      supplier: 'VitaMix Supplies',
      lastUpdated: new Date(2024, 0, 12),
    },
  ];

  // Items that need reordering
  const lowStockItems = inventoryItems.filter(item => item.quantity <= item.reorderLevel);

  // Calculate total inventory value
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.quantity * item.costPerUnit), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Feed Inventory Management</h1>
          <p className="text-muted-foreground">Track and manage feed ingredients and supplies</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Inventory Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Inventory Item</DialogTitle>
              <DialogDescription>Add a new feed ingredient or supply to your inventory</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="itemName">Item Name</Label>
                <Input id="itemName" placeholder="e.g., Alfalfa Hay" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="forage">Forage</SelectItem>
                      <SelectItem value="grain">Grain</SelectItem>
                      <SelectItem value="protein">Protein</SelectItem>
                      <SelectItem value="supplement">Supplement</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                      <SelectItem value="bales">Bales</SelectItem>
                      <SelectItem value="bags">Bags</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" placeholder="500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costPerUnit">Cost per Unit</Label>
                  <Input id="costPerUnit" type="number" step="0.01" placeholder="2.50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reorderLevel">Reorder Level</Label>
                  <Input id="reorderLevel" type="number" placeholder="200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input id="supplier" placeholder="Supplier name" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowAddDialog(false)}>
                <Package className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <span className="text-sm">
                    {item.name} - Current: {item.quantity} {item.unit}
                  </span>
                  <Badge variant="outline">Reorder at: {item.reorderLevel} {item.unit}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryItems.length}</div>
            <p className="text-xs text-muted-foreground">In inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Current inventory value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Need reordering</p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>All feed ingredients and supplies in stock</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Cost/Unit</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Reorder Level</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryItems.map((item) => {
                const totalValue = item.quantity * item.costPerUnit;
                const isLowStock = item.quantity <= item.reorderLevel;
                
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {item.quantity} {item.unit}
                    </TableCell>
                    <TableCell>${item.costPerUnit.toFixed(2)}</TableCell>
                    <TableCell>${totalValue.toFixed(2)}</TableCell>
                    <TableCell>{item.reorderLevel} {item.unit}</TableCell>
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell>
                      <Badge variant={isLowStock ? 'destructive' : 'default'}>
                        {isLowStock ? 'Low Stock' : 'In Stock'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

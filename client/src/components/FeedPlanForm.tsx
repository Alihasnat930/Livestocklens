import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Trash2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Ingredient {
  inventoryItemId: string;
  itemName: string;
  percentage: string;
  unit: string;
  availableQty: string;
  costPerUnit: string;
}

interface FeedPlanFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function FeedPlanForm({ onSuccess, onCancel }: FeedPlanFormProps) {
  const [loading, setLoading] = useState(false);
  const [cattleGroups, setCattleGroups] = useState<any[]>([]);
  const [cattle, setCattle] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const { toast } = useToast();

  const [feedingType, setFeedingType] = useState<"group" | "individual">("group");
  const [formData, setFormData] = useState({
    name: "",
    cattleGroupId: "",
    cattleId: "",
    startDate: "",
    endDate: "",
    dailyRationPerAnimal: "",
    totalAnimals: 1,
    notes: "",
  });

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { inventoryItemId: "", itemName: "", percentage: "", unit: "", availableQty: "", costPerUnit: "0" },
  ]);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const headers = { Authorization: `Bearer ${token}` };

      const [groupsRes, cattleRes, inventoryRes] = await Promise.all([
        fetch("/api/cattle-groups", { headers }),
        fetch("/api/cattle", { headers }),
        fetch("/api/inventory", { headers }),
      ]);

      if (groupsRes.ok) setCattleGroups(await groupsRes.json());
      if (cattleRes.ok) setCattle(await cattleRes.json());
      if (inventoryRes.ok) setInventory(await inventoryRes.json());
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { inventoryItemId: "", itemName: "", percentage: "", unit: "", availableQty: "", costPerUnit: "0" },
    ]);
  };

  const removeIngredient = (index: number) => {
    // Keep at least one ingredient
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (index: number, field: string, value: string) => {
    const updated = [...ingredients];
    
    if (field === "inventoryItemId") {
      const item = inventory.find((inv) => String(inv.id) === String(value));
      if (item) {
        updated[index] = {
          ...updated[index],
          inventoryItemId: value,
          itemName: item.name,
          unit: item.unit,
          availableQty: item.availableQuantity,
          costPerUnit: item.costPerUnit || "0",
        };
      }
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    
    setIngredients(updated);
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.name.trim()) newErrors.push("Plan name is required");
    if (feedingType === "group") {
      if (!formData.cattleGroupId) newErrors.push("Select a cattle group");
    } else {
      if (!formData.cattleId) newErrors.push("Select individual cattle");
    }
    if (!formData.startDate) newErrors.push("Start date is required");
    if (!formData.endDate) newErrors.push("End date is required");
    if (parseFloat(formData.dailyRationPerAnimal) <= 0) {
      newErrors.push("Daily ration must be greater than 0");
    }
    if (formData.totalAnimals < 1) newErrors.push("At least 1 cattle is required");

    if (ingredients.length === 0) {
      newErrors.push("At least one ingredient is required");
    }

    const totalPercentage = ingredients.reduce(
      (sum, ing) => sum + (parseFloat(ing.percentage) || 0),
      0
    );

    if (Math.abs(totalPercentage - 100) > 0.01) {
      newErrors.push(`Ingredient percentages must total 100% (current: ${totalPercentage.toFixed(2)}%)`);
    }

    ingredients.forEach((ing, idx) => {
      if (!ing.inventoryItemId) {
        newErrors.push(`Ingredient #${idx + 1}: Select an inventory item`);
      }
      if (!ing.percentage || parseFloat(ing.percentage) <= 0) {
        newErrors.push(`Ingredient #${idx + 1}: Percentage must be greater than 0`);
      }
    });

    // Check inventory availability
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const totalDailyRation = parseFloat(formData.dailyRationPerAnimal) * formData.totalAnimals;
    const totalPlanRation = totalDailyRation * durationDays;

    ingredients.forEach((ing) => {
      if (ing.inventoryItemId && ing.percentage) {
        const required = (totalPlanRation * parseFloat(ing.percentage)) / 100;
        const available = parseFloat(ing.availableQty);
        
        if (required > available) {
          newErrors.push(
            `${ing.itemName}: Insufficient inventory. Required: ${required.toFixed(2)}${ing.unit}, Available: ${available}${ing.unit}`
          );
        }
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/feed-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          ingredients: ingredients.map((ing) => ({
            inventoryItemId: ing.inventoryItemId,
            percentage: ing.percentage,
          })),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create feed plan");
      }

      toast({
        title: "Success",
        description: "Feed plan created successfully",
      });

      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalPercentage = ingredients.reduce(
    (sum, ing) => sum + (parseFloat(ing.percentage) || 0),
    0
  );

  // Calculate total cost
  const calculateTotalCost = () => {
    if (!formData.startDate || !formData.endDate || !formData.dailyRationPerAnimal) {
      return 0;
    }
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const totalDailyRation = parseFloat(formData.dailyRationPerAnimal) * formData.totalAnimals;
    const totalPlanRation = totalDailyRation * durationDays;

    let totalCost = 0;
    ingredients.forEach((ing) => {
      if (ing.percentage && ing.costPerUnit) {
        const ingredientQty = (totalPlanRation * parseFloat(ing.percentage)) / 100;
        const cost = ingredientQty * parseFloat(ing.costPerUnit);
        totalCost += cost;
      }
    });

    return totalCost;
  };

  const totalCost = calculateTotalCost();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Feed Plan</CardTitle>
        <CardDescription>
          Set up a feeding schedule with inventory allocation for your cattle
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Plan Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Winter Feeding Plan 2025"
              />
            </div>

            {/* Feeding Type Selection */}
            <div>
              <Label htmlFor="feedingType">Feeding Type *</Label>
              <Select
                value={feedingType}
                onValueChange={(value: "group" | "individual") => {
                  setFeedingType(value);
                  setFormData({ ...formData, cattleGroupId: "", cattleId: "" });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select feeding type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="group">Group Feeding</SelectItem>
                  <SelectItem value="individual">Individual Cattle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Show appropriate field based on feeding type */}
            {feedingType === "group" ? (
              <div>
                <Label htmlFor="cattleGroup">Cattle Group *</Label>
                <Select
                  value={formData.cattleGroupId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, cattleGroupId: value, cattleId: "" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    {cattleGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name} ({group.cattleIds?.length || 0} cattle)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div>
                <Label htmlFor="cattle">Individual Cattle *</Label>
                <Select
                  value={formData.cattleId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, cattleId: value, cattleGroupId: "" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select cattle" />
                  </SelectTrigger>
                  <SelectContent>
                    {cattle.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} ({c.rfidId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  min={formData.startDate}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dailyRation">Daily Ration per Cattle (kg) *</Label>
                <Input
                  id="dailyRation"
                  type="number"
                  step="0.1"
                  value={formData.dailyRationPerAnimal}
                  onChange={(e) =>
                    setFormData({ ...formData, dailyRationPerAnimal: e.target.value })
                  }
                  placeholder="e.g., 15.5"
                />
              </div>

              <div>
                <Label htmlFor="totalAnimals">Total Cattle *</Label>
                <Input
                  id="totalAnimals"
                  type="number"
                  value={formData.totalAnimals}
                  onChange={(e) =>
                    setFormData({ ...formData, totalAnimals: parseInt(e.target.value) || 1 })
                  }
                />
              </div>
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Feed Ingredients * (Must total 100%)</Label>
              <Button type="button" size="sm" onClick={addIngredient} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Ingredient
              </Button>
            </div>

            <div className="space-y-3">
              {ingredients.map((ingredient, index) => {
                // Calculate cost for this ingredient
                const ingredientCost = (() => {
                  if (!formData.startDate || !formData.endDate || !formData.dailyRationPerAnimal || !ingredient.percentage || !ingredient.costPerUnit) {
                    return 0;
                  }
                  const start = new Date(formData.startDate);
                  const end = new Date(formData.endDate);
                  const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                  const totalDailyRation = parseFloat(formData.dailyRationPerAnimal) * formData.totalAnimals;
                  const totalPlanRation = totalDailyRation * durationDays;
                  const ingredientQty = (totalPlanRation * parseFloat(ingredient.percentage)) / 100;
                  return ingredientQty * parseFloat(ingredient.costPerUnit);
                })();

                return (
                  <div
                    key={index}
                    className="p-4 border rounded-lg space-y-3 bg-muted/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Ingredient {index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeIngredient(index)}
                        disabled={ingredients.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Select Ingredient</Label>
                        <Select
                          value={ingredient.inventoryItemId}
                          onValueChange={(value) => updateIngredient(index, "inventoryItemId", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select item" />
                          </SelectTrigger>
                          <SelectContent>
                            {inventory.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                <div className="flex items-center justify-between w-full">
                                  <span className="truncate">{item.name} ({item.availableQuantity} {item.unit})</span>
                                  <span className="text-xs text-muted-foreground">${item.costPerUnit ?? '0'}/unit</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-xs">Percentage (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          value={ingredient.percentage}
                          onChange={(e) => updateIngredient(index, "percentage", e.target.value)}
                          placeholder="0.0"
                        />
                      </div>

                      <div>
                        <Label className="text-xs">Available Quantity</Label>
                        <div className="px-3 py-2 bg-background border rounded-md text-sm">
                          {ingredient.availableQty ? `${ingredient.availableQty} ${ingredient.unit}` : 'N/A'}
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs">Cost for this ingredient</Label>
                        <div className="px-3 py-2 bg-background border rounded-md text-sm font-medium">
                          ${ingredientCost.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {ingredients.length > 0 && (
              <div className="space-y-2">
                <Alert variant={Math.abs(totalPercentage - 100) < 0.01 ? "default" : "destructive"}>
                  {Math.abs(totalPercentage - 100) < 0.01 ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    Total Percentage: <strong>{totalPercentage.toFixed(2)}%</strong> {Math.abs(totalPercentage - 100) < 0.01 ? "✓" : "(Must equal 100%)"}
                  </AlertDescription>
                </Alert>

                <Alert>
                  <AlertDescription className="flex items-center justify-between">
                    <span className="font-semibold">Estimated Total Cost for Feed Plan:</span>
                    <span className="text-lg font-bold text-primary">${totalCost.toFixed(2)}</span>
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes about this feeding plan..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Feed Plan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

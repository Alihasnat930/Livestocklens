import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Calendar, Users, Beef, TrendingUp, AlertCircle, 
  CheckCircle2, XCircle, Play, Pause 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FeedPlan {
  id: string;
  name: string;
  cattleGroupId: string | null;
  cattleId: string | null;
  startDate: string;
  endDate: string;
  dailyRationPerAnimal: string;
  totalAnimals: number;
  status: string;
  notes: string;
  createdAt: string;
}

export default function FeedPlanMonitoring() {
  const [feedPlans, setFeedPlans] = useState<FeedPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelPlanId, setCancelPlanId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadFeedPlans();
  }, []);

  const loadFeedPlans = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/feed-plans", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setFeedPlans(data);
      }
    } catch (error) {
      console.error("Failed to load feed plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (plan: FeedPlan) => {
    const start = new Date(plan.startDate).getTime();
    const end = new Date(plan.endDate).getTime();
    const now = Date.now();
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const total = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / total) * 100);
  };

  const calculateDaysRemaining = (plan: FeedPlan) => {
    const end = new Date(plan.endDate).getTime();
    const now = Date.now();
    const diff = end - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const handleCancelPlan = async (planId: string) => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`/api/feed-plans/${planId}/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Feed plan cancelled and inventory unlocked",
        });
        loadFeedPlans();
      } else {
        throw new Error("Failed to cancel plan");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setCancelPlanId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500"><Play className="h-3 w-3 mr-1" />Active</Badge>;
      case "completed":
        return <Badge className="bg-blue-500"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading feed plans...</div>
        </CardContent>
      </Card>
    );
  }

  const activePlans = feedPlans.filter((p) => p.status === "active");
  const completedPlans = feedPlans.filter((p) => p.status === "completed");
  const cancelledPlans = feedPlans.filter((p) => p.status === "cancelled");

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
            <Play className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePlans.length}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Plans</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedPlans.length}</div>
            <p className="text-xs text-muted-foreground">Successfully finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cattle</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activePlans.reduce((sum, p) => sum + p.totalAnimals, 0)}
            </div>
            <p className="text-xs text-muted-foreground">In active plans</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Plans */}
      {activePlans.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Active Feed Plans</h3>
          {activePlans.map((plan) => {
            const progress = calculateProgress(plan);
            const daysRemaining = calculateDaysRemaining(plan);
            
            return (
              <Card key={plan.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>
                        {new Date(plan.startDate).toLocaleDateString()} -{" "}
                        {new Date(plan.endDate).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    {getStatusBadge(plan.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Plan Progress</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{daysRemaining} days remaining</span>
                      <span>
                        {plan.dailyRationPerAnimal}kg/cattle × {plan.totalAnimals} cattle
                      </span>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Duration
                      </div>
                      <div className="text-sm font-medium">
                        {Math.ceil(
                          (new Date(plan.endDate).getTime() -
                            new Date(plan.startDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        ) + 1}{" "}
                        days
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          Cattle
                        </div>
                      <div className="text-sm font-medium">{plan.totalAnimals}</div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Beef className="h-4 w-4" />
                        Daily Ration
                      </div>
                      <div className="text-sm font-medium">{plan.dailyRationPerAnimal}kg</div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        Total Planned
                      </div>
                      <div className="text-sm font-medium">
                        {(
                          parseFloat(plan.dailyRationPerAnimal) *
                          plan.totalAnimals *
                          (Math.ceil(
                            (new Date(plan.endDate).getTime() -
                              new Date(plan.startDate).getTime()) /
                              (1000 * 60 * 60 * 24)
                          ) + 1)
                        ).toFixed(0)}
                        kg
                      </div>
                    </div>
                  </div>

                  {plan.notes && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{plan.notes}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setCancelPlanId(plan.id)}
                    >
                      Cancel Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Completed Plans */}
      {completedPlans.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Completed Feed Plans</h3>
          {completedPlans.slice(0, 5).map((plan) => (
            <Card key={plan.id} className="bg-muted/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{plan.name}</CardTitle>
                    <CardDescription>
                      {new Date(plan.startDate).toLocaleDateString()} -{" "}
                      {new Date(plan.endDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  {getStatusBadge(plan.status)}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {feedPlans.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Feed Plans Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first feed plan to start managing cattle feeding schedules
            </p>
          </CardContent>
        </Card>
      )}

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={!!cancelPlanId} onOpenChange={() => setCancelPlanId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Feed Plan?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel the feed plan and unlock all reserved inventory. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Keep Plan</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => cancelPlanId && handleCancelPlan(cancelPlanId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, Cancel Plan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

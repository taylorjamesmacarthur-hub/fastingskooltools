import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Clock, 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  Copy,
  Star
} from 'lucide-react';

interface WindowPlan {
  id: number;
  name: string;
  description: string;
  schedule: {
    [key: string]: {
      startTime: string;
      endTime: string;
      fastingHours: number;
    };
  };
  isActive: boolean;
}

export const WindowPlannerPage = () => {
  const [plans, setPlans] = useState<WindowPlan[]>([
    {
      id: 1,
      name: 'Standard 16:8',
      description: 'Consistent 16:8 schedule every day',
      schedule: {
        monday: { startTime: '12:00', endTime: '20:00', fastingHours: 16 },
        tuesday: { startTime: '12:00', endTime: '20:00', fastingHours: 16 },
        wednesday: { startTime: '12:00', endTime: '20:00', fastingHours: 16 },
        thursday: { startTime: '12:00', endTime: '20:00', fastingHours: 16 },
        friday: { startTime: '12:00', endTime: '20:00', fastingHours: 16 },
        saturday: { startTime: '12:00', endTime: '20:00', fastingHours: 16 },
        sunday: { startTime: '12:00', endTime: '20:00', fastingHours: 16 },
      },
      isActive: true,
    },
    {
      id: 2,
      name: 'Weekend Warrior',
      description: 'Extended fasts on weekends, moderate weekdays',
      schedule: {
        monday: { startTime: '12:00', endTime: '20:00', fastingHours: 16 },
        tuesday: { startTime: '12:00', endTime: '20:00', fastingHours: 16 },
        wednesday: { startTime: '12:00', endTime: '20:00', fastingHours: 16 },
        thursday: { startTime: '12:00', endTime: '20:00', fastingHours: 16 },
        friday: { startTime: '12:00', endTime: '20:00', fastingHours: 16 },
        saturday: { startTime: '14:00', endTime: '20:00', fastingHours: 18 },
        sunday: { startTime: '14:00', endTime: '20:00', fastingHours: 18 },
      },
      isActive: false,
    },
  ]);

  const [editingPlan, setEditingPlan] = useState<WindowPlan | null>(null);
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    schedule: {
      monday: { startTime: '12:00', endTime: '20:00', fastingHours: 16 },
      tuesday: { startTime: '12:00', endTime: '20:00', fastingHours: 16 },
      wednesday: { startTime: '12:00', endTime: '20:00', fastingHours: 16 },
      thursday: { startTime: '12:00', endTime: '20:00', fastingHours: 16 },
      friday: { startTime: '12:00', endTime: '20:00', fastingHours: 16 },
      saturday: { startTime: '12:00', endTime: '20:00', fastingHours: 16 },
      sunday: { startTime: '12:00', endTime: '20:00', fastingHours: 16 },
    },
  });

  const daysOfWeek = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];

  const dayLabels = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  };

  const calculateFastingHours = (startTime: string, endTime: string): number => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    // Handle overnight eating windows
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }
    
    const eatingHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return 24 - eatingHours;
  };

  const updateScheduleTime = (day: string, field: 'startTime' | 'endTime', value: string, isEditing = false) => {
    const target = isEditing ? editingPlan : newPlan;
    if (!target) return;

    const updatedSchedule = {
      ...target.schedule,
      [day]: {
        ...target.schedule[day],
        [field]: value,
      },
    };

    // Recalculate fasting hours
    const daySchedule = updatedSchedule[day];
    daySchedule.fastingHours = calculateFastingHours(daySchedule.startTime, daySchedule.endTime);

    if (isEditing && editingPlan) {
      setEditingPlan({
        ...editingPlan,
        schedule: updatedSchedule,
      });
    } else {
      setNewPlan({
        ...newPlan,
        schedule: updatedSchedule,
      });
    }
  };

  const savePlan = async () => {
    const planData = editingPlan || {
      ...newPlan,
      id: Date.now(),
      isActive: false,
    };

    try {
      const response = await fetch('/api/window-plans', {
        method: editingPlan ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(planData),
      });

      if (response.ok) {
        if (editingPlan) {
          setPlans(plans.map(p => p.id === editingPlan.id ? planData : p));
          setEditingPlan(null);
        } else {
          setPlans([...plans, planData as WindowPlan]);
          setNewPlan({
            name: '',
            description: '',
            schedule: {
              monday: { startTime: '12:00', endTime: '20:00', fastingHours: 16 },
              tuesday: { startTime: '12:00', endTime: '20:00', fastingHours: 16 },
              wednesday: { startTime: '12:00', endTime: '20:00', fastingHours: 16 },
              thursday: { startTime: '12:00', endTime: '20:00', fastingHours: 16 },
              friday: { startTime: '12:00', endTime: '20:00', fastingHours: 16 },
              saturday: { startTime: '12:00', endTime: '20:00', fastingHours: 16 },
              sunday: { startTime: '12:00', endTime: '20:00', fastingHours: 16 },
            },
          });
        }
      }
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  const activatePlan = (planId: number) => {
    setPlans(plans.map(p => ({
      ...p,
      isActive: p.id === planId,
    })));
  };

  const deletePlan = (planId: number) => {
    setPlans(plans.filter(p => p.id !== planId));
  };

  const duplicatePlan = (plan: WindowPlan) => {
    const newPlanData = {
      ...plan,
      id: Date.now(),
      name: `${plan.name} (Copy)`,
      isActive: false,
    };
    setPlans([...plans, newPlanData]);
  };

  const quickTemplates = [
    {
      name: '16:8 Standard',
      schedule: { startTime: '12:00', endTime: '20:00' },
    },
    {
      name: '18:6 Focused',
      schedule: { startTime: '14:00', endTime: '20:00' },
    },
    {
      name: '20:4 Warrior',
      schedule: { startTime: '16:00', endTime: '20:00' },
    },
    {
      name: 'OMAD',
      schedule: { startTime: '18:00', endTime: '19:00' },
    },
  ];

  const applyTemplate = (template: any, isEditing = false) => {
    const updatedSchedule = Object.keys(dayLabels).reduce((acc, day) => {
      acc[day] = {
        ...template.schedule,
        fastingHours: calculateFastingHours(template.schedule.startTime, template.schedule.endTime),
      };
      return acc;
    }, {} as any);

    if (isEditing && editingPlan) {
      setEditingPlan({
        ...editingPlan,
        schedule: updatedSchedule,
      });
    } else {
      setNewPlan({
        ...newPlan,
        schedule: updatedSchedule,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Clock className="w-8 h-8" />
          Fast Window Planner
        </h1>
        <p className="text-muted-foreground">
          Create flexible fasting schedules that adapt to your lifestyle
        </p>
      </div>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList>
          <TabsTrigger value="plans">My Plans</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          {/* Active Plan */}
          {plans.find(p => p.isActive) && (
            <Card className="border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-primary" />
                      Active Plan: {plans.find(p => p.isActive)?.name}
                    </CardTitle>
                    <CardDescription>
                      {plans.find(p => p.isActive)?.description}
                    </CardDescription>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                  {daysOfWeek.map((day) => {
                    const activePlan = plans.find(p => p.isActive);
                    const daySchedule = activePlan?.schedule[day];
                    
                    return (
                      <div key={day} className="text-center p-3 bg-primary/5 rounded-lg">
                        <div className="font-medium text-sm mb-2">
                          {dayLabels[day as keyof typeof dayLabels]}
                        </div>
                        <div className="text-xs text-muted-foreground mb-1">
                          {daySchedule?.startTime} - {daySchedule?.endTime}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {daySchedule?.fastingHours}h fast
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Plans */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className={plan.isActive ? 'opacity-50' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {plan.isActive && <Badge variant="default">Active</Badge>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {daysOfWeek.map((day) => {
                      const daySchedule = plan.schedule[day];
                      return (
                        <div key={day} className="flex items-center justify-between text-sm">
                          <span className="font-medium">
                            {dayLabels[day as keyof typeof dayLabels]}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              {daySchedule.startTime} - {daySchedule.endTime}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {daySchedule.fastingHours}h
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                    {!plan.isActive && (
                      <Button
                        size="sm"
                        onClick={() => activatePlan(plan.id)}
                      >
                        <Star className="w-4 h-4 mr-1" />
                        Activate
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingPlan(plan)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => duplicatePlan(plan)}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deletePlan(plan.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Plan</CardTitle>
              <CardDescription>
                Design a custom fasting schedule that works for your lifestyle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Plan Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="planName">Plan Name</Label>
                  <Input
                    id="planName"
                    placeholder="My Custom Plan"
                    value={editingPlan?.name || newPlan.name}
                    onChange={(e) => {
                      if (editingPlan) {
                        setEditingPlan({ ...editingPlan, name: e.target.value });
                      } else {
                        setNewPlan({ ...newPlan, name: e.target.value });
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="planDescription">Description</Label>
                  <Input
                    id="planDescription"
                    placeholder="Brief description of this plan"
                    value={editingPlan?.description || newPlan.description}
                    onChange={(e) => {
                      if (editingPlan) {
                        setEditingPlan({ ...editingPlan, description: e.target.value });
                      } else {
                        setNewPlan({ ...newPlan, description: e.target.value });
                      }
                    }}
                  />
                </div>
              </div>

              {/* Quick Templates */}
              <div>
                <Label className="text-base font-medium">Quick Templates</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Apply a template to all days, then customize individual days as needed
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {quickTemplates.map((template) => (
                    <Button
                      key={template.name}
                      variant="outline"
                      onClick={() => applyTemplate(template, !!editingPlan)}
                      className="flex flex-col h-auto py-3"
                    >
                      <span className="font-medium">{template.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {template.schedule.startTime} - {template.schedule.endTime}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Weekly Schedule */}
              <div>
                <Label className="text-base font-medium">Weekly Schedule</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Set your eating window for each day of the week
                </p>
                <div className="space-y-4">
                  {daysOfWeek.map((day) => {
                    const currentPlan = editingPlan || newPlan;
                    const daySchedule = currentPlan.schedule[day];
                    
                    return (
                      <div key={day} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-4 border rounded-lg">
                        <div className="font-medium">
                          {dayLabels[day as keyof typeof dayLabels]}
                        </div>
                        
                        <div className="space-y-1">
                          <Label className="text-xs">Eating Starts</Label>
                          <Input
                            type="time"
                            value={daySchedule.startTime}
                            onChange={(e) => updateScheduleTime(day, 'startTime', e.target.value, !!editingPlan)}
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label className="text-xs">Eating Ends</Label>
                          <Input
                            type="time"
                            value={daySchedule.endTime}
                            onChange={(e) => updateScheduleTime(day, 'endTime', e.target.value, !!editingPlan)}
                          />
                        </div>
                        
                        <div className="text-center">
                          <Badge variant="secondary">
                            {daySchedule.fastingHours.toFixed(1)}h fast
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4">
                {editingPlan && (
                  <Button variant="outline" onClick={() => setEditingPlan(null)}>
                    Cancel
                  </Button>
                )}
                <Button onClick={savePlan}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingPlan ? 'Update Plan' : 'Save Plan'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Clock, Plus, Edit, Trash2, Calendar, Save } from 'lucide-react';

export const WindowPlannerPage = () => {
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: 'Weekday 16:8',
      description: 'Standard workday schedule',
      schedule: {
        monday: { start: '20:00', end: '12:00', active: true },
        tuesday: { start: '20:00', end: '12:00', active: true },
        wednesday: { start: '20:00', end: '12:00', active: true },
        thursday: { start: '20:00', end: '12:00', active: true },
        friday: { start: '20:00', end: '12:00', active: true },
        saturday: { start: '22:00', end: '14:00', active: false },
        sunday: { start: '22:00', end: '14:00', active: false },
      },
      isActive: true,
    },
    {
      id: 2,
      name: 'Weekend Flexible',
      description: 'Relaxed weekend schedule',
      schedule: {
        monday: { start: '20:00', end: '12:00', active: false },
        tuesday: { start: '20:00', end: '12:00', active: false },
        wednesday: { start: '20:00', end: '12:00', active: false },
        thursday: { start: '20:00', end: '12:00', active: false },
        friday: { start: '20:00', end: '12:00', active: false },
        saturday: { start: '22:00', end: '14:00', active: true },
        sunday: { start: '22:00', end: '14:00', active: true },
      },
      isActive: false,
    },
  ]);

  const [editingPlan, setEditingPlan] = useState(null);
  const [showNewPlan, setShowNewPlan] = useState(false);

  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    schedule: {
      monday: { start: '20:00', end: '12:00', active: true },
      tuesday: { start: '20:00', end: '12:00', active: true },
      wednesday: { start: '20:00', end: '12:00', active: true },
      thursday: { start: '20:00', end: '12:00', active: true },
      friday: { start: '20:00', end: '12:00', active: true },
      saturday: { start: '20:00', end: '12:00', active: true },
      sunday: { start: '20:00', end: '12:00', active: true },
    },
  });

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const calculateFastingHours = (start: string, end: string) => {
    const startTime = new Date(`2024-01-01 ${start}`);
    let endTime = new Date(`2024-01-01 ${end}`);
    
    // If end time is earlier than start time, it's next day
    if (endTime <= startTime) {
      endTime = new Date(`2024-01-02 ${end}`);
    }
    
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return Math.round(diffHours * 10) / 10;
  };

  const activatePlan = (planId: number) => {
    setPlans(plans.map(plan => ({
      ...plan,
      isActive: plan.id === planId
    })));
  };

  const deletePlan = (planId: number) => {
    setPlans(plans.filter(plan => plan.id !== planId));
  };

  const saveNewPlan = () => {
    const plan = {
      ...newPlan,
      id: Date.now(),
      isActive: false,
    };
    setPlans([...plans, plan]);
    setNewPlan({
      name: '',
      description: '',
      schedule: {
        monday: { start: '20:00', end: '12:00', active: true },
        tuesday: { start: '20:00', end: '12:00', active: true },
        wednesday: { start: '20:00', end: '12:00', active: true },
        thursday: { start: '20:00', end: '12:00', active: true },
        friday: { start: '20:00', end: '12:00', active: true },
        saturday: { start: '20:00', end: '12:00', active: true },
        sunday: { start: '20:00', end: '12:00', active: true },
      },
    });
    setShowNewPlan(false);
  };

  const updateNewPlanSchedule = (day: string, field: string, value: string | boolean) => {
    setNewPlan(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          [field]: value,
        },
      },
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Fasting Window Planner</h1>
        <p className="text-muted-foreground">Create and manage your personalized fasting schedules</p>
      </div>

      {/* Active Plan Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            This Week's Schedule
          </CardTitle>
          <CardDescription>Your currently active fasting plan</CardDescription>
        </CardHeader>
        <CardContent>
          {(() => {
            const activePlan = plans.find(p => p.isActive);
            if (!activePlan) {
              return <p className="text-muted-foreground">No active plan selected</p>;
            }

            return (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{activePlan.name}</h3>
                    <p className="text-sm text-muted-foreground">{activePlan.description}</p>
                  </div>
                  <Badge>Active</Badge>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {days.map((day, index) => {
                    const daySchedule = activePlan.schedule[day];
                    const fastingHours = calculateFastingHours(daySchedule.start, daySchedule.end);
                    
                    return (
                      <div key={day} className={`p-3 rounded-lg border text-center ${
                        daySchedule.active ? 'bg-primary/10 border-primary/20' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="font-medium text-sm">{dayLabels[index]}</div>
                        {daySchedule.active ? (
                          <>
                            <div className="text-xs text-muted-foreground mt-1">
                              {daySchedule.start} - {daySchedule.end}
                            </div>
                            <div className="text-xs font-medium mt-1">
                              {fastingHours}h fast
                            </div>
                          </>
                        ) : (
                          <div className="text-xs text-muted-foreground mt-1">Rest day</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {/* Plan Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Existing Plans */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Plans</h2>
            <Button onClick={() => setShowNewPlan(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Plan
            </Button>
          </div>

          <div className="space-y-4">
            {plans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {plan.isActive && <Badge>Active</Badge>}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingPlan(plan.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deletePlan(plan.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {days.map((day, index) => {
                      const daySchedule = plan.schedule[day];
                      if (!daySchedule.active) return null;
                      
                      const fastingHours = calculateFastingHours(daySchedule.start, daySchedule.end);
                      
                      return (
                        <div key={day} className="flex justify-between text-sm">
                          <span>{dayLabels[index]}</span>
                          <span>{daySchedule.start} - {daySchedule.end} ({fastingHours}h)</span>
                        </div>
                      );
                    })}
                  </div>
                  {!plan.isActive && (
                    <Button
                      className="w-full mt-4"
                      onClick={() => activatePlan(plan.id)}
                    >
                      Activate Plan
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* New Plan Form */}
        {showNewPlan && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Plan</CardTitle>
              <CardDescription>Design a custom fasting schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="planName">Plan Name</Label>
                <Input
                  id="planName"
                  placeholder="e.g., Weekday 16:8"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="planDescription">Description</Label>
                <Input
                  id="planDescription"
                  placeholder="Brief description of this plan"
                  value={newPlan.description}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div>
                <Label>Weekly Schedule</Label>
                <div className="space-y-3 mt-2">
                  {days.map((day, index) => {
                    const daySchedule = newPlan.schedule[day];
                    
                    return (
                      <div key={day} className="flex items-center space-x-3">
                        <div className="w-12 text-sm font-medium">{dayLabels[index]}</div>
                        <input
                          type="checkbox"
                          checked={daySchedule.active}
                          onChange={(e) => updateNewPlanSchedule(day, 'active', e.target.checked)}
                          className="rounded"
                        />
                        {daySchedule.active && (
                          <>
                            <Input
                              type="time"
                              value={daySchedule.start}
                              onChange={(e) => updateNewPlanSchedule(day, 'start', e.target.value)}
                              className="w-24"
                            />
                            <span className="text-sm text-muted-foreground">to</span>
                            <Input
                              type="time"
                              value={daySchedule.end}
                              onChange={(e) => updateNewPlanSchedule(day, 'end', e.target.value)}
                              className="w-24"
                            />
                            <span className="text-sm text-muted-foreground">
                              ({calculateFastingHours(daySchedule.start, daySchedule.end)}h)
                            </span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={saveNewPlan} disabled={!newPlan.name}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Plan
                </Button>
                <Button variant="outline" onClick={() => setShowNewPlan(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
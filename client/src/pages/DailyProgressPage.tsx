import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Scale, 
  Footprints, 
  Droplets, 
  Dumbbell,
  Smile,
  Battery,
  Save,
  Plus
} from 'lucide-react';

export const DailyProgressPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    cleanFast: true,
    mood: 3,
    energyLevel: 3,
    weight: '',
    steps: '',
    waterIntake: '',
    exerciseMinutes: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate fasting hours
    const fastingHours = calculateFastingHours(formData.startTime, formData.endTime);
    
    const logData = {
      date: selectedDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      fastingHours,
      cleanFast: formData.cleanFast,
      mood: formData.mood,
      energyLevel: formData.energyLevel,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      steps: formData.steps ? parseInt(formData.steps) : null,
      waterIntake: formData.waterIntake ? parseFloat(formData.waterIntake) : null,
      exerciseMinutes: formData.exerciseMinutes ? parseInt(formData.exerciseMinutes) : null,
      notes: formData.notes,
    };

    try {
      const response = await fetch('/api/daily-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(logData),
      });

      if (response.ok) {
        // Reset form or show success message
        console.log('Log saved successfully');
      }
    } catch (error) {
      console.error('Error saving log:', error);
    }
  };

  const calculateFastingHours = (startTime: string, endTime: string): number => {
    if (!startTime || !endTime) return 0;
    
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    // Handle overnight fasting
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }
    
    const diffMs = end.getTime() - start.getTime();
    return diffMs / (1000 * 60 * 60); // Convert to hours
  };

  const fastingHours = calculateFastingHours(formData.startTime, formData.endTime);

  const moodEmojis = ['😢', '😕', '😐', '😊', '😄'];
  const energyEmojis = ['🔋', '🔋', '🔋', '🔋', '🔋'];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Calendar className="w-8 h-8" />
          Daily Progress Log
        </h1>
        <p className="text-muted-foreground">
          Track your fasting window, wellness metrics, and daily observations
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
            <CardDescription>
              Choose the date you want to log
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="max-w-xs"
            />
          </CardContent>
        </Card>

        {/* Fasting Window */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Fasting Window
            </CardTitle>
            <CardDescription>
              When did your eating window start and end?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Eating Started</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endTime">Eating Ended</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Fasting Hours</Label>
                <div className="flex items-center h-10 px-3 py-2 border border-input bg-background rounded-md">
                  <span className="font-medium">
                    {fastingHours > 0 ? `${fastingHours.toFixed(1)}h` : '0h'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="cleanFast"
                  checked={formData.cleanFast}
                  onChange={(e) => setFormData({ ...formData, cleanFast: e.target.checked })}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="cleanFast">Clean fast (water, black coffee, plain tea only)</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wellness Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Wellness Metrics</CardTitle>
            <CardDescription>
              How are you feeling today?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mood */}
              <div className="space-y-3">
                <Label>Mood</Label>
                <div className="flex items-center space-x-2">
                  {moodEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormData({ ...formData, mood: index + 1 })}
                      className={`text-2xl p-2 rounded-lg transition-colors ${
                        formData.mood === index + 1
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Current: {moodEmojis[formData.mood - 1]} ({formData.mood}/5)
                </p>
              </div>

              {/* Energy Level */}
              <div className="space-y-3">
                <Label>Energy Level</Label>
                <div className="flex items-center space-x-2">
                  {energyEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormData({ ...formData, energyLevel: index + 1 })}
                      className={`text-2xl p-2 rounded-lg transition-colors ${
                        formData.energyLevel > index
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent'
                      }`}
                    >
                      <Battery className="w-6 h-6" />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Current: {formData.energyLevel}/5
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Physical Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Physical Metrics</CardTitle>
            <CardDescription>
              Optional measurements and activity data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight" className="flex items-center gap-2">
                  <Scale className="w-4 h-4" />
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="70.5"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="steps" className="flex items-center gap-2">
                  <Footprints className="w-4 h-4" />
                  Steps
                </Label>
                <Input
                  id="steps"
                  type="number"
                  placeholder="10000"
                  value={formData.steps}
                  onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="waterIntake" className="flex items-center gap-2">
                  <Droplets className="w-4 h-4" />
                  Water (L)
                </Label>
                <Input
                  id="waterIntake"
                  type="number"
                  step="0.1"
                  placeholder="2.5"
                  value={formData.waterIntake}
                  onChange={(e) => setFormData({ ...formData, waterIntake: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exerciseMinutes" className="flex items-center gap-2">
                  <Dumbbell className="w-4 h-4" />
                  Exercise (min)
                </Label>
                <Input
                  id="exerciseMinutes"
                  type="number"
                  placeholder="30"
                  value={formData.exerciseMinutes}
                  onChange={(e) => setFormData({ ...formData, exerciseMinutes: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>
              Any observations, challenges, or wins from today?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="How did you feel during your fast? Any challenges or victories to note?"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <Button type="submit">
            <Save className="w-4 h-4 mr-2" />
            Save Log Entry
          </Button>
        </div>
      </form>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common fasting patterns for quick logging
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: '16:8', start: '12:00', end: '20:00' },
              { name: '18:6', start: '14:00', end: '20:00' },
              { name: '20:4', start: '16:00', end: '20:00' },
              { name: 'OMAD', start: '18:00', end: '19:00' },
            ].map((pattern) => (
              <Button
                key={pattern.name}
                variant="outline"
                onClick={() => setFormData({
                  ...formData,
                  startTime: pattern.start,
                  endTime: pattern.end,
                })}
                className="flex flex-col h-auto py-3"
              >
                <Badge variant="secondary" className="mb-1">
                  {pattern.name}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {pattern.start} - {pattern.end}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
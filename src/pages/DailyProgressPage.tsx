import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Calendar, Clock, Droplets, Activity, Weight, Smile, Battery } from 'lucide-react';

export const DailyProgressPage = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    weight: '',
    waterIntake: '',
    steps: '',
    exerciseMinutes: '',
    mood: 3,
    energyLevel: 3,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting daily log:', formData);
    // Here you would typically send to API
  };

  const updateField = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const moodEmojis = ['😢', '😕', '😐', '😊', '😄'];
  const energyLevels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Daily Progress</h1>
        <p className="text-muted-foreground">Log your daily fasting and wellness metrics</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fasting Window */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Fasting Window
              </CardTitle>
              <CardDescription>Record your fasting start and end times</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateField('date', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Fast Started</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => updateField('startTime', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">Fast Ended</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => updateField('endTime', e.target.value)}
                  />
                </div>
              </div>
              {formData.startTime && formData.endTime && (
                <div className="bg-primary/10 p-3 rounded-lg">
                  <p className="text-sm font-medium">
                    Fasting Duration: {/* Calculate duration here */}
                    <Badge variant="secondary" className="ml-2">16:8</Badge>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Physical Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Weight className="w-5 h-5" />
                Physical Metrics
              </CardTitle>
              <CardDescription>Track your physical measurements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="70.5"
                  value={formData.weight}
                  onChange={(e) => updateField('weight', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="waterIntake">Water Intake (L)</Label>
                <div className="relative">
                  <Droplets className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="waterIntake"
                    type="number"
                    step="0.1"
                    placeholder="2.5"
                    className="pl-10"
                    value={formData.waterIntake}
                    onChange={(e) => updateField('waterIntake', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="steps">Steps</Label>
                <div className="relative">
                  <Activity className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="steps"
                    type="number"
                    placeholder="10000"
                    className="pl-10"
                    value={formData.steps}
                    onChange={(e) => updateField('steps', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="exerciseMinutes">Exercise (minutes)</Label>
                <Input
                  id="exerciseMinutes"
                  type="number"
                  placeholder="30"
                  value={formData.exerciseMinutes}
                  onChange={(e) => updateField('exerciseMinutes', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Wellness Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smile className="w-5 h-5" />
              Wellness Check
            </CardTitle>
            <CardDescription>How are you feeling today?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-medium">Mood</Label>
              <div className="flex items-center space-x-2 mt-2">
                {moodEmojis.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => updateField('mood', index + 1)}
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
            </div>

            <div>
              <Label className="text-base font-medium">Energy Level</Label>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {energyLevels.map((level, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant={formData.energyLevel === index + 1 ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateField('energyLevel', index + 1)}
                    className="text-xs"
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <textarea
                id="notes"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="How did you feel during your fast? Any observations or challenges?"
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <Button type="submit">
            Log Progress
          </Button>
        </div>
      </form>
    </div>
  );
};
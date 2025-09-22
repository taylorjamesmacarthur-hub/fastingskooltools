import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  User, 
  Target, 
  Clock, 
  Zap 
} from 'lucide-react';

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    // Personal Info
    age: '',
    weight: '',
    height: '',
    sex: 'M',
    activityLevel: 'moderate',
    
    // Goals
    primaryGoal: 'weight_loss',
    targetWeight: '',
    timeline: '3_months',
    
    // Fasting Preferences
    fastingExperience: 'beginner',
    preferredWindow: '16:8',
    startTime: '12:00',
    endTime: '20:00',
    
    // Lifestyle
    workSchedule: 'regular',
    sleepSchedule: '23:00',
    wakeTime: '07:00',
  });

  const steps = [
    {
      title: 'Personal Information',
      description: 'Tell us about yourself',
      icon: User,
    },
    {
      title: 'Your Goals',
      description: 'What do you want to achieve?',
      icon: Target,
    },
    {
      title: 'Fasting Preferences',
      description: 'Choose your ideal schedule',
      icon: Clock,
    },
    {
      title: 'Ready to Start!',
      description: 'Your personalized plan',
      icon: Zap,
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    // Save onboarding data and redirect to dashboard
    localStorage.setItem('onboardingCompleted', 'true');
    localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
    navigate('/');
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Welcome to Fasting Skool</h1>
            <Badge variant="secondary">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </div>
          <Progress value={progress} className="mb-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            {steps.map((step, index) => (
              <span
                key={index}
                className={`${
                  index <= currentStep ? 'text-primary font-medium' : ''
                }`}
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              {React.createElement(steps[currentStep].icon, { className: "w-6 h-6 text-primary" })}
              <div>
                <CardTitle>{steps[currentStep].title}</CardTitle>
                <CardDescription>{steps[currentStep].description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Step 0: Personal Information */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="30"
                      value={onboardingData.age}
                      onChange={(e) => setOnboardingData({ ...onboardingData, age: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="70"
                      value={onboardingData.weight}
                      onChange={(e) => setOnboardingData({ ...onboardingData, weight: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="175"
                      value={onboardingData.height}
                      onChange={(e) => setOnboardingData({ ...onboardingData, height: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Sex</Label>
                    <div className="flex gap-2">
                      {[
                        { value: 'M', label: 'Male' },
                        { value: 'F', label: 'Female' },
                      ].map((option) => (
                        <Button
                          key={option.value}
                          type="button"
                          variant={onboardingData.sex === option.value ? 'default' : 'outline'}
                          onClick={() => setOnboardingData({ ...onboardingData, sex: option.value })}
                          className="flex-1"
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Activity Level</Label>
                    <select
                      value={onboardingData.activityLevel}
                      onChange={(e) => setOnboardingData({ ...onboardingData, activityLevel: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="sedentary">Sedentary</option>
                      <option value="light">Light</option>
                      <option value="moderate">Moderate</option>
                      <option value="active">Active</option>
                      <option value="very_active">Very Active</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Goals */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Primary Goal</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { value: 'weight_loss', label: 'Lose Weight', description: 'Reduce body weight and fat' },
                      { value: 'maintenance', label: 'Maintain Weight', description: 'Stay at current weight' },
                      { value: 'muscle_gain', label: 'Build Muscle', description: 'Gain lean muscle mass' },
                      { value: 'health', label: 'Improve Health', description: 'General health benefits' },
                    ].map((goal) => (
                      <label
                        key={goal.value}
                        className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                          onboardingData.primaryGoal === goal.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:bg-accent'
                        }`}
                      >
                        <input
                          type="radio"
                          name="primaryGoal"
                          value={goal.value}
                          checked={onboardingData.primaryGoal === goal.value}
                          onChange={(e) => setOnboardingData({ ...onboardingData, primaryGoal: e.target.value })}
                          className="text-primary"
                        />
                        <div>
                          <div className="font-medium">{goal.label}</div>
                          <div className="text-sm text-muted-foreground">{goal.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {onboardingData.primaryGoal === 'weight_loss' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="targetWeight">Target Weight (kg)</Label>
                      <Input
                        id="targetWeight"
                        type="number"
                        step="0.1"
                        placeholder="65"
                        value={onboardingData.targetWeight}
                        onChange={(e) => setOnboardingData({ ...onboardingData, targetWeight: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Timeline</Label>
                      <select
                        value={onboardingData.timeline}
                        onChange={(e) => setOnboardingData({ ...onboardingData, timeline: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="1_month">1 Month</option>
                        <option value="3_months">3 Months</option>
                        <option value="6_months">6 Months</option>
                        <option value="1_year">1 Year</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Fasting Preferences */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Fasting Experience</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { value: 'beginner', label: 'Beginner', description: 'New to intermittent fasting' },
                      { value: 'intermediate', label: 'Intermediate', description: 'Some experience with fasting' },
                      { value: 'advanced', label: 'Advanced', description: 'Experienced faster' },
                    ].map((level) => (
                      <label
                        key={level.value}
                        className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                          onboardingData.fastingExperience === level.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:bg-accent'
                        }`}
                      >
                        <input
                          type="radio"
                          name="fastingExperience"
                          value={level.value}
                          checked={onboardingData.fastingExperience === level.value}
                          onChange={(e) => setOnboardingData({ ...onboardingData, fastingExperience: e.target.value })}
                          className="text-primary"
                        />
                        <div>
                          <div className="font-medium">{level.label}</div>
                          <div className="text-sm text-muted-foreground">{level.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Preferred Fasting Window</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { value: '12:12', label: '12:12', description: 'Beginner friendly' },
                      { value: '14:10', label: '14:10', description: 'Moderate' },
                      { value: '16:8', label: '16:8', description: 'Most popular' },
                      { value: '18:6', label: '18:6', description: 'Advanced' },
                    ].map((window) => (
                      <Button
                        key={window.value}
                        type="button"
                        variant={onboardingData.preferredWindow === window.value ? 'default' : 'outline'}
                        onClick={() => setOnboardingData({ ...onboardingData, preferredWindow: window.value })}
                        className="flex flex-col h-auto py-3"
                      >
                        <span className="font-medium">{window.label}</span>
                        <span className="text-xs text-muted-foreground">{window.description}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Eating Window Start</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={onboardingData.startTime}
                      onChange={(e) => setOnboardingData({ ...onboardingData, startTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">Eating Window End</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={onboardingData.endTime}
                      onChange={(e) => setOnboardingData({ ...onboardingData, endTime: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Summary */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-950/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">You're All Set!</h3>
                  <p className="text-muted-foreground">
                    Here's your personalized fasting plan based on your preferences
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Your Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Age:</span>
                        <span>{onboardingData.age} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Weight:</span>
                        <span>{onboardingData.weight} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Height:</span>
                        <span>{onboardingData.height} cm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Activity:</span>
                        <span className="capitalize">{onboardingData.activityLevel}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Your Plan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fasting Window:</span>
                        <Badge>{onboardingData.preferredWindow}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Eating Time:</span>
                        <span>{onboardingData.startTime} - {onboardingData.endTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Experience:</span>
                        <span className="capitalize">{onboardingData.fastingExperience}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Goal:</span>
                        <span className="capitalize">{onboardingData.primaryGoal.replace('_', ' ')}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-primary/10 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">What's Next?</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Start with your personalized fasting schedule</li>
                    <li>• Log your daily progress to track improvements</li>
                    <li>• Use the meal planner for nutrition guidance</li>
                    <li>• Monitor your achievements on the scoreboard</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={completeOnboarding}>
              Get Started
              <Zap className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
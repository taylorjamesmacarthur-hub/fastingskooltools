import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import { CheckCircle, ArrowRight, User, Scale, Ruler, Activity } from 'lucide-react';

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    activityLevel: 'moderate',
    fastingGoal: '16:8',
    experience: 'beginner'
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      navigate('/');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Fasting Skool</h1>
          <p className="text-muted-foreground">Let's personalize your fasting journey</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Basic Information"}
              {currentStep === 2 && "Physical Details"}
              {currentStep === 3 && "Activity Level"}
              {currentStep === 4 && "Fasting Goals"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us a bit about yourself"}
              {currentStep === 2 && "Help us calculate your nutritional needs"}
              {currentStep === 3 && "How active are you?"}
              {currentStep === 4 && "What are your fasting goals?"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-center mb-6">
                  <User className="w-16 h-16 text-primary" />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={(e) => updateFormData('age', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Experience Level</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {['beginner', 'intermediate', 'advanced'].map((level) => (
                      <Button
                        key={level}
                        variant={formData.experience === level ? 'default' : 'outline'}
                        onClick={() => updateFormData('experience', level)}
                        className="capitalize"
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Physical Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-center mb-6">
                  <div className="flex space-x-4">
                    <Scale className="w-12 h-12 text-primary" />
                    <Ruler className="w-12 h-12 text-primary" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="70"
                      value={formData.weight}
                      onChange={(e) => updateFormData('weight', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="175"
                      value={formData.height}
                      onChange={(e) => updateFormData('height', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Activity Level */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-center mb-6">
                  <Activity className="w-16 h-16 text-primary" />
                </div>
                <div className="space-y-3">
                  {[
                    { value: 'sedentary', label: 'Sedentary', desc: 'Little to no exercise' },
                    { value: 'light', label: 'Light Activity', desc: 'Light exercise 1-3 days/week' },
                    { value: 'moderate', label: 'Moderate Activity', desc: 'Moderate exercise 3-5 days/week' },
                    { value: 'active', label: 'Very Active', desc: 'Hard exercise 6-7 days/week' }
                  ].map((activity) => (
                    <Button
                      key={activity.value}
                      variant={formData.activityLevel === activity.value ? 'default' : 'outline'}
                      onClick={() => updateFormData('activityLevel', activity.value)}
                      className="w-full justify-start h-auto p-4"
                    >
                      <div className="text-left">
                        <div className="font-medium">{activity.label}</div>
                        <div className="text-sm text-muted-foreground">{activity.desc}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Fasting Goals */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="flex items-center justify-center mb-6">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <div>
                  <Label>Preferred Fasting Schedule</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['12:12', '14:10', '16:8', '18:6'].map((schedule) => (
                      <Button
                        key={schedule}
                        variant={formData.fastingGoal === schedule ? 'default' : 'outline'}
                        onClick={() => updateFormData('fastingGoal', schedule)}
                      >
                        {schedule}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">You're all set!</h4>
                  <p className="text-sm text-green-700">
                    We'll use this information to personalize your fasting experience and provide 
                    tailored recommendations.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              <Button onClick={handleNext}>
                {currentStep === totalSteps ? 'Complete Setup' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
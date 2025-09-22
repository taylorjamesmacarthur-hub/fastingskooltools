import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Calculator, 
  User, 
  Activity, 
  Target, 
  Save,
  TrendingUp,
  Zap,
  Scale
} from 'lucide-react';

export const CalorieCalculatorPage = () => {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    sex: 'M',
    activityLevel: 'moderate',
    bodyFat: '',
    goal: 'maintain',
  });

  const [results, setResults] = useState<any>(null);
  const [savedCalculations, setSavedCalculations] = useState<any[]>([]);

  const activityLevels = {
    sedentary: { label: 'Sedentary', multiplier: 1.2, description: 'Little/no exercise' },
    light: { label: 'Light', multiplier: 1.375, description: 'Light exercise 1-3 days/week' },
    moderate: { label: 'Moderate', multiplier: 1.55, description: 'Moderate exercise 3-5 days/week' },
    active: { label: 'Active', multiplier: 1.725, description: 'Hard exercise 6-7 days/week' },
    very_active: { label: 'Very Active', multiplier: 1.9, description: 'Very hard exercise, physical job' },
  };

  const goals = {
    lose: { label: 'Lose Weight', modifier: -0.2, description: '20% calorie deficit' },
    maintain: { label: 'Maintain Weight', modifier: 0, description: 'Maintenance calories' },
    gain: { label: 'Gain Weight', modifier: 0.2, description: '20% calorie surplus' },
  };

  const calculateMetrics = () => {
    const age = parseInt(formData.age);
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const bodyFat = formData.bodyFat ? parseFloat(formData.bodyFat) : null;

    // BMI Calculation
    const bmi = weight / ((height / 100) ** 2);

    // BMR Calculation
    let bmr;
    if (bodyFat) {
      // Katch-McArdle Formula (more accurate with body fat %)
      const leanMass = weight * (1 - bodyFat / 100);
      bmr = 370 + (21.6 * leanMass);
    } else {
      // Mifflin-St Jeor Equation
      if (formData.sex === 'M') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
      }
    }

    // TDEE Calculation
    const activityMultiplier = activityLevels[formData.activityLevel as keyof typeof activityLevels].multiplier;
    const tdee = bmr * activityMultiplier;

    // Goal-adjusted calories
    const goalModifier = goals[formData.goal as keyof typeof goals].modifier;
    const targetCalories = tdee * (1 + goalModifier);

    // Macro calculations (example ratios)
    const proteinTarget = weight * 2.2; // 2.2g per kg body weight
    const fatTarget = targetCalories * 0.25 / 9; // 25% of calories from fat
    const carbTarget = (targetCalories - (proteinTarget * 4) - (fatTarget * 9)) / 4;

    const calculationResults = {
      bmi: bmi.toFixed(1),
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      proteinTarget: Math.round(proteinTarget),
      carbTarget: Math.round(carbTarget),
      fatTarget: Math.round(fatTarget),
      weeklyWeightChange: goalModifier === 0 ? 0 : (targetCalories - tdee) * 7 / 3500 * 0.453592, // Convert to kg
    };

    setResults(calculationResults);
  };

  const saveCalculation = async () => {
    if (!results) return;

    const calculationData = {
      ...formData,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : null,
      ...results,
      bmr: parseFloat(results.bmr),
      tdee: parseFloat(results.tdee),
      targetCalories: parseFloat(results.targetCalories),
      proteinTarget: parseFloat(results.proteinTarget),
      carbTarget: parseFloat(results.carbTarget),
      fatTarget: parseFloat(results.fatTarget),
    };

    try {
      const response = await fetch('/api/calorie-calculations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(calculationData),
      });

      if (response.ok) {
        const saved = await response.json();
        setSavedCalculations([saved, ...savedCalculations]);
      }
    } catch (error) {
      console.error('Error saving calculation:', error);
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'bg-blue-100 text-blue-800' };
    if (bmi < 25) return { category: 'Normal', color: 'bg-green-100 text-green-800' };
    if (bmi < 30) return { category: 'Overweight', color: 'bg-yellow-100 text-yellow-800' };
    return { category: 'Obese', color: 'bg-red-100 text-red-800' };
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Calculator className="w-8 h-8" />
          Core Calorie Calculator
        </h1>
        <p className="text-muted-foreground">
          Calculate your BMR, TDEE, and personalized macro targets
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Your Information
              </CardTitle>
              <CardDescription>
                Enter your details for accurate calculations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="30"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="70"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="175"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sex">Sex</Label>
                  <select
                    id="sex"
                    value={formData.sex}
                    onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bodyFat">Body Fat % (Optional)</Label>
                  <Input
                    id="bodyFat"
                    type="number"
                    step="0.1"
                    placeholder="15"
                    value={formData.bodyFat}
                    onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
                  />
                </div>
              </div>

              {/* Activity Level */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Activity Level</Label>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(activityLevels).map(([key, level]) => (
                    <label
                      key={key}
                      className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.activityLevel === key
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-accent'
                      }`}
                    >
                      <input
                        type="radio"
                        name="activityLevel"
                        value={key}
                        checked={formData.activityLevel === key}
                        onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                        className="text-primary"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{level.label}</div>
                        <div className="text-sm text-muted-foreground">{level.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Goal */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Goal</Label>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(goals).map(([key, goal]) => (
                    <label
                      key={key}
                      className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.goal === key
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-accent'
                      }`}
                    >
                      <input
                        type="radio"
                        name="goal"
                        value={key}
                        checked={formData.goal === key}
                        onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                        className="text-primary"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{goal.label}</div>
                        <div className="text-sm text-muted-foreground">{goal.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                onClick={calculateMetrics}
                className="w-full"
                size="lg"
                disabled={!formData.age || !formData.weight || !formData.height}
              >
                <Calculator className="w-4 h-4 mr-2" />
                Calculate My Metrics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {results ? (
            <>
              {/* Key Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Your Results
                  </CardTitle>
                  <CardDescription>
                    Personalized calculations based on your data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{results.bmi}</div>
                      <div className="text-sm text-muted-foreground">BMI</div>
                      <Badge className={`text-xs mt-1 ${getBMICategory(parseFloat(results.bmi)).color}`}>
                        {getBMICategory(parseFloat(results.bmi)).category}
                      </Badge>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{results.bmr}</div>
                      <div className="text-sm text-muted-foreground">BMR</div>
                      <div className="text-xs text-muted-foreground mt-1">cal/day</div>
                    </div>
                  </div>

                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <div className="text-3xl font-bold text-primary">{results.tdee}</div>
                    <div className="text-sm text-muted-foreground">Total Daily Energy Expenditure</div>
                  </div>

                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600">{results.targetCalories}</div>
                    <div className="text-sm text-muted-foreground">Target Calories</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {goals[formData.goal as keyof typeof goals].label}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Macro Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Macro Targets
                  </CardTitle>
                  <CardDescription>
                    Daily macronutrient recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                      <div>
                        <div className="font-medium">Protein</div>
                        <div className="text-sm text-muted-foreground">
                          {Math.round((results.proteinTarget * 4 / results.targetCalories) * 100)}% of calories
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-red-600">{results.proteinTarget}g</div>
                        <div className="text-xs text-muted-foreground">{results.proteinTarget * 4} cal</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <div>
                        <div className="font-medium">Carbohydrates</div>
                        <div className="text-sm text-muted-foreground">
                          {Math.round((results.carbTarget * 4 / results.targetCalories) * 100)}% of calories
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-blue-600">{results.carbTarget}g</div>
                        <div className="text-xs text-muted-foreground">{results.carbTarget * 4} cal</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                      <div>
                        <div className="font-medium">Fat</div>
                        <div className="text-sm text-muted-foreground">
                          {Math.round((results.fatTarget * 9 / results.targetCalories) * 100)}% of calories
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-yellow-600">{results.fatTarget}g</div>
                        <div className="text-xs text-muted-foreground">{results.fatTarget * 9} cal</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Weight Change Prediction */}
              {results.weeklyWeightChange !== 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="w-5 h-5" />
                      Predicted Change
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${
                        results.weeklyWeightChange > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {results.weeklyWeightChange > 0 ? '+' : ''}{results.weeklyWeightChange.toFixed(2)} kg
                      </div>
                      <div className="text-sm text-muted-foreground">per week</div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Save Button */}
              <Button onClick={saveCalculation} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Calculation
              </Button>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calculator className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Ready to Calculate</h3>
                <p className="text-muted-foreground">
                  Fill in your information to get personalized results
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
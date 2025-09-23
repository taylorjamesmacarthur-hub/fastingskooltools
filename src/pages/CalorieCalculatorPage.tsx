import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Calculator, User, Activity, Target, Save, TrendingUp } from 'lucide-react';

export const CalorieCalculatorPage = () => {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    sex: 'male',
    activityLevel: 'moderate',
    bodyFat: '',
    goal: 'maintain',
  });

  const [results, setResults] = useState(null);
  const [savedCalculations, setSavedCalculations] = useState([]);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateMetrics = () => {
    const { age, weight, height, sex, activityLevel, bodyFat, goal } = formData;
    
    if (!age || !weight || !height) {
      alert('Please fill in all required fields');
      return;
    }

    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    const bf = bodyFat ? parseFloat(bodyFat) : null;

    // BMI Calculation
    const bmi = w / ((h / 100) ** 2);

    // BMR Calculation (Mifflin-St Jeor Equation)
    let bmr;
    if (sex === 'male') {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    // Katch-McArdle Formula (if body fat is provided)
    let bmrKatch = null;
    if (bf) {
      const leanMass = w * (1 - bf / 100);
      bmrKatch = 370 + (21.6 * leanMass);
    }

    // TDEE Calculation
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    
    const tdee = bmr * activityMultipliers[activityLevel];

    // Goal-based calorie targets
    let calorieTarget = tdee;
    if (goal === 'lose') calorieTarget = tdee * 0.8; // 20% deficit
    if (goal === 'gain') calorieTarget = tdee * 1.1; // 10% surplus

    // Macro calculations (example ratios)
    const proteinTarget = w * 2.2; // 2.2g per kg body weight
    const fatTarget = calorieTarget * 0.25 / 9; // 25% of calories from fat
    const carbTarget = (calorieTarget - (proteinTarget * 4) - (fatTarget * 9)) / 4;

    const calculatedResults = {
      bmi: bmi.toFixed(1),
      bmr: Math.round(bmr),
      bmrKatch: bmrKatch ? Math.round(bmrKatch) : null,
      tdee: Math.round(tdee),
      calorieTarget: Math.round(calorieTarget),
      proteinTarget: Math.round(proteinTarget),
      carbTarget: Math.round(carbTarget),
      fatTarget: Math.round(fatTarget),
      date: new Date().toLocaleDateString(),
    };

    setResults(calculatedResults);
  };

  const saveCalculation = () => {
    if (!results) return;
    
    const calculation = {
      id: Date.now(),
      ...formData,
      ...results,
      savedAt: new Date().toISOString(),
    };
    
    setSavedCalculations(prev => [calculation, ...prev]);
    alert('Calculation saved successfully!');
  };

  const getBMICategory = (bmi) => {
    const bmiNum = parseFloat(bmi);
    if (bmiNum < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmiNum < 25) return { category: 'Normal', color: 'text-green-600' };
    if (bmiNum < 30) return { category: 'Overweight', color: 'text-yellow-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Calorie Calculator</h1>
        <p className="text-muted-foreground">Calculate your BMR, TDEE, and personalized nutrition targets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="30"
                    value={formData.age}
                    onChange={(e) => updateField('age', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="sex">Sex *</Label>
                  <select
                    id="sex"
                    value={formData.sex}
                    onChange={(e) => updateField('sex', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Weight (kg) *</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="70"
                    value={formData.weight}
                    onChange={(e) => updateField('weight', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (cm) *</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="175"
                    value={formData.height}
                    onChange={(e) => updateField('height', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bodyFat">Body Fat % (Optional)</Label>
                <Input
                  id="bodyFat"
                  type="number"
                  step="0.1"
                  placeholder="15"
                  value={formData.bodyFat}
                  onChange={(e) => updateField('bodyFat', e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  For more accurate BMR calculation using Katch-McArdle formula
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Activity & Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="activityLevel">Activity Level *</Label>
                <select
                  id="activityLevel"
                  value={formData.activityLevel}
                  onChange={(e) => updateField('activityLevel', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="sedentary">Sedentary (little/no exercise)</option>
                  <option value="light">Light (light exercise 1-3 days/week)</option>
                  <option value="moderate">Moderate (moderate exercise 3-5 days/week)</option>
                  <option value="active">Active (hard exercise 6-7 days/week)</option>
                  <option value="very_active">Very Active (very hard exercise, physical job)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="goal">Goal *</Label>
                <select
                  id="goal"
                  value={formData.goal}
                  onChange={(e) => updateField('goal', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="lose">Weight Loss (20% deficit)</option>
                  <option value="maintain">Maintain Weight</option>
                  <option value="gain">Weight Gain (10% surplus)</option>
                </select>
              </div>

              <Button onClick={calculateMetrics} className="w-full">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Metrics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Your Results
              </CardTitle>
              {results && (
                <Button onClick={saveCalculation} size="sm" className="ml-auto">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-6">
                  {/* Basic Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600">{results.bmi}</div>
                      <div className="text-sm text-gray-600">BMI</div>
                      <div className={`text-xs font-medium ${getBMICategory(results.bmi).color}`}>
                        {getBMICategory(results.bmi).category}
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-green-600">{results.bmr}</div>
                      <div className="text-sm text-gray-600">BMR (cal/day)</div>
                      {results.bmrKatch && (
                        <div className="text-xs text-gray-500">Katch: {results.bmrKatch}</div>
                      )}
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600">{results.tdee}</div>
                    <div className="text-sm text-gray-600">Total Daily Energy Expenditure</div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-orange-600">{results.calorieTarget}</div>
                    <div className="text-sm text-gray-600">Daily Calorie Target</div>
                    <div className="text-xs text-gray-500">
                      Based on your {formData.goal} goal
                    </div>
                  </div>

                  {/* Macro Targets */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Daily Macro Targets</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-lg font-bold text-red-600">{results.proteinTarget}g</div>
                        <div className="text-xs text-gray-600">Protein</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-lg font-bold text-yellow-600">{results.carbTarget}g</div>
                        <div className="text-xs text-gray-600">Carbs</div>
                      </div>
                      <div className="text-center p-3 bg-indigo-50 rounded-lg">
                        <div className="text-lg font-bold text-indigo-600">{results.fatTarget}g</div>
                        <div className="text-xs text-gray-600">Fat</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-xl">
                    <p className="text-xs text-yellow-800">
                      <strong>Note:</strong> These are estimates based on general formulas. 
                      Consult with healthcare professionals for personalized advice.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Enter your details to calculate your personalized nutrition targets</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Saved Calculations */}
          {savedCalculations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Saved Calculations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {savedCalculations.map((calc) => (
                    <div key={calc.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-sm font-medium">
                          {new Date(calc.savedAt).toLocaleDateString()}
                        </div>
                        <Badge variant="secondary">{calc.goal}</Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div>BMI: {calc.bmi}</div>
                        <div>BMR: {calc.bmr}</div>
                        <div>TDEE: {calc.tdee}</div>
                        <div>Target: {calc.calorieTarget}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
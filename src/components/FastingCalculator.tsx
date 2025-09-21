import React, { useState } from 'react';
import { Calculator, Clock, Utensils } from 'lucide-react';

export const FastingCalculator: React.FC = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [fastingHours, setFastingHours] = useState(16);
  const [results, setResults] = useState<any>(null);

  const calculateMetrics = () => {
    if (!weight || !height || !age) return;

    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    // BMI Calculation
    const bmi = w / ((h / 100) ** 2);

    // BMR Calculation (Mifflin-St Jeor Equation)
    let bmr;
    if (gender === 'male') {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    // TDEE Calculation
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    
    const tdee = bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers];

    // Fasting window calculations
    const eatingWindow = 24 - fastingHours;
    const caloriesPerHour = tdee / eatingWindow;

    // Weight loss estimates (rough approximations)
    const weeklyDeficit = tdee * 0.2 * 7; // 20% deficit
    const weeklyWeightLoss = weeklyDeficit / 3500; // 3500 calories = 1 pound

    setResults({
      bmi: bmi.toFixed(1),
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      eatingWindow,
      caloriesPerHour: Math.round(caloriesPerHour),
      weeklyWeightLoss: weeklyWeightLoss.toFixed(1)
    });
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-6 h-6 text-primary-600" />
            <h3 className="text-xl font-bold text-gray-900">Fasting Calculator</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="input-field"
                  placeholder="70"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="input-field"
                  placeholder="175"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="input-field"
                  placeholder="30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="input-field"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Level
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="input-field"
              >
                <option value="sedentary">Sedentary (little/no exercise)</option>
                <option value="light">Light (light exercise 1-3 days/week)</option>
                <option value="moderate">Moderate (moderate exercise 3-5 days/week)</option>
                <option value="active">Active (hard exercise 6-7 days/week)</option>
                <option value="very_active">Very Active (very hard exercise, physical job)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fasting Hours: {fastingHours}
              </label>
              <input
                type="range"
                min="12"
                max="24"
                value={fastingHours}
                onChange={(e) => setFastingHours(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>12h</span>
                <span>18h</span>
                <span>24h</span>
              </div>
            </div>

            <button
              onClick={calculateMetrics}
              className="btn-primary w-full"
            >
              Calculate Metrics
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-primary-600" />
            <h3 className="text-xl font-bold text-gray-900">Your Results</h3>
          </div>

          {results ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">{results.bmi}</div>
                  <div className="text-sm text-gray-600">BMI</div>
                  <div className={`text-xs font-medium ${getBMICategory(parseFloat(results.bmi)).color}`}>
                    {getBMICategory(parseFloat(results.bmi)).category}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{results.bmr}</div>
                  <div className="text-sm text-gray-600">BMR (cal/day)</div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">{results.tdee}</div>
                <div className="text-sm text-gray-600">Total Daily Energy Expenditure</div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Utensils className="w-4 h-4" />
                  Fasting Schedule ({fastingHours}:{24 - fastingHours})
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Eating Window:</span>
                    <span className="font-medium">{results.eatingWindow} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Calories per eating hour:</span>
                    <span className="font-medium">{results.caloriesPerHour}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Est. weekly weight loss:</span>
                    <span className="font-medium text-green-600">{results.weeklyWeightLoss} lbs</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-xl">
                <p className="text-xs text-yellow-800">
                  <strong>Note:</strong> These are estimates based on general formulas. 
                  Consult with a healthcare provider before starting any fasting regimen.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Enter your details to calculate your personalized fasting metrics</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
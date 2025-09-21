import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

export const FastingTimer: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(16 * 60 * 60); // 16 hours in seconds
  const [selectedPlan, setSelectedPlan] = useState('16:8');
  const [startTime, setStartTime] = useState<Date | null>(null);

  const fastingPlans = {
    '12:12': { fast: 12, eat: 12, seconds: 12 * 60 * 60 },
    '14:10': { fast: 14, eat: 10, seconds: 14 * 60 * 60 },
    '16:8': { fast: 16, eat: 8, seconds: 16 * 60 * 60 },
    '18:6': { fast: 18, eat: 6, seconds: 18 * 60 * 60 },
    '20:4': { fast: 20, eat: 4, seconds: 20 * 60 * 60 },
    '24:0': { fast: 24, eat: 0, seconds: 24 * 60 * 60 },
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Could add notification here
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleStart = () => {
    if (!isActive) {
      setStartTime(new Date());
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(fastingPlans[selectedPlan as keyof typeof fastingPlans].seconds);
    setStartTime(null);
  };

  const handlePlanChange = (plan: string) => {
    setSelectedPlan(plan);
    setTimeLeft(fastingPlans[plan as keyof typeof fastingPlans].seconds);
    setIsActive(false);
    setStartTime(null);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((fastingPlans[selectedPlan as keyof typeof fastingPlans].seconds - timeLeft) / fastingPlans[selectedPlan as keyof typeof fastingPlans].seconds) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-8 text-center">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Fasting Timer</h3>
          
          {/* Plan Selection */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-8">
            {Object.entries(fastingPlans).map(([plan, details]) => (
              <button
                key={plan}
                onClick={() => handlePlanChange(plan)}
                className={`p-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  selectedPlan === plan
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {plan}
              </button>
            ))}
          </div>

          {/* Timer Display */}
          <div className="relative mb-8">
            <div className="w-64 h-64 mx-auto relative">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Clock className="w-8 h-8 text-primary-600 mb-2" />
                <div className="text-3xl font-bold text-gray-900">{formatTime(timeLeft)}</div>
                <div className="text-sm text-gray-600 mt-1">{Math.round(progress)}% Complete</div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleStart}
              className={`flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              } shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
            >
              {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isActive ? 'Pause' : 'Start'}
            </button>
            
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold bg-gray-500 hover:bg-gray-600 text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>

          {/* Status */}
          {startTime && (
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-800">
                Started at: {startTime.toLocaleTimeString()}
              </p>
              {timeLeft === 0 && (
                <p className="text-sm font-semibold text-green-800 mt-1">
                  🎉 Fasting period completed! Great job!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
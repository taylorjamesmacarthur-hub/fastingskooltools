import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Header } from './Header';
import { LoadingSpinner } from './ui/loading-spinner';

// Pages
import { AuthPage } from '../pages/AuthPage';
import { DashboardPage } from '../pages/DashboardPage';
import { OnboardingPage } from '../pages/OnboardingPage';
import { DailyProgressPage } from '../pages/DailyProgressPage';
import { ScoreboardPage } from '../pages/ScoreboardPage';
import { WindowPlannerPage } from '../pages/WindowPlannerPage';
import { CalorieCalculatorPage } from '../pages/CalorieCalculatorPage';
import { MealPlannerPage } from '../pages/MealPlannerPage';

export const AppRouter = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/daily-progress" element={<DailyProgressPage />} />
          <Route path="/scoreboard" element={<ScoreboardPage />} />
          <Route path="/window-planner" element={<WindowPlannerPage />} />
          <Route path="/calculator" element={<CalorieCalculatorPage />} />
          <Route path="/meal-planner" element={<MealPlannerPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
};
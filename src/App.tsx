import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FastingTimer } from './components/FastingTimer';
import { FastingCalculator } from './components/FastingCalculator';
import { EducationalContent } from './components/EducationalContent';
import { ProgressTracker } from './components/ProgressTracker';
import { Footer } from './components/Footer';

function App() {
  const [activeTab, setActiveTab] = useState('timer');

  const renderContent = () => {
    switch (activeTab) {
      case 'timer':
        return <FastingTimer />;
      case 'calculator':
        return <FastingCalculator />;
      case 'education':
        return <EducationalContent />;
      case 'progress':
        return <ProgressTracker />;
      default:
        return <FastingTimer />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      <Hero />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {[
            { id: 'timer', label: 'Fasting Timer', icon: '⏱️' },
            { id: 'calculator', label: 'Calculator', icon: '🧮' },
            { id: 'education', label: 'Learn', icon: '📚' },
            { id: 'progress', label: 'Progress', icon: '📊' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md hover:shadow-lg'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
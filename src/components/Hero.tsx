import React from 'react';
import { Zap, Target, TrendingUp } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Master Your
          <span className="text-primary-600 block">Fasting Journey</span>
        </h2>
        
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Comprehensive tools and education to help you succeed with intermittent fasting. 
          Track your progress, learn the science, and achieve your health goals.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: <Zap className="w-8 h-8" />,
              title: 'Smart Timers',
              description: 'Precise fasting timers with customizable schedules and notifications'
            },
            {
              icon: <Target className="w-8 h-8" />,
              title: 'Goal Tracking',
              description: 'Monitor your progress and celebrate milestones along the way'
            },
            {
              icon: <TrendingUp className="w-8 h-8" />,
              title: 'Evidence-Based',
              description: 'Learn from the latest research and proven fasting methodologies'
            }
          ].map((feature, index) => (
            <div key={index} className="card p-8 text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="bg-primary-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary-600">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
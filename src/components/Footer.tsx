import React from 'react';
import { Heart, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary-600 p-2 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Fasting School</h3>
                <p className="text-gray-400 text-sm">Your Intermittent Fasting Companion</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Empowering your health journey with evidence-based intermittent fasting tools and education.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-gray-400">
              <li>• Smart Fasting Timers</li>
              <li>• Personalized Calculators</li>
              <li>• Progress Tracking</li>
              <li>• Educational Content</li>
              <li>• Multiple Fasting Methods</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Important Note</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              This app provides educational information and tools for intermittent fasting. 
              Always consult with healthcare professionals before starting any new eating regimen, 
              especially if you have medical conditions.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-500" /> for your health journey
          </p>
        </div>
      </div>
    </footer>
  );
};
import React, { useState } from 'react';
import { BookOpen, Clock, Heart, Brain, Zap, ChevronDown, ChevronUp } from 'lucide-react';

export const EducationalContent: React.FC = () => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const educationalContent = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "What is Intermittent Fasting?",
      summary: "Learn the basics of intermittent fasting and how it works",
      content: `Intermittent fasting (IF) is an eating pattern that cycles between periods of fasting and eating. It doesn't specify which foods you should eat but rather when you should eat them.

Common methods include:
• 16:8 Method: Fast for 16 hours, eat during 8 hours
• 5:2 Diet: Eat normally 5 days, restrict calories 2 days
• Eat-Stop-Eat: 24-hour fasts once or twice per week
• Alternate Day Fasting: Alternate between fasting and eating days

The key is finding a sustainable pattern that fits your lifestyle and health goals.`,
      color: "blue"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Health Benefits",
      summary: "Discover the science-backed benefits of intermittent fasting",
      content: `Research suggests intermittent fasting may offer several health benefits:

Metabolic Benefits:
• Improved insulin sensitivity
• Enhanced fat burning
• Better blood sugar control
• Increased metabolic rate

Cardiovascular Health:
• Reduced blood pressure
• Improved cholesterol levels
• Lower inflammation markers
• Better heart health markers

Other Potential Benefits:
• Weight loss and fat loss
• Improved brain function
• Cellular repair processes
• Longevity benefits`,
      color: "red"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "The Science Behind Fasting",
      summary: "Understand what happens in your body during fasting",
      content: `During fasting, your body undergoes several important changes:

First 12 Hours:
• Glycogen stores begin to deplete
• Body starts shifting to fat burning
• Insulin levels drop

12-18 Hours:
• Ketosis begins (fat burning for energy)
• Growth hormone increases
• Cellular repair processes activate

18+ Hours:
• Autophagy increases (cellular cleanup)
• Enhanced fat oxidation
• Improved metabolic flexibility

These processes contribute to the health benefits associated with intermittent fasting.`,
      color: "purple"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Getting Started Safely",
      summary: "Tips for beginning your intermittent fasting journey",
      content: `Starting intermittent fasting safely is crucial for success:

Begin Gradually:
• Start with 12:12 and gradually extend fasting periods
• Listen to your body and adjust as needed
• Don't rush into longer fasting periods

Stay Hydrated:
• Drink plenty of water during fasting periods
• Herbal teas and black coffee are usually acceptable
• Avoid sugary drinks that break your fast

Important Considerations:
• Consult healthcare providers if you have medical conditions
• Pregnant/breastfeeding women should avoid fasting
• People with eating disorders should be cautious
• Monitor how you feel and adjust accordingly

Focus on nutrient-dense foods during eating windows for optimal results.`,
      color: "green"
    }
  ];

  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    red: "bg-red-50 text-red-600 border-red-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    green: "bg-green-50 text-green-600 border-green-200"
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BookOpen className="w-8 h-8 text-primary-600" />
          <h2 className="text-3xl font-bold text-gray-900">Learn About Fasting</h2>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Evidence-based information to help you understand intermittent fasting and make informed decisions about your health.
        </p>
      </div>

      <div className="space-y-6">
        {educationalContent.map((item, index) => (
          <div key={index} className="card overflow-hidden">
            <div 
              className="p-6 cursor-pointer"
              onClick={() => setExpandedCard(expandedCard === index ? null : index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${colorClasses[item.color as keyof typeof colorClasses]}`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 mt-1">{item.summary}</p>
                  </div>
                </div>
                <div className="text-gray-400">
                  {expandedCard === index ? <ChevronUp /> : <ChevronDown />}
                </div>
              </div>
            </div>
            
            {expandedCard === index && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="pt-6">
                  <div className="prose prose-gray max-w-none">
                    {item.content.split('\n').map((paragraph, pIndex) => (
                      <p key={pIndex} className="mb-3 text-gray-700 leading-relaxed whitespace-pre-line">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 card p-8 text-center bg-gradient-to-r from-primary-50 to-indigo-50">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your Journey?</h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Remember, intermittent fasting is a tool that works differently for everyone. 
          Start slowly, listen to your body, and consult with healthcare professionals when needed.
        </p>
        <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-4 max-w-2xl mx-auto">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> This information is for educational purposes only and should not replace professional medical advice. 
            Always consult with a healthcare provider before starting any new eating regimen.
          </p>
        </div>
      </div>
    </div>
  );
};
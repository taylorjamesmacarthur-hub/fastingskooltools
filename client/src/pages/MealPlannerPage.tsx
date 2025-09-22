import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { 
  UtensilsCrossed, 
  Sparkles, 
  Clock, 
  Zap,
  ChefHat,
  RefreshCw,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Utensils
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Meal {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  time: string;
}

export const MealPlannerPage = () => {
  const [mode, setMode] = useState<'clean' | 'unhinged'>('clean');
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedMeal, setExpandedMeal] = useState<number | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  // Mock user targets - in real app this would come from calculator
  const targets = {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 67,
  };

  const eatingWindow = {
    start: '12:00 PM',
    end: '8:00 PM',
    hours: 8,
  };

  const generateMeals = async () => {
    setLoading(true);
    
    try {
      // Mock API call - in real app this would call OpenAI
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockMeals: Meal[] = mode === 'clean' ? [
        {
          id: 1,
          name: '6oz Chicken Breast with Rice',
          calories: 650,
          protein: 55,
          carbs: 60,
          fat: 8,
          ingredients: ['6oz chicken breast', '1 cup white rice', '1 tbsp olive oil', 'Mixed vegetables'],
          time: '12:00 PM',
        },
        {
          id: 2,
          name: 'Salmon with Sweet Potato',
          calories: 580,
          protein: 45,
          carbs: 45,
          fat: 22,
          ingredients: ['5oz salmon fillet', '1 medium sweet potato', '1 cup broccoli', '1 tsp butter'],
          time: '4:00 PM',
        },
        {
          id: 3,
          name: 'Greek Yogurt Protein Bowl',
          calories: 420,
          protein: 35,
          carbs: 40,
          fat: 15,
          ingredients: ['1 cup Greek yogurt', '1 scoop protein powder', '1/2 cup berries', '1 tbsp honey'],
          time: '7:00 PM',
        },
      ] : [
        {
          id: 1,
          name: 'Chipotle Chicken Burrito Bowl',
          calories: 750,
          protein: 52,
          carbs: 65,
          fat: 28,
          ingredients: ['Chicken, rice, black beans, cheese, guacamole, salsa'],
          time: '12:00 PM',
        },
        {
          id: 2,
          name: 'Five Guys Cheeseburger & Fries',
          calories: 920,
          protein: 48,
          carbs: 78,
          fat: 52,
          ingredients: ['Cheeseburger with all toppings', 'Regular fries'],
          time: '4:00 PM',
        },
        {
          id: 3,
          name: 'Starbucks Protein Box',
          calories: 330,
          protein: 20,
          carbs: 25,
          fat: 18,
          ingredients: ['Hard-boiled eggs', 'Cheese', 'Nuts', 'Apple slices'],
          time: '7:00 PM',
        },
      ];

      setMeals(mockMeals);
      
      if (mode === 'unhinged') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (error) {
      console.error('Error generating meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalMacros = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const macroProgress = {
    calories: (totalMacros.calories / targets.calories) * 100,
    protein: (totalMacros.protein / targets.protein) * 100,
    carbs: (totalMacros.carbs / targets.carbs) * 100,
    fat: (totalMacros.fat / targets.fat) * 100,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <UtensilsCrossed className="w-8 h-8" />
          AI Meal Planner
        </h1>
        <p className="text-muted-foreground">
          Generate personalized meals that fit your macros and eating window
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Eating Window Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Today's Eating Window
              </CardTitle>
              <CardDescription>
                {eatingWindow.start} - {eatingWindow.end} ({eatingWindow.hours} hours)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="h-2 bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full"></div>
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>{eatingWindow.start}</span>
                  <span>Now: 2:30 PM</span>
                  <span>{eatingWindow.end}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generation Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Generate Meals</CardTitle>
              <CardDescription>
                Choose your meal generation mode
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={mode} onValueChange={(value) => setMode(value as 'clean' | 'unhinged')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="clean" className="flex items-center gap-2">
                    <ChefHat className="w-4 h-4" />
                    Clean Mode
                  </TabsTrigger>
                  <TabsTrigger value="unhinged" className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Unhinged Mode
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="clean" className="mt-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                      Clean Mode
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Simple, measured portions perfect for meal prep and precise tracking. 
                      Think "6oz chicken breast, 1 cup rice, 1 tbsp olive oil."
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="unhinged" className="mt-4">
                  <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                      Unhinged Mode 🎉
                    </h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Real restaurant and takeout meals that fit your macros. 
                      Chipotle bowls, Five Guys burgers, Starbucks treats - all calculated perfectly!
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <Button 
                onClick={generateMeals} 
                disabled={loading}
                className="w-full mt-4"
                size="lg"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate AI Meals
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Macro Progress */}
          {meals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Macro Progress</CardTitle>
                <CardDescription>
                  How your generated meals stack up against your targets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(macroProgress).map(([macro, progress]) => (
                    <div key={macro} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize font-medium">{macro}</span>
                        <span className="text-muted-foreground">
                          {totalMacros[macro as keyof typeof totalMacros]}/
                          {targets[macro as keyof typeof targets]}
                          {macro === 'calories' ? '' : 'g'}
                        </span>
                      </div>
                      <Progress value={Math.min(progress, 100)} />
                      <div className="text-xs text-center text-muted-foreground">
                        {Math.round(progress)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generated Meals */}
          {meals.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Meals</h2>
                <Button variant="outline" onClick={generateMeals} disabled={loading}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </div>

              {meals.map((meal) => (
                <Card key={meal.id} className="overflow-hidden">
                  <CardHeader 
                    className="cursor-pointer"
                    onClick={() => setExpandedMeal(expandedMeal === meal.id ? null : meal.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Utensils className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{meal.name}</CardTitle>
                          <CardDescription>{meal.time}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{meal.calories} cal</Badge>
                        {expandedMeal === meal.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  {expandedMeal === meal.id && (
                    <CardContent className="border-t">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3">Ingredients</h4>
                          <ul className="space-y-1">
                            {meal.ingredients.map((ingredient, index) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                {ingredient}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3">Nutrition</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="text-center p-2 bg-accent rounded-lg">
                              <div className="font-bold text-lg">{meal.protein}g</div>
                              <div className="text-xs text-muted-foreground">Protein</div>
                            </div>
                            <div className="text-center p-2 bg-accent rounded-lg">
                              <div className="font-bold text-lg">{meal.carbs}g</div>
                              <div className="text-xs text-muted-foreground">Carbs</div>
                            </div>
                            <div className="text-center p-2 bg-accent rounded-lg">
                              <div className="font-bold text-lg">{meal.fat}g</div>
                              <div className="text-xs text-muted-foreground">Fat</div>
                            </div>
                            <div className="text-center p-2 bg-accent rounded-lg">
                              <div className="font-bold text-lg">{meal.calories}</div>
                              <div className="text-xs text-muted-foreground">Calories</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {meals.length === 0 && !loading && (
            <Card>
              <CardContent className="text-center py-12">
                <UtensilsCrossed className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No meals generated yet</h3>
                <p className="text-muted-foreground mb-4">
                  Choose a mode and generate your personalized meal plan
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* AI Coach Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                AI Coach
              </CardTitle>
              <CardDescription>
                Get personalized nutrition guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-accent rounded-lg">
                  <p className="text-sm">
                    💡 <strong>Tip:</strong> Try generating meals in both modes to see the difference!
                  </p>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    🎯 Your current targets look great for a moderate deficit. 
                    Consider timing your largest meal post-workout for optimal recovery.
                  </p>
                </div>

                <Button variant="outline" className="w-full" disabled>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat with Coach
                  <Badge variant="secondary" className="ml-2">Soon</Badge>
                </Button>

                <div className="text-xs text-muted-foreground">
                  <p className="mb-2"><strong>Quick Stats:</strong></p>
                  <ul className="space-y-1">
                    <li>• Target: {targets.calories} calories</li>
                    <li>• Protein: {targets.protein}g ({Math.round((targets.protein * 4 / targets.calories) * 100)}%)</li>
                    <li>• Eating window: {eatingWindow.hours} hours</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
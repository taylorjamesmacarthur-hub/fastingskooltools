import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  Calendar, 
  Trophy, 
  Clock, 
  Calculator, 
  UtensilsCrossed,
  TrendingUp,
  Target,
  Flame,
  CheckCircle,
  Plus
} from 'lucide-react';

export const DashboardPage = () => {
  // Mock data - in real app this would come from API
  const todayStats = {
    fastingHours: 14.5,
    targetHours: 16,
    currentStreak: 7,
    weeklyGoal: 5,
    completedDays: 4,
  };

  const quickActions = [
    {
      title: 'Log Today',
      description: 'Record your daily progress',
      icon: Calendar,
      href: '/daily-progress',
      color: 'bg-blue-500',
    },
    {
      title: 'View Stats',
      description: 'Check your achievements',
      icon: Trophy,
      href: '/scoreboard',
      color: 'bg-green-500',
    },
    {
      title: 'Plan Window',
      description: 'Set your fasting schedule',
      icon: Clock,
      href: '/window-planner',
      color: 'bg-purple-500',
    },
    {
      title: 'Calculate',
      description: 'Update your targets',
      icon: Calculator,
      href: '/calculator',
      color: 'bg-orange-500',
    },
    {
      title: 'Meal Plan',
      description: 'Generate AI meals',
      icon: UtensilsCrossed,
      href: '/meal-planner',
      color: 'bg-pink-500',
    },
  ];

  const recentAchievements = [
    { title: '7-Day Streak', description: 'Completed 7 consecutive days', date: 'Today' },
    { title: 'First 20-Hour Fast', description: 'Extended fasting milestone', date: '2 days ago' },
    { title: 'Weekly Goal Met', description: 'Completed 5/5 planned fasts', date: '1 week ago' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's your fasting progress overview
        </p>
      </div>

      {/* Today's Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Fast</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.fastingHours}h</div>
            <p className="text-xs text-muted-foreground">
              of {todayStats.targetHours}h target
            </p>
            <Progress 
              value={(todayStats.fastingHours / todayStats.targetHours) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.currentStreak}</div>
            <p className="text-xs text-muted-foreground">
              consecutive days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayStats.completedDays}/{todayStats.weeklyGoal}
            </div>
            <p className="text-xs text-muted-foreground">
              days completed
            </p>
            <Progress 
              value={(todayStats.completedDays / todayStats.weeklyGoal) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Jump to your most used features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link key={action.title} to={action.href}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${action.color}`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{action.title}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {action.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>
                Your planned eating window
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Eating Window</p>
                      <p className="text-sm text-muted-foreground">12:00 PM - 8:00 PM</p>
                    </div>
                  </div>
                  <Badge variant="secondary">16:8</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Fast started:</span>
                  <span className="text-sm font-medium">8:00 PM yesterday</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Next meal:</span>
                  <span className="text-sm font-medium">12:00 PM today</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Achievements */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
              <CardDescription>
                Your latest milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAchievements.map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{achievement.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {achievement.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to="/scoreboard">
                  View All Achievements
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Log */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Log</CardTitle>
              <CardDescription>
                Log today's progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full" asChild>
                  <Link to="/daily-progress">
                    <Plus className="w-4 h-4 mr-2" />
                    Log Today's Fast
                  </Link>
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    Quick 16:8
                  </Button>
                  <Button variant="outline" size="sm">
                    Quick 18:6
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
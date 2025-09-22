import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  Trophy, 
  Flame, 
  Target, 
  TrendingUp, 
  Calendar,
  Clock,
  Award,
  Star,
  Zap,
  CheckCircle
} from 'lucide-react';

export const ScoreboardPage = () => {
  // Mock data - in real app this would come from API
  const stats = {
    currentStreak: 12,
    bestStreak: 28,
    totalDays: 156,
    successRate: 87,
    averageFastingHours: 16.8,
    totalFastingHours: 2620,
    weeklyGoal: 5,
    weeklyCompleted: 4,
    monthlyGoal: 20,
    monthlyCompleted: 16,
  };

  const achievements = [
    {
      id: 1,
      title: 'First Fast',
      description: 'Completed your first intermittent fast',
      icon: '🎯',
      earned: true,
      earnedDate: '2024-01-15',
    },
    {
      id: 2,
      title: 'Week Warrior',
      description: 'Completed 7 consecutive days',
      icon: '🔥',
      earned: true,
      earnedDate: '2024-01-22',
    },
    {
      id: 3,
      title: 'Consistency King',
      description: 'Maintained 80%+ success rate for a month',
      icon: '👑',
      earned: true,
      earnedDate: '2024-02-15',
    },
    {
      id: 4,
      title: 'Century Club',
      description: 'Completed 100 total fasting days',
      icon: '💯',
      earned: true,
      earnedDate: '2024-03-10',
    },
    {
      id: 5,
      title: 'Extended Master',
      description: 'Completed a 24-hour fast',
      icon: '⏰',
      earned: false,
      progress: 0,
    },
    {
      id: 6,
      title: 'Marathon Faster',
      description: 'Reach 30-day streak',
      icon: '🏃',
      earned: false,
      progress: 12,
      target: 30,
    },
  ];

  const recentMilestones = [
    {
      title: '12-Day Streak',
      description: 'Current active streak',
      date: 'Today',
      type: 'streak',
    },
    {
      title: '150 Total Days',
      description: 'Milestone reached',
      date: '2 days ago',
      type: 'milestone',
    },
    {
      title: 'Weekly Goal Met',
      description: 'Completed 5/5 planned fasts',
      date: '1 week ago',
      type: 'goal',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Trophy className="w-8 h-8" />
          Success Scoreboard
        </h1>
        <p className="text-muted-foreground">
          Track your achievements, streaks, and fasting milestones
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentStreak}</div>
            <p className="text-xs text-muted-foreground">
              days in a row
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Streak</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bestStreak}</div>
            <p className="text-xs text-muted-foreground">
              personal record
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              all time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Days</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDays}</div>
            <p className="text-xs text-muted-foreground">
              fasting days completed
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Tracking */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Current Goals
              </CardTitle>
              <CardDescription>
                Your progress toward weekly and monthly targets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Weekly Goal</span>
                  <span className="text-sm text-muted-foreground">
                    {stats.weeklyCompleted}/{stats.weeklyGoal} days
                  </span>
                </div>
                <Progress value={(stats.weeklyCompleted / stats.weeklyGoal) * 100} />
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.weeklyGoal - stats.weeklyCompleted} more days to reach your weekly goal
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Monthly Goal</span>
                  <span className="text-sm text-muted-foreground">
                    {stats.monthlyCompleted}/{stats.monthlyGoal} days
                  </span>
                </div>
                <Progress value={(stats.monthlyCompleted / stats.monthlyGoal) * 100} />
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.monthlyGoal - stats.monthlyCompleted} more days to reach your monthly goal
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Statistics</CardTitle>
              <CardDescription>
                Your comprehensive fasting metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average Fasting Hours</span>
                    <span className="font-medium">{stats.averageFastingHours}h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Fasting Hours</span>
                    <span className="font-medium">{stats.totalFastingHours.toLocaleString()}h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Longest Single Fast</span>
                    <span className="font-medium">24h</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Most Common Window</span>
                    <span className="font-medium">16:8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Favorite Start Time</span>
                    <span className="font-medium">12:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Clean Fast Rate</span>
                    <span className="font-medium">94%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Achievements
              </CardTitle>
              <CardDescription>
                Unlock badges by reaching fasting milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border ${
                      achievement.earned
                        ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                        : 'bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{achievement.title}</h4>
                          {achievement.earned && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {achievement.description}
                        </p>
                        
                        {achievement.earned ? (
                          <Badge variant="secondary" className="text-xs">
                            Earned {achievement.earnedDate}
                          </Badge>
                        ) : achievement.progress !== undefined ? (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>{achievement.progress}/{achievement.target}</span>
                            </div>
                            <Progress 
                              value={(achievement.progress / (achievement.target || 1)) * 100} 
                              className="h-1"
                            />
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Not started
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Milestones */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Recent Milestones
              </CardTitle>
              <CardDescription>
                Your latest achievements and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMilestones.map((milestone, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      milestone.type === 'streak' ? 'bg-orange-500' :
                      milestone.type === 'milestone' ? 'bg-blue-500' :
                      'bg-green-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{milestone.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {milestone.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {milestone.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Streak Calendar Preview */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>This Week</CardTitle>
              <CardDescription>
                Your fasting consistency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">{day}</div>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                      index < 5 ? 'bg-green-500 text-white' :
                      index === 5 ? 'bg-primary text-primary-foreground' :
                      'bg-gray-200 dark:bg-gray-800'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-muted-foreground">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded"></div>
                  <span className="text-muted-foreground">Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-200 dark:bg-gray-800 rounded"></div>
                  <span className="text-muted-foreground">Upcoming</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
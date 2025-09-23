import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Trophy, Flame, Target, TrendingUp, Calendar, Award, Star, Zap } from 'lucide-react';

export const ScoreboardPage = () => {
  // Mock data - in real app this would come from API
  const stats = {
    currentStreak: 12,
    bestStreak: 28,
    totalDays: 156,
    successRate: 87,
    averageFastingHours: 16.2,
    totalFastingHours: 2534,
    weeklyGoal: 5,
    weeklyCompleted: 4,
  };

  const achievements = [
    { id: 1, title: 'First Fast', description: 'Completed your first fast', icon: '🎯', unlocked: true, date: '2024-01-15' },
    { id: 2, title: 'Week Warrior', description: 'Completed 7 consecutive days', icon: '🔥', unlocked: true, date: '2024-01-22' },
    { id: 3, title: 'Consistency King', description: 'Maintained 80% success rate', icon: '👑', unlocked: true, date: '2024-02-01' },
    { id: 4, title: 'Month Master', description: 'Completed 30 days total', icon: '🏆', unlocked: true, date: '2024-02-15' },
    { id: 5, title: 'Extended Faster', description: 'Completed a 20+ hour fast', icon: '⏰', unlocked: true, date: '2024-02-20' },
    { id: 6, title: 'Century Club', description: 'Completed 100 days total', icon: '💯', unlocked: true, date: '2024-03-01' },
    { id: 7, title: 'Streak Master', description: 'Achieved 30-day streak', icon: '🌟', unlocked: false, date: null },
    { id: 8, title: 'Dedication', description: 'Completed 365 days total', icon: '🎖️', unlocked: false, date: null },
  ];

  const recentMilestones = [
    { title: '12-Day Streak', description: 'Current active streak', date: 'Today', type: 'streak' },
    { title: '150 Days Total', description: 'Lifetime fasting days', date: '2 days ago', type: 'milestone' },
    { title: '2500 Hours', description: 'Total fasting time', date: '1 week ago', type: 'milestone' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Success Scoreboard</h1>
        <p className="text-muted-foreground">Track your achievements and celebrate your progress</p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentStreak}</div>
            <p className="text-xs text-muted-foreground">days in a row</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Streak</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bestStreak}</div>
            <p className="text-xs text-muted-foreground">personal record</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">all time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Days</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDays}</div>
            <p className="text-xs text-muted-foreground">fasting days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Progress */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>This Week's Progress</CardTitle>
              <CardDescription>
                {stats.weeklyCompleted} of {stats.weeklyGoal} planned fasts completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={(stats.weeklyCompleted / stats.weeklyGoal) * 100} className="mb-4" />
              <div className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <div key={day} className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">{day}</div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      index < stats.weeklyCompleted 
                        ? 'bg-green-500 text-white' 
                        : index === stats.weeklyCompleted 
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {index < stats.weeklyCompleted ? '✓' : index === stats.weeklyCompleted ? '○' : ''}
                    </div>
                  </div>
                ))}
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
                {achievements.filter(a => a.unlocked).length} of {achievements.length} unlocked
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      achievement.unlocked
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-gray-50 border-gray-200 text-gray-500'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm opacity-80">{achievement.description}</p>
                        {achievement.unlocked && achievement.date && (
                          <p className="text-xs mt-1">Unlocked {achievement.date}</p>
                        )}
                      </div>
                      {achievement.unlocked && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          ✓
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Milestones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Recent Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMilestones.map((milestone, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      milestone.type === 'streak' ? 'bg-orange-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{milestone.title}</p>
                      <p className="text-xs text-muted-foreground">{milestone.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{milestone.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg. Fast Duration</span>
                <span className="text-sm font-medium">{stats.averageFastingHours}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Fasting Time</span>
                <span className="text-sm font-medium">{stats.totalFastingHours}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Days This Month</span>
                <span className="text-sm font-medium">18/31</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Longest Fast</span>
                <span className="text-sm font-medium">24h</span>
              </div>
            </CardContent>
          </Card>

          {/* Next Achievement */}
          <Card>
            <CardHeader>
              <CardTitle>Next Achievement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl mb-2">🌟</div>
                <h4 className="font-medium">Streak Master</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Achieve 30-day streak
                </p>
                <Progress value={(stats.currentStreak / 30) * 100} className="mb-2" />
                <p className="text-xs text-muted-foreground">
                  {30 - stats.currentStreak} days to go
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
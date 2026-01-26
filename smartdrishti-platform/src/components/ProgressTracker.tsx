import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trophy, BookOpen, Target, BarChart3 } from 'lucide-react';

interface ProgressData {
  totalProjects: number;
  completedProjects: number;
  totalSteps: number;
  completedSteps: number;
  totalQuizzes: number;
  passedQuizzes: number;
  totalTutorials: number;
  completedTutorials: number;
  streak: number;
  weeklyGoal: number;
  weeklyProgress: number;
  learningTime: number; // in minutes
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  dateEarned?: string;
}

interface LearningActivity {
  id: string;
  title: string;
  type: 'tutorial' | 'quiz' | 'project';
  timestamp: string;
  completed: boolean;
}

interface ProgressTrackerProps {
  progressData: ProgressData;
  achievements: Achievement[];
  recentActivities: LearningActivity[];
}

export const ProgressTracker = ({ progressData, achievements, recentActivities }: ProgressTrackerProps) => {
  const {
    totalProjects,
    completedProjects,
    totalSteps,
    completedSteps,
    totalQuizzes,
    passedQuizzes,
    totalTutorials,
    completedTutorials,
    streak,
    weeklyGoal,
    weeklyProgress,
    learningTime
  } = progressData;

  const overallCompletion = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  const projectsCompletion = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;
  const quizzesCompletion = totalQuizzes > 0 ? Math.round((passedQuizzes / totalQuizzes) * 100) : 0;
  const tutorialsCompletion = totalTutorials > 0 ? Math.round((completedTutorials / totalTutorials) * 100) : 0;
  const weeklyCompletion = weeklyGoal > 0 ? Math.round((weeklyProgress / weeklyGoal) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Progress Summary Cards */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Overall Completion</span>
                  <span className="text-sm font-medium">{overallCompletion}%</span>
                </div>
                <Progress value={overallCompletion} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{completedSteps} of {totalSteps} steps</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Projects Completed</span>
                  <span className="text-sm font-medium">{projectsCompletion}%</span>
                </div>
                <Progress value={projectsCompletion} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{completedProjects} of {totalProjects} projects</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Tutorials Completed</span>
                  <span className="text-sm font-medium">{tutorialsCompletion}%</span>
                </div>
                <Progress value={tutorialsCompletion} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{completedTutorials} of {totalTutorials} tutorials</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Quizzes Passed</span>
                  <span className="text-sm font-medium">{quizzesCompletion}%</span>
                </div>
                <Progress value={quizzesCompletion} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{passedQuizzes} of {totalQuizzes} quizzes</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Weekly Goal</span>
                  <span className="text-sm font-medium">{weeklyCompletion}%</span>
                </div>
                <Progress value={weeklyCompletion} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{weeklyProgress} of {weeklyGoal} learning minutes</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2 border-t pt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary"></div>
                <span className="text-sm">Current Streak: {streak} days</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">This Week</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm">{learningTime} min learned</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 pb-3 border-b border-border/50 last:border-0">
                    <div className={`h-2 w-2 rounded-full ${
                      activity.completed ? 'bg-green-500' : 'bg-primary'
                    }`}></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {activity.type === 'tutorial' && <BookOpen className="h-4 w-4 text-blue-500" />}
                        {activity.type === 'quiz' && <BarChart3 className="h-4 w-4 text-purple-500" />}
                        {activity.type === 'project' && <Target className="h-4 w-4 text-green-500" />}
                        <p className="font-medium">{activity.title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    achievement.earned 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'bg-muted/50 border border-border/50'
                  }`}
                >
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    achievement.earned 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${achievement.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {achievement.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {achievement.earned 
                        ? achievement.dateEarned 
                        : 'Locked'}
                    </p>
                  </div>
                  {achievement.earned && (
                    <Badge variant="secondary">Earned</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Learning Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{totalProjects}</div>
                <div className="text-xs text-muted-foreground">Projects</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{totalTutorials}</div>
                <div className="text-xs text-muted-foreground">Tutorials</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{totalQuizzes}</div>
                <div className="text-xs text-muted-foreground">Quizzes</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{streak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Sample data for demonstration
export const sampleProgressData: ProgressData = {
  totalProjects: 12,
  completedProjects: 5,
  totalSteps: 84,
  completedSteps: 42,
  totalQuizzes: 15,
  passedQuizzes: 11,
  totalTutorials: 10,
  completedTutorials: 6,
  streak: 7,
  weeklyGoal: 300,
  weeklyProgress: 180,
  learningTime: 1250
};

export const sampleAchievements: Achievement[] = [
  {
    id: 'first-project',
    title: 'First Project',
    description: 'Complete your first IoT project',
    icon: '🚀',
    earned: true,
    dateEarned: '2023-07-15'
  },
  {
    id: 'quiz-master',
    title: 'Quiz Master',
    description: 'Pass 5 quizzes with 80% or higher',
    icon: '🧠',
    earned: true,
    dateEarned: '2023-07-20'
  },
  {
    id: 'week-streak',
    title: 'One Week Streak',
    description: 'Learn for 7 consecutive days',
    icon: '🔥',
    earned: true,
    dateEarned: '2023-07-22'
  },
  {
    id: 'tutor-expert',
    title: 'Tutorial Expert',
    description: 'Complete 10 tutorials',
    icon: '🎓',
    earned: false
  },
  {
    id: 'hardware-pro',
    title: 'Hardware Pro',
    description: 'Connect 5 different sensors',
    icon: '🔧',
    earned: false
  }
];

export const sampleLearningActivities: LearningActivity[] = [
  {
    id: 'act1',
    title: 'Completed "Getting Started with ESP32" tutorial',
    type: 'tutorial',
    timestamp: '2023-07-22T14:30:00Z',
    completed: true
  },
  {
    id: 'act2',
    title: 'Passed IoT Security quiz with 90%',
    type: 'quiz',
    timestamp: '2023-07-21T10:15:00Z',
    completed: true
  },
  {
    id: 'act3',
    title: 'Started "Smart Home Automation" project',
    type: 'project',
    timestamp: '2023-07-20T09:45:00Z',
    completed: false
  },
  {
    id: 'act4',
    title: 'Completed "Temperature Sensor" tutorial',
    type: 'tutorial',
    timestamp: '2023-07-19T16:20:00Z',
    completed: true
  }
];
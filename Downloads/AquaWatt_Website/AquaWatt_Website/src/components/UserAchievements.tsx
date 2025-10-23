
import React, { useState, useEffect } from 'react';
import { Trophy, Star, Award, BadgeCheck, Droplet, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  progress: number;
  maxProgress: number;
  completed: boolean;
  points: number;
}

export function UserAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [userLevel, setUserLevel] = useState(1);

  // Simulate fetching achievements data
  useEffect(() => {
    // In a real app, this would come from an API
    const demoAchievements: Achievement[] = [
      {
        id: '1',
        title: 'Water Saver',
        description: 'Reduce water consumption by 10%',
        icon: Droplet,
        progress: 80,
        maxProgress: 100,
        completed: false,
        points: 50
      },
      {
        id: '2',
        title: 'Energy Master',
        description: 'Keep electricity usage below average for 7 days',
        icon: Zap,
        progress: 100,
        maxProgress: 100,
        completed: true,
        points: 100
      },
      {
        id: '3',
        title: 'Smart Home Pioneer',
        description: 'Connect 5 devices to your dashboard',
        icon: BadgeCheck,
        progress: 3,
        maxProgress: 5,
        completed: false,
        points: 75
      },
      {
        id: '4',
        title: 'Eco Warrior',
        description: 'Maintain optimal resource usage for 30 days',
        icon: Award,
        progress: 12,
        maxProgress: 30,
        completed: false,
        points: 150
      }
    ];

    setAchievements(demoAchievements);
    
    // Calculate user points and level
    const completed = demoAchievements.filter(a => a.completed);
    const points = completed.reduce((sum, a) => sum + a.points, 0);
    setUserPoints(points);
    setUserLevel(Math.max(1, Math.floor(points / 100) + 1));
    
    // Simulate an achievement being completed after 5 seconds
    const timer = setTimeout(() => {
      if (demoAchievements[0].progress < demoAchievements[0].maxProgress) {
        completeAchievement('1');
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  const completeAchievement = (id: string) => {
    setAchievements(prev => 
      prev.map(achievement => 
        achievement.id === id 
          ? { ...achievement, progress: achievement.maxProgress, completed: true } 
          : achievement
      )
    );
    
    const achievement = achievements.find(a => a.id === id);
    if (achievement) {
      setUserPoints(prev => prev + achievement.points);
      
      // Check if level up
      const newLevel = Math.max(1, Math.floor((userPoints + achievement.points) / 100) + 1);
      if (newLevel > userLevel) {
        setUserLevel(newLevel);
        toast({
          title: "Level Up!",
          description: `Congratulations! You've reached level ${newLevel}`,
        });
      }
      
      toast({
        title: "Achievement Unlocked!",
        description: `You've completed: ${achievement.title}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Your Achievements</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-500 mr-1" />
            <span className="font-semibold">{userPoints} points</span>
          </div>
          <div className="flex items-center">
            <Trophy className="h-5 w-5 text-yellow-500 mr-1" />
            <span className="font-semibold">Level {userLevel}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {achievements.map((achievement) => (
          <Card 
            key={achievement.id}
            className={`transition-all duration-300 ${
              achievement.completed 
                ? 'border-green-500 dark:border-green-700' 
                : 'hover:shadow-md hover:border-primary'
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center">
                <div className={`mr-3 rounded-full p-2 ${
                  achievement.completed 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  <achievement.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">{achievement.title}</CardTitle>
                  <CardDescription className="text-xs mt-0">
                    {achievement.description}
                  </CardDescription>
                </div>
              </div>
              <div className="text-sm font-semibold">
                +{achievement.points}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress: {achievement.progress}/{achievement.maxProgress}</span>
                  {achievement.completed && <span className="text-green-600 dark:text-green-400">Completed!</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

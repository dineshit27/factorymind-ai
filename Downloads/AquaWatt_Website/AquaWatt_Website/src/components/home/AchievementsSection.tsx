
import { UserAchievements } from "@/components/UserAchievements";

export function AchievementsSection({ ref }: { ref: React.RefObject<HTMLDivElement> }) {
  return (
    <div className="py-12 md:py-16 px-4 md:px-6 bg-gradient-to-b from-background to-water-light/50 dark:from-background dark:to-muted/10">
      <div ref={ref} className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-foreground bg-gradient-to-r from-water-dark to-blue-500 bg-clip-text text-transparent">
            Your Achievements
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            Track your progress and celebrate your conservation milestones
          </p>
        </div>
        <div className="bg-card/50 backdrop-blur-sm shadow-lg rounded-xl p-4 md:p-6 border border-water/30 animate-fade-in hover:shadow-water/20 transition-all duration-300">
          <UserAchievements />
        </div>
      </div>
    </div>
  );
}

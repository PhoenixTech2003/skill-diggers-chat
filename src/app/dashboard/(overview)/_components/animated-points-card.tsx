"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { motion } from "motion/react";
import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";

interface AnimatedPointsCardProps {
  points: number;
}

export function AnimatedPointsCard({ points }: AnimatedPointsCardProps) {
  const [displayedPoints, setDisplayedPoints] = useState(0);

  useEffect(() => {
    if (points === 0) return;

    const duration = 2000; // 2 seconds total
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Custom easing: slow start, fast middle, slow end
      const easeInOutCubic = (t: number) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const easedProgress = easeInOutCubic(progress);
      const currentPoints = Math.floor(points * easedProgress);

      setDisplayedPoints(currentPoints);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [points]);

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Total Points
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <div className="text-card-foreground text-7xl font-bold">
            {displayedPoints.toLocaleString()}
          </div>
          <p className="text-muted-foreground mt-2 text-sm">
            Leaderboard Points
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/hooks/useProgress";
import { getCertificateMetadata } from "@/lib/certificates";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Lock,
  Play,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CertificateLevelsProps {
  certificateSlug: string;
}

export default function CertificateLevels({
  certificateSlug,
}: CertificateLevelsProps) {
  const router = useRouter();
  const { data: progressData } = useProgress();
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);
  const metadata = getCertificateMetadata(certificateSlug);

  if (!metadata) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-16 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="text-destructive text-6xl">❌</div>
            <h2 className="text-2xl font-bold text-white">
              Certificate Not Found
            </h2>
            <p className="text-muted-foreground">
              The requested certificate could not be loaded.
            </p>
            <Button
              onClick={() => router.push("/certificates")}
              className="bg-primary hover:bg-primary/90"
            >
              Back to Certificates
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const levels = progressData?.levels || [];
  const totalQuestions = metadata.questionsPerLevel.reduce(
    (sum, count) => sum + count,
    0,
  );
  const completedLevels = levels.filter((level) => level.passed).length;
  const progressPercentage = (completedLevels / metadata.totalLevels) * 100;

  const getLevelStatus = (level: number) => {
    const levelData = levels.find((l) => l.id === level);
    if (!levelData) return "locked";

    if (levelData.passed) return "completed";
    if (levelData.accessible) return "available";
    return "locked";
  };

  const getDifficultyColor = (level: number) => {
    if (level <= 3) return "text-success bg-success/10 border-success/20";
    if (level <= 6) return "text-warning bg-warning/10 border-warning/20";
    return "text-primary bg-primary/10 border-primary/20";
  };

  const getEstimatedTime = (level: number) => {
    const questionCount = metadata.questionsPerLevel[level - 1] || 0;
    return Math.ceil(questionCount * 1.5); // Estimate 1.5 minutes per question
  };

  const handleLevelClick = (level: number) => {
    const status = getLevelStatus(level);
    if (status === "available" || status === "completed") {
      router.push(`/${certificateSlug}/quiz/${level}`);
    }
  };

  return (
    <section className="container max-w-7xl mx-auto px-4 py-8 min-h-screen">
      <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="text-center space-y-6 py-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <span>Home</span>
              <span>/</span>
              <span>Certificates</span>
              <span>/</span>
              <span className="text-white">{metadata.name}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              {metadata.heroTitle || metadata.name}
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
              {metadata.heroDescription || metadata.description}
            </p>
          </div>

          {/* Progress Overview */}
          <div className="bg-gradient-to-r from-white/[0.08] to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-2xl mx-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Trophy className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white">
                      Progress
                    </div>
                    <div className="text-sm text-gray-400">
                      {completedLevels} of {metadata.totalLevels} levels
                      completed
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {Math.round(progressPercentage)}%
                  </div>
                  <div className="text-sm text-gray-400">Complete</div>
                </div>
              </div>

              <Progress
                value={progressPercentage}
                className="h-3 bg-white/10"
              />

              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>{totalQuestions} Total Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    ~{Math.ceil((totalQuestions * 1.5) / 60)}h Study Time
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Levels Grid */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              Choose Your Level
            </h2>
            <p className="text-gray-400">
              Select a level to start practicing. Complete levels to unlock the
              next ones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: metadata.totalLevels }, (_, index) => {
              const level = index + 1;
              const status = getLevelStatus(level);
              const questionsCount = metadata.questionsPerLevel[index] || 0;
              const estimatedTime = getEstimatedTime(level);
              const isHovered = hoveredLevel === level;

              return (
                <Card
                  key={level}
                  className={`group relative overflow-hidden transition-all duration-300 ${
                    status === "available"
                      ? "hover:shadow-2xl hover:scale-105 cursor-pointer border-primary/30 hover:border-primary/50 bg-gradient-to-br from-primary-900/20 to-primary-800/10"
                      : status === "completed"
                        ? "bg-gradient-to-br from-success-900/20 to-success-800/10 border-success/30 hover:from-success-800/30 hover:to-success-700/20"
                        : "opacity-60 bg-gradient-to-br from-neutral-900/40 to-neutral-800/20 border-white/5 hover:border-white/10"
                  } ${isHovered ? "ring-2 ring-red-400/50" : ""}`}
                  onClick={() => handleLevelClick(level)}
                  onMouseEnter={() => setHoveredLevel(level)}
                  onMouseLeave={() => setHoveredLevel(null)}
                >
                  {/* Level Number Background */}
                  <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                    <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-white">
                      {level}
                    </div>
                  </div>

                  <div className="p-6 space-y-4 relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            status === "completed"
                              ? "bg-success/20"
                              : status === "available"
                                ? "bg-primary/20"
                                : "bg-neutral-500/20"
                          }`}
                        >
                          {status === "completed" && (
                            <CheckCircle className="w-5 h-5 text-success" />
                          )}
                          {status === "available" && (
                            <Play className="w-5 h-5 text-primary" />
                          )}
                          {status === "locked" && (
                            <Lock className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <Badge
                          className={`text-xs ${getDifficultyColor(level)}`}
                        >
                          Level {level}
                        </Badge>
                      </div>

                      {status === "completed" && (
                        <div className="flex items-center gap-1">
                          {[...Array(3)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-yellow-400 fill-current"
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                          Level {level}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {questionsCount} questions • ~{estimatedTime} min
                        </p>
                      </div>

                      {/* Stats Row */}
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          <span>{questionsCount} Qs</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{estimatedTime}m</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          <span>
                            {Math.ceil(questionsCount * 0.7)}% to pass
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-2">
                        {status === "available" && (
                          <Button
                            size="sm"
                            className="w-full bg-primary hover:bg-primary/90 text-white font-medium group-hover:shadow-lg transition-all duration-200"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Start Level
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        )}

                        {status === "completed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full border-success/30 text-success hover:bg-success/10"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Review
                            <TrendingUp className="w-4 h-4 ml-2" />
                          </Button>
                        )}

                        {status === "locked" && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled
                            className="w-full border-gray-600 text-gray-400 cursor-not-allowed"
                          >
                            <Lock className="w-4 h-4 mr-2" />
                            Locked
                          </Button>
                        )}
                      </div>

                      {/* Achievement Badge */}
                      {status === "completed" && (
                        <div className="flex items-center justify-center gap-2 pt-2 border-t border-white/10">
                          <Award className="w-4 h-4 text-yellow-400" />
                          <span className="text-xs text-yellow-400 font-medium">
                            Level Completed!
                          </span>
                        </div>
                      )}

                      {/* Next Level Preview */}
                      {status === "available" &&
                        level < metadata.totalLevels && (
                          <div className="text-xs text-gray-500 text-center pt-2 border-t border-white/5">
                            Next: Level {level + 1}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  {status === "available" && isHovered && (
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 pointer-events-none" />
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        {progressPercentage > 0 && progressPercentage < 100 && (
          <div className="text-center py-8">
            <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 backdrop-blur-sm rounded-2xl p-8 border border-red-500/20 max-w-2xl mx-auto">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="p-3 bg-primary/20 rounded-full">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Keep Going! You&apos;apos;re Doing Great
                </h3>
                <p className="text-gray-400">
                  You&apos;ve completed {completedLevels} levels. Continue your
                  journey to certification success.
                </p>
                <Button
                  onClick={() => {
                    const nextLevel = levels.find(
                      (l) => l.accessible && !l.passed,
                    );
                    if (nextLevel) {
                      router.push(`/${certificateSlug}/quiz/${nextLevel.id}`);
                    }
                  }}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  Continue Next Level
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Completion Celebration */}
        {progressPercentage === 100 && (
          <div className="text-center py-8">
            <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 backdrop-blur-sm rounded-2xl p-8 border border-green-500/20 max-w-2xl mx-auto">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="p-3 bg-success/20 rounded-full">
                    <Trophy className="w-8 h-8 text-success" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Congratulations! 🎉
                </h3>
                <p className="text-gray-400">
                  You&apos;ve completed all {metadata.totalLevels} levels of{" "}
                  {metadata.name}. You&apos;re ready for the certification exam!
                </p>
                <Button
                  className="bg-success hover:bg-success/90 text-white"
                  onClick={() => router.push("/certificates")}
                >
                  Explore More Certifications
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Lock, Play } from "lucide-react";
import { getCertificateMetadata } from "@/lib/certificates";
import { useProgress } from "@/hooks/useProgress";
import { useRouter } from "next/navigation";

interface CertificateLevelsProps {
  certificateSlug: string;
}

export default function CertificateLevels({ certificateSlug }: CertificateLevelsProps) {
  const router = useRouter();
  const { data: progressData } = useProgress();
  const metadata = getCertificateMetadata(certificateSlug);

  if (!metadata) {
    return <div>Certificate not found</div>;
  }

  const levels = progressData?.levels || [];

  const getLevelStatus = (level: number) => {
    const levelData = levels.find(l => l.id === level);
    if (!levelData) return 'locked';

    if (levelData.passed) return 'completed';
    if (levelData.accessible) return 'available';
    return 'locked';
  };

  const handleLevelClick = (level: number) => {
    const status = getLevelStatus(level);
    if (status === 'available' || status === 'completed') {
      router.push(`/${certificateSlug}/quiz/${level}`);
    }
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Choose Your Level</h2>
        <p className="text-gray-400 text-lg">
          Select a level to start practicing. Complete levels to unlock the next ones.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {Array.from({ length: metadata.totalLevels }, (_, index) => {
          const level = index + 1;
          const status = getLevelStatus(level);
          const questionsCount = metadata.questionsPerLevel[index] || 0;

          return (
            <Card
              key={level}
              className={`p-6 transition-all duration-200 ${
                status === 'available'
                  ? 'hover:shadow-lg hover:scale-105 cursor-pointer border-blue-500/50'
                  : status === 'completed'
                  ? 'bg-green-900/20 border-green-500/50'
                  : 'opacity-60 cursor-not-allowed'
              }`}
              onClick={() => handleLevelClick(level)}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Level {level}</h3>
                  {status === 'completed' && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                  {status === 'locked' && (
                    <Lock className="w-6 h-6 text-gray-500" />
                  )}
                  {status === 'available' && (
                    <Play className="w-6 h-6 text-blue-500" />
                  )}
                </div>

                <p className="text-gray-400 text-sm">
                  {questionsCount} questions
                </p>

                <div className="flex items-center justify-between">
                  <Badge
                    variant={
                      status === 'completed'
                        ? 'default'
                        : status === 'available'
                        ? 'secondary'
                        : 'outline'
                    }
                    className={
                      status === 'completed'
                        ? 'bg-green-600 hover:bg-green-700'
                        : status === 'available'
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : ''
                    }
                  >
                    {status === 'completed' && 'Completed'}
                    {status === 'available' && 'Available'}
                    {status === 'locked' && 'Locked'}
                  </Badge>

                  {status === 'available' && (
                    <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                      Start
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-500 text-sm">
          Complete levels in order to unlock the next ones. Your progress is automatically saved.
        </p>
      </div>
    </section>
  );
}
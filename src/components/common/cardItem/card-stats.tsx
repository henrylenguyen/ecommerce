import { Clock, Eye, StarIcon } from 'lucide-react';

interface CardStatsProps {
  views: number;
  rating: number;
  duration: string;
}

export const CardStats = ({ views, rating, duration }: CardStatsProps) => {
  return (
    <div className="flex gap-3 items-center">
      <StatItem icon={<Eye className="w-4 h-4" />} value={views.toLocaleString()} />
      <StatItem icon={<StarIcon className="w-4 h-4" />} value={rating.toFixed(1)} />
      <StatItem icon={<Clock className="w-4 h-4" />} value={duration} />
    </div>
  );
};

const StatItem = ({ icon, value }: { icon: React.ReactNode; value: string }) => (
  <div className="flex items-center gap-1">
    <span className="text-gray-500 dark:text-ucademy-grayText">{icon}</span>
    <span className="text-sm dark:text-ucademy-grayText">{value}</span>
  </div>
); 
'use client';
import { CardFooter } from './card-footer';
import { CardHeader } from './card-image';
import { CardStats } from './card-stats';

interface ICardItemProps {
  slug: string;
  thumbnail: string;
  title: string;
  views: number;
  rating: number[];
  duration: number;
  price: number;
  className?: string;
  status?: string; 
}

const CardItem: React.FunctionComponent<ICardItemProps> = ({
  slug,
  thumbnail,
  title,
  views,
  rating,
  duration,
  price,
  className = '',
}) => {
  const totalRating = rating.reduce((a, b) => a + b, 0) / rating.length || 0;
  return (
    <div className={`card-item bg-white border border-gray-200 dark:bg-ucademy-grayDark dark:border-opacity-10 p-4 rounded-lg ${className}`}>
      <CardHeader link={slug} image={thumbnail} title={title} />

      <div className="pt-4 space-y-5">
        <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>

        <div className="flex justify-between items-center">
          <CardStats views={views} rating={totalRating} duration={duration} />
        </div>

        <CardFooter link={slug} price={price} />
      </div>
    </div>
  );
};

export default CardItem; 
'use client';
import { CardFooter } from './card-footer';
import { CardHeader } from './card-image';
import { CardStats } from './card-stats';

interface ICardItemProps {
  link: string;
  image: string;
  title: string;
  views: number;
  rating: number;
  duration: string;
  price: number;
  className?: string;
  status?: string; 
}

const CardItem: React.FunctionComponent<ICardItemProps> = ({
  link,
  image,
  title,
  views,
  rating,
  duration,
  price,
  className = '',
}) => {
  return (
    <div className={`card-item bg-white border border-gray-200 dark:bg-ucademy-grayDark dark:border-opacity-10 p-4 rounded-lg ${className}`}>
      <CardHeader link={link} image={image} title={title} />

      <div className="pt-4 space-y-5">
        <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>

        <div className="flex justify-between items-center">
          <CardStats views={views} rating={rating} duration={duration} />
        </div>

        <CardFooter link={link} price={price} />
      </div>
    </div>
  );
};

export default CardItem; 
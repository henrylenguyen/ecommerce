import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

interface CardFooterProps {
  link: string;
  price: number;
}

export const CardFooter = ({ link, price }: CardFooterProps) => {
  return (
    <div className="mt-5 flex flex-col gap-3">
      <span className="text-lg text-red-500 font-semibold">
        ${price.toLocaleString()}
      </span>
      <Link 
        href={link} 
        className="text-sm flex items-center font-semibold w-full h-12 bg-ucademy-primary text-white rounded-md justify-center hover:opacity-90 transition-opacity"
      >
        View Course <ArrowRightIcon className="w-4 h-4 ml-2" />
      </Link>
    </div>
  );
}; 
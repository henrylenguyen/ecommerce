import Image from 'next/image';
import Link from 'next/link';

interface CardImageProps {
  link: string;
  image: string;
  title: string;
}

export const CardImage = ({ link, image, title }: CardImageProps) => {

  return (
    <Link href={link} className="w-full h-[250px] block relative image-shine">
      <div className="w-full h-full rounded-md">
        <Image
          src={image} 
          alt={title}
          className="w-full h-full object-cover rounded-md transition-transform duration-300 hover:scale-105"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      </div>
    </Link>
  );
}; 
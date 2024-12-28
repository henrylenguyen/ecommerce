'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

const ActiveLink: React.FunctionComponent<TActiveLinkProps> = ({
  children,
  href,
}) => {
  const pathname = usePathname();
  
  // Special handling for root path
  const isActive = href === '/' 
    ? pathname === '/'
    : pathname.startsWith(href.toString());

  return (
    <Link 
      href={href} 
      className={clsx(
        'p-3 rounded-md flex items-center gap-2 transition-all',
        isActive 
          ? 'text-white bg-ucademy-primary svg-animate' 
          : 'hover:!text-ucademy-primary hover:bg-ucademy-primary/20 dark:text-ucademy-grayText'
      )}
    >
      {children}
    </Link>
  );
};

export default ActiveLink;
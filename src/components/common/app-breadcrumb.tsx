'use client';
import { usePathname } from 'next/navigation';
import { getBreadcrumbItems } from '@/utils/breadcrumb';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import React from 'react';
import Link from 'next/link';

const AppBreadcrumb = () => {
  const pathname = usePathname();
  const items = getBreadcrumbItems(pathname);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={item.path}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  item.disabled ? (
                    <span className="text-gray-500">
                      {item.label}
                    </span>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={item.path}>
                        {item.label}
                      </Link>
                    </BreadcrumbLink>
                  )
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AppBreadcrumb;
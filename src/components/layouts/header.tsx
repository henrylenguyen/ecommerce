import * as React from 'react';
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton } from '@clerk/nextjs';
import { ModeToggle } from '@/components/common';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface IHeaderProps {
}

const Header: React.FunctionComponent<IHeaderProps> = () => {
  return <header className="flex sticky top-0 bg-inherit h-16 shrink-0 items-center gap-2 border-b  border-gray-200 dark:border-opacity-10 px-4 ">
    <SidebarTrigger className="-ml-1" />
    <Separator orientation="vertical" className="mr-2 h-4" />
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="#">
            Building Your Application
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>Data Fetching</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <div className="flex-1 flex justify-end gap-5">
      <ModeToggle/>
      <UserButton/>
    </div>
  </header>;
};

export default Header;

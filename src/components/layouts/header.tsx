import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppBreadcrumb, ModeToggle } from '@/components/common';
import { AuthLayout } from '@/components/layouts';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface IHeaderProps {
}

const Header: React.FunctionComponent<IHeaderProps> = () => {
  return <header className="flex sticky top-0 bg-inherit h-16 shrink-0 items-center gap-2 border-b  border-gray-200 dark:border-opacity-10 px-4 ">
    <SidebarTrigger className="-ml-1" />
    <Separator orientation="vertical" className="mr-2 h-4" />
    <AppBreadcrumb/>
    <div className="flex-1 flex justify-end gap-5">
      <ModeToggle/>
      <AuthLayout/>
    </div>
  </header>;
};

export default Header;

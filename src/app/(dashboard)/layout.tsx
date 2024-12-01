import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar, Header } from "@/components/layouts";

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout: React.FunctionComponent<ILayoutProps> = ({
  children
}) => {
  return <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <Header />
      <div className="flex flex-1 flex-col gap-4 p-4">
        {children}
      </div>
    </SidebarInset>
  </SidebarProvider>;
};

export default Layout;

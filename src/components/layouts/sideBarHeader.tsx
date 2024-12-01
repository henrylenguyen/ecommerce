"use client"
import Image from 'next/image';
import { logoDark, logoLight } from '@/assets/images';
import { SidebarHeader } from '@/components/ui/sidebar';
import { useTheme } from 'next-themes';
import * as React from 'react';

const SideBarHeaderCustom: React.FC = () => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Trả về một placeholder hoặc skeleton trong khi đợi mounted
    return (
      <SidebarHeader className="p-5">
        <div className="w-[150px] h-[40px] bg-gray-200 animate-pulse rounded-md" />
      </SidebarHeader>
    );
  }

  // Xác định theme cuối cùng
  const currentTheme = theme === 'system' ? systemTheme : theme;
  
  return (
    <SidebarHeader className="p-5">
      <Image 
        src={currentTheme === 'dark' ? logoDark : logoLight} 
        alt="logo" 
        width={100} 
        height={100}
        priority // Thêm priority để ưu tiên tải logo
      />
    </SidebarHeader>
  );
}; 

export default SideBarHeaderCustom;

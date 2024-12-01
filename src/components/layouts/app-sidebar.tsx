import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from "@/components/ui/sidebar"
import { sidebarItems } from "@/constants/sidebar"
import { ActiveLink } from "@/components/common"
import { SideBarHeaderCustom } from "@/components/layouts" 


const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  
  return (
    <Sidebar {...props}>
      <SideBarHeaderCustom />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <ActiveLink href={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </ActiveLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar;

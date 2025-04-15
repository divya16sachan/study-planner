import {
  Camera,
  CircleUserRound,
  Folder,
  Frame,
  KeyRound,
  Lock,
  Map,
  MoreHorizontal,
  Paintbrush,
  PaintbrushVertical,
  PieChart,
  Share,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const settings = [
  {
    name: "Personalization",
    url: "/settings/personalization",
    icon: PaintbrushVertical,
  },
  {
    name: "Photo and cover",
    url: "/settings/photo-and-cover",
    icon: Camera,
  },
  {
    name: "Personal Details",
    url: "/settings/personal-details",
    icon: CircleUserRound,
  },
  
  {
    name: "Security",
    url: "/settings/security",
    icon: KeyRound,
  },
  
];

const SettingSidebar = () => {
  const { isMobile } = useSidebar();
  const location = useLocation();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Settings</SidebarGroupLabel>
      <SidebarMenu>
        {settings.map((item) => {
          const isActive = location.pathname.split('/').join('') === item.url.split('/').join('');
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                className={isActive && "bg-sidebar-accent"}
              >
                <Link to={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SettingSidebar;

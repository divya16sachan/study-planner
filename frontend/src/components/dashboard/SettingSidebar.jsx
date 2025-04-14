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
import { Link, NavLink } from "react-router-dom";

const settings = [
  {
    name: "Personal Details",
    url: "settings/personal-details",
    icon: CircleUserRound,
  },
  {
    name: "Personalization",
    url: "settings/personalization",
    icon: PaintbrushVertical,
  },
  {
    name: "Security",
    url: "settings/security",
    icon: KeyRound,
  },
  {
    name: "Photo and cover",
    url: "settings/photo-and-cover",
    icon: Camera,
  },
];

const SettingSidebar = () => {
  const { isMobile } = useSidebar();
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Settings</SidebarGroupLabel>
      <SidebarMenu>
        {settings.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <NavLink
                to={item.url}
                end={item.url === "/settings"} // Prevent matching parent route if needed
                className={({ isActive }) =>
                  isActive ? "bg-red-500" : "bg-red-50"
                }
              >
                <item.icon />
                <span>{item.name}</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SettingSidebar;

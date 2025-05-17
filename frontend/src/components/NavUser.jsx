"use client"

import {
    BellIcon,
    CreditCardIcon,
    LogOutIcon,
    MoreVerticalIcon,
    UserCircleIcon,
    UserPen,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/stores/authStore";
import { Button } from "./ui/button";
import EditProfile from "./EditProfile";
import { useState } from "react";


export function NavUser() {
    const { authUser, logout } = useAuthStore();
    const [open, setOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false); // separate state

    return (
        <>
            <DropdownMenu onOpenChange={setOpen} open={open}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                        <Avatar className="h-full w-full">
                            <AvatarImage src={authUser.avatar} alt={authUser.name} />
                            <AvatarFallback className="bg-transparent">
                                {authUser.name.split(/\s+/).map(c => c[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    align="end"
                    sideOffset={4}
                >
                    <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={authUser.avatar} alt={authUser.name} />
                                <AvatarFallback>
                                    {authUser.name.split(/\s+/).map(c => c[0]).join('').slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{authUser.name}</span>
                                <span className="truncate text-xs text-muted-foreground">{authUser.email}</span>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            className="p-0 cursor-pointer hover:bg-accent"
                            onSelect={(e) => {
                                e.preventDefault(); // prevent menu close
                                setEditDialogOpen(true);
                            }}
                        >
                            <EditProfile trigger={
                                <div className="flex items-center gap-2 w-full px-2 py-1.5">
                                    <UserPen className="size-5 mr-2" />
                                    Edit Profile
                                </div>
                            } />
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer hover:bg-accent">
                        <LogOutIcon />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* This should be outside of Dropdown */}
            <EditProfile open={editDialogOpen} onOpenChange={setEditDialogOpen} />
        </>
    );
}


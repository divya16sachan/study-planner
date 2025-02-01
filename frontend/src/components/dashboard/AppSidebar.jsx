"use client"

import React, { useEffect } from "react"
import {
    BookOpen,
    Bot,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
    Settings2,
    Folder,
    FolderPlus,
    FilePlus2,
} from "lucide-react"

import NavMain from "@/components/dashboard/NavMain"
import NavUser from "@/components/dashboard/NavUser"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import { useNoteStore } from "@/stores/useNoteStore"
import { Button } from "../ui/button"


const collections = [
    {
        "_id": "60d5ec49f8d2e30b8c8b4567",
        "name": "category1",
        "userId": "60d5ec49f8d2e30b8c8b1234",
        "isGeneral": false,
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z",
        "notes": [
            {
                "_id": "60d5ec49f8d2e30b8c8b4568",
                "name": "noteName1",
                "categoryId": "60d5ec49f8d2e30b8c8b4567",
                "userId": "60d5ec49f8d2e30b8c8b1234",
                "createdAt": "2023-01-01T00:00:00.000Z",
                "updatedAt": "2023-01-01T00:00:00.000Z"
            },
            {
                "_id": "60d5ec49f8d2e30b8c8b4569",
                "name": "noteName2",
                "categoryId": "60d5ec49f8d2e30b8c8b4567",
                "userId": "60d5ec49f8d2e30b8c8b1234",
                "createdAt": "2023-01-01T00:00:00.000Z",
                "updatedAt": "2023-01-01T00:00:00.000Z"
            }
        ]
    },
    {
        "_id": "60d5ec49f8d2e30b8c8b456a",
        "name": "category2",
        "userId": "60d5ec49f8d2e30b8c8b1234",
        "isGeneral": false,
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z",
        "notes": []
    }
]



const AppSidebar = (props) => {
    const { getHierarchy } = useNoteStore();

    useEffect(() => {
        getHierarchy();
    }, []);

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">
                                NoteHub
                            </span>
                            <span className="truncate text-xs">hello</span>
                        </div>
                    </div>
                    <div className="flex">
                        <Button className="text-sidebar-accent-foreground/70" size="icon" variant="ghost"><FilePlus2 /></Button>
                        <Button className="text-sidebar-accent-foreground/70" size="icon" variant="ghost"><FolderPlus /></Button>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <NavMain collections={collections} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

export default AppSidebar;
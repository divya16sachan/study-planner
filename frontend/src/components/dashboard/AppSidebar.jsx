"use client"

import React, { useEffect, useState, useCallback } from "react";
import {
  GalleryVerticalEnd,
  FolderPlus,
  FilePlus2,
  Map,
} from "lucide-react";

import NavMain from "@/components/dashboard/NavMain";
import NavUser from "@/components/dashboard/NavUser";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useNoteStore } from "@/stores/useNoteStore";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const AppSidebar = (props) => {
  const { getHierarchy, createCollection, collections } = useNoteStore();
  const [collectionName, setCollectionName] = useState('');

  useEffect(() => {
    getHierarchy();
  }, [getHierarchy]);

  const handleCreateCollection = useCallback(async () => {
    const trimmedName = collectionName.trim();
    if (trimmedName) {
      await createCollection({ name: trimmedName });
      setCollectionName('');
    } else {
      toast.error('Collection name cannot be empty');
    }
  }, [collectionName, createCollection]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <Link to='/' className="truncate font-semibold">NoteHub</Link>
              <span className="truncate text-xs">folder</span>
            </div>
          </div>
          <div className="flex buttons-container">
            <Popover>
              <PopoverTrigger asChild>
                <Button className="text-sidebar-accent-foreground/70" size="icon" variant="ghost">
                  <FolderPlus />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Collection</h4>
                    <p className="text-sm text-muted-foreground">Set Collection name</p>
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-4">
                      <Label htmlFor="collectionName">Name</Label>
                      <Input
                        id="collectionName"
                        className="col-span-2 h-8"
                        value={collectionName}
                        onChange={(e) => setCollectionName(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleCreateCollection}
                    variant="secondary"
                    disabled={!collectionName.trim() || collections.find(({ name }) => name === collectionName.trim())}
                  >
                    Create
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <MemoizedNavMain collections={collections} />
      </SidebarContent>
      
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

const MemoizedNavMain = React.memo(NavMain);

export default AppSidebar;

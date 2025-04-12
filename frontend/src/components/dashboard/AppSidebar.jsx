"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { FolderPlus, CopyMinus, Search, X, ArrowLeft } from "lucide-react";

import NavMain from "@/components/dashboard/NavMain";
import NavUser from "@/components/dashboard/NavUser";

import {
  Sidebar,
  SidebarCloseTrigger,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarOpenTrigger,
  SidebarRail,
  SidebarTrigger,
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
import { SidebarSearch } from "./SidebarSearch";
import TooltipWrapper from "../TooltipWrapper";
import { useLocalStorage } from "@/stores/useLocalStorage";

const AppSidebar = (props) => {
  const { getHierarchy, createCollection, collections } = useNoteStore();
  const [collectionName, setCollectionName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { collapseAll } = useLocalStorage();

  useEffect(() => {
    getHierarchy();
  }, [getHierarchy]);

  const handleCreateCollection = useCallback(async () => {
    const trimmedName = collectionName.trim();
    if (trimmedName) {
      await createCollection({ name: trimmedName });
      setCollectionName("");
    } else {
      toast.error("Collection name cannot be empty");
    }
  }, [collectionName, createCollection]);

  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  return (
    <Sidebar {...props}>
      <SidebarHeader className="pb-0">
        <div className="py-[13px] h-14">
          {showSearch ? (
            <div className="flex gap-2 items-center">
              <SidebarSearch 
                setShowSearch={setShowSearch}
                inputRef={searchRef} 
                onSearch={setSearchQuery} 
              />
              <TooltipWrapper message="Close Searchbar">
                <Button
                  variant="ghost"
                  className="size-8"
                  onClick={() => setShowSearch(false)}
                >
                  <X />
                </Button>
              </TooltipWrapper>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <TooltipWrapper message={"Close Sidebar Ctrl M"}>
                  <SidebarCloseTrigger />
                </TooltipWrapper>
                <Link to="/" className="logo truncate font">
                  NoteHub
                </Link>
              </div>

              <div className="flex buttons-container">
                <TooltipWrapper message="Collapse All">
                  <Button
                    className="size-7 text-sidebar-accent-foreground/70"
                    variant="ghost"
                    onClick={collapseAll}
                  >
                    <CopyMinus />
                  </Button>
                </TooltipWrapper>

                <Popover>
                  <PopoverTrigger asChild>
                    <TooltipWrapper message="Add Collection">
                      <Button
                        className="size-7 text-sidebar-accent-foreground/70"
                        variant="ghost"
                      >
                        <FolderPlus />
                      </Button>
                    </TooltipWrapper>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Collection</h4>
                        <p className="text-sm text-muted-foreground">
                          Set Collection name
                        </p>
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
                        disabled={
                          !collectionName.trim() ||
                          collections.find(
                            ({ name }) => name === collectionName.trim()
                          )
                        }
                      >
                        Create
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <TooltipWrapper message="Search File">
                  <Button
                    className="size-7 w-7 h-7 text-sidebar-accent-foreground/70"
                    variant="ghost"
                    onClick={() => {
                      setShowSearch(true);
                    }}
                  >
                    <Search />
                  </Button>
                </TooltipWrapper>
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <MemoizedNavMain collections={collections} searchQuery={searchQuery} />
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

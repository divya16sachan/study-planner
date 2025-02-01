"use client"

import { ChevronRight, FilePlus2, Folder, FolderOutput, FolderPlus, Forward, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "@/components/ui/sidebar"


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { useNoteStore } from "@/stores/useNoteStore"
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react"

// items: {
//     title,
//     url,
//     icon ?: LucideIcon
//     isActive ?: boolean
//     items ?: {
//         title,
//         url,
//     }
// }

const NavMain = ({ collections }) => {
    const { isMobile } = useSidebar();
    const [collectionNewName, setcollectionNewName] = useState('');
    const [noteName, setNoteName] = useState('');

    const { deleteCollection, renameCollection, createNote, deleteNote } = useNoteStore();

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Collections</SidebarGroupLabel>
            <SidebarMenu>
                {collections.map((collection, index) => (
                    <Collapsible
                        key={collection._id}
                        asChild
                        defaultOpen={index === 0}
                        className="group/collapsible"
                    >
                        <SidebarMenuItem>
                            <div>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip={collection.name}>
                                        <ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        <Folder />
                                        <span>{collection.name}</span>
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <SidebarMenuAction showOnHover>
                                            <MoreHorizontal />
                                            <span className="sr-only">More</span>
                                        </SidebarMenuAction>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-48 rounded-lg p-2"
                                        side={isMobile ? "bottom" : "right"}
                                        align={isMobile ? "end" : "start"}
                                    >
                                        < Popover >
                                            <PopoverTrigger asChild>
                                                <Button variant="ghost" className="font-normal p-2 h-auto w-full justify-start">
                                                    <Pencil className="text-muted-foreground" />
                                                    <span>Rename</span>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-70 rounded-lg"
                                                side="bottom"
                                                align="end"
                                            >
                                                <div className="grid gap-4">

                                                    <div className="grid gap-2">
                                                        <div className="flex items-center gap-4">
                                                            <Input
                                                                id="collectionName"
                                                                className="col-span-2 h-8"
                                                                defaultValue={collection.name}
                                                                placeholder="newname"
                                                                value={collectionNewName}
                                                                onChange={e => setcollectionNewName(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() =>
                                                            renameCollection({ _id: collection._id, newName: collectionNewName })
                                                        }
                                                    >
                                                        Rename
                                                    </Button>
                                                </div>
                                            </PopoverContent>
                                        </Popover >

                                        < Popover >
                                            <PopoverTrigger asChild>
                                                <Button variant="ghost" className="font-normal p-2 h-auto w-full justify-start">
                                                    <FilePlus2 className="text-muted-foreground" />
                                                    <span>Insert Note</span>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-70 rounded-lg"
                                                side="bottom"
                                                align="end">
                                                <div className="grid gap-4">
                                                    <div className="space-y-2">
                                                        <h4 className="font-medium leading-none">Insert Note</h4>
                                                        <p className="text-sm text-muted-foreground">Set Collection name</p>
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <div className="flex items-center gap-4">
                                                            <Label htmlFor="collectionName">Name</Label>
                                                            <Input
                                                                id="collectionName"
                                                                className="col-span-2 h-8"
                                                                value={noteName}
                                                                onChange={e => setNoteName(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => createNote({ name: noteName, collectionId: collection._id })}
                                                    >
                                                        <Plus /> Add
                                                    </Button>
                                                </div>
                                            </PopoverContent>
                                        </Popover >



                                        <DropdownMenuSeparator />
                                        <Button variant="ghost" className="font-normal p-2 h-auto w-full justify-start" onClick={() => deleteCollection(collection._id)}>
                                            <Trash2 />
                                            <span>Delete Collection</span>
                                        </Button>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {collection.notes?.map((note) => (
                                        <SidebarMenuSubItem key={note.name}>
                                            <SidebarMenuSubButton asChild>
                                                <div>
                                                    {note.name}
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <SidebarMenuAction showOnHover>
                                                                <MoreHorizontal />
                                                                <span className="sr-only">More</span>
                                                            </SidebarMenuAction>
                                                        </PopoverTrigger>
                                                        <PopoverContent
                                                            className="w-48 rounded-lg p-2"
                                                            side={isMobile ? "bottom" : "right"}
                                                            align={isMobile ? "end" : "start"}
                                                        >
                                                            < Popover >
                                                                <PopoverTrigger asChild>
                                                                    <Button variant="ghost" className="font-normal p-2 h-auto w-full justify-start">
                                                                        <Pencil className="text-muted-foreground" />
                                                                        <span>Rename</span>
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent
                                                                    className="w-70 rounded-lg"
                                                                    side="bottom"
                                                                    align="end"
                                                                >
                                                                    <div className="grid gap-4">

                                                                        <div className="grid gap-2">
                                                                            <div className="flex items-center gap-4">
                                                                                <Input
                                                                                    id="collectionName"
                                                                                    className="col-span-2 h-8"
                                                                                    defaultValue={collection.name}
                                                                                    placeholder="newname"
                                                                                    value={collectionNewName}
                                                                                    onChange={e => setcollectionNewName(e.target.value)}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <Button
                                                                            variant="secondary"
                                                                            onClick={() =>
                                                                                renameCollection({ _id: collection._id, newName: collectionNewName })
                                                                            }
                                                                        >
                                                                            Rename
                                                                        </Button>
                                                                    </div>
                                                                </PopoverContent>
                                                            </Popover >

                                                            < Popover >
                                                                <PopoverTrigger asChild>
                                                                    <Button variant="ghost" className="font-normal p-2 h-auto w-full justify-start">
                                                                        <FolderOutput className="text-muted-foreground" />
                                                                        <span>Move to</span>
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent
                                                                    className="w-70 rounded-lg"
                                                                    side="bottom"
                                                                    align="end">
                                                                    <div className="grid gap-4">
                                                                        <div className="space-y-2">
                                                                            <h4 className="font-medium leading-none">Insert Note</h4>
                                                                            <p className="text-sm text-muted-foreground">Set Collection name</p>
                                                                        </div>
                                                                        <div className="grid gap-2">
                                                                            <div className="flex items-center gap-4">
                                                                                <Label htmlFor="collectionName">Name</Label>
                                                                                <Input
                                                                                    id="collectionName"
                                                                                    className="col-span-2 h-8"
                                                                                    value={noteName}
                                                                                    onChange={e => setNoteName(e.target.value)}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <Button
                                                                            variant="secondary"
                                                                            onClick={() => createNote({ name: noteName, collectionId: collection._id })}
                                                                        >
                                                                            <Plus /> Add
                                                                        </Button>
                                                                    </div>
                                                                </PopoverContent>
                                                            </Popover >



                                                            <DropdownMenuSeparator />
                                                            <Button 
                                                            variant="ghost" 
                                                            className="font-normal p-2 h-auto w-full justify-start" 
                                                            onClick={() => deleteNote(note._id)}>
                                                                <Trash2 />
                                                                <span>Delete Note</span>
                                                            </Button>
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>

                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}



export default NavMain

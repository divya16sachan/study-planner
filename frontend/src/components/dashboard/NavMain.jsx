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
    DropdownMenuSeparator,
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

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

const statuses = [
    {
        value: "backlog",
        label: "Backlog",
    },
    {
        value: "todo",
        label: "Todo",
    },
    {
        value: "in progress",
        label: "In Progress",
    },
    {
        value: "done",
        label: "Done",
    },
    {
        value: "canceled",
        label: "Canceled",
    },
]

const NavMain = ({ collections }) => {
    const { isMobile } = useSidebar();
    const [collectionNewName, setCollectionNewName] = useState('');
    const [noteNewName, setNoteNewName] = useState('');
    const [noteName, setNoteName] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);


    const { deleteCollection, renameCollection, createNote, deleteNote, renameNote, moveTo} = useNoteStore();

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
                                        <SidebarMenuAction>
                                            <MoreHorizontal />
                                            <span className="sr-only">More</span>
                                        </SidebarMenuAction>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-48 rounded-lg p-1"
                                        side="bottom"
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
                                                side="top"
                                                align="start"
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
                                                                onChange={e => setCollectionNewName(e.target.value)}
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
                                            <Trash2 className="text-muted-foreground" />
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
                                                            className="w-48 rounded-lg p-1"
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
                                                                    side="right"
                                                                    align="start"
                                                                >
                                                                    <div className="grid gap-4">

                                                                        <div className="grid gap-2">
                                                                            <div className="flex items-center gap-4">
                                                                                <Input
                                                                                    className="col-span-2 h-8"
                                                                                    defaultValue={note.name}
                                                                                    placeholder="newname"
                                                                                    value={noteNewName}
                                                                                    onChange={e => setNoteNewName(e.target.value)}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <Button
                                                                            variant="secondary"
                                                                            onClick={() =>
                                                                                renameNote({ _id: note._id, newName: noteNewName })
                                                                            }
                                                                        >
                                                                            Rename
                                                                        </Button>
                                                                    </div>
                                                                </PopoverContent>
                                                            </Popover >

                                                            <Popover open={open} onOpenChange={setOpen}>
                                                                <PopoverTrigger asChild>
                                                                    <Button variant={open? "secondary" : "ghost"} className="font-normal p-2 h-auto w-full justify-start">
                                                                        <FolderOutput className="text-muted-foreground" />
                                                                        <span>Move to</span>
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="p-0" side="right" align="start">
                                                                    <Command>
                                                                        <CommandInput placeholder="Change status..." />
                                                                        <CommandList>
                                                                            <CommandEmpty>No results found.</CommandEmpty>
                                                                            <CommandGroup>
                                                                                {collections.filter(c=>c._id !== collection._id)
                                                                                .map((collection) => (
                                                                                    <CommandItem
                                                                                        key={collection._id}
                                                                                        value={collection._id}
                                                                                        onSelect={ async(value) => {
                                                                                            await moveTo({collectionId : value, noteId : note._id})
                                                                                            setOpen(false)
                                                                                        }}
                                                                                    >
                                                                                        <Folder className="text-muted-foreground"/> {collection.name}
                                                                                    </CommandItem>
                                                                                ))}
                                                                            </CommandGroup>
                                                                        </CommandList>
                                                                    </Command>
                                                                </PopoverContent>
                                                            </Popover>



                                                            <DropdownMenuSeparator />
                                                            <Button
                                                                variant="ghost"
                                                                className="font-normal p-2 h-auto w-full justify-start"
                                                                onClick={() => deleteNote(note._id)}>
                                                                <Trash2 className="text-muted-foreground" />
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

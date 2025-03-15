"use client"

import { ChevronRight, EllipsisVertical, File, FilePlus2, Folder, FolderOutput, FolderPlus, Forward, MoreHorizontal, Pencil, Pin, Plus, Trash2 } from "lucide-react"

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
import { useEffect, useRef, useState } from "react"

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Link } from "react-router-dom"
import SidebarSkeleton from "../sekeletons/SidebarSkeleton"
import NotesOption from "../NotesOption"
import CollectionsOption from "../CollectionsOption"



const NavMain = ({ collections, searchQuery }) => {
    const { isCollectionsLoading } = useNoteStore();
    const noteNameRefs = useRef({});
    const collectionNameRefs = useRef({});
    const [isNoteRenaming, setIsNoteRenaming] = useState(false);
    const [isCollectionRenaming, setIsCollectionRenaming] = useState(false);
    const [openCollectionsOption, setOpenCollectionsOption] = useState(false);
    const [pinnedCollections, setPinnedCollections] = useState([]);

    useEffect(() => {
        const pinnedCollections = JSON.parse(localStorage.getItem('pinnedCollections')) || [];
        setPinnedCollections(pinnedCollections);
    }, []);

    const filteredCollections = collections.map((collection) => ({
        ...collection,
        notes: collection.notes.filter((note) => {
            return note.name.toLowerCase().includes(searchQuery.toLowerCase())
        }),
    }))
        .filter((collection) => collection.notes.length > 0)
        .sort((a, b) => {
            const aPinnedIndex = pinnedCollections.indexOf(a._id);
            const bPinnedIndex = pinnedCollections.indexOf(b._id);
            if (aPinnedIndex === -1) return 1;
            if (bPinnedIndex === -1) return -1;
            return aPinnedIndex - bPinnedIndex;
        });


    const {
        selectedNote,
        setselectedNote,
    } = useNoteStore();

    if (isCollectionsLoading) {
        return <SidebarSkeleton />
    }





    return (
        <SidebarGroup>
            <SidebarGroupLabel>Collections</SidebarGroupLabel>
            <SidebarMenu>
                {filteredCollections.map((collection, index) => (
                    <Collapsible
                        key={collection._id}
                        asChild
                        defaultOpen={true}
                        className="group/collapsible"
                    >
                        <SidebarMenuItem>
                            {/* make the diz z index higher when the popover is open  */}
                            <div className={`relative ${openCollectionsOption === collection._id ? 'z-50' : 'z-1'}`}>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip={collection.name}>
                                        <ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        <Folder />
                                        <div>
                                            <span className={`${isCollectionRenaming !== collection._id ? 'opacity-100' : 'opacity-0 pointer-events-none'} font-semibold truncate`}>{collection.name}</span>
                                            <Input
                                                className={`${isCollectionRenaming === collection._id ? 'opacity-100' : 'opacity-0 pointer-events-none'} absolute inset-0 z-10 bg-background h-full w-full`}
                                                type="text"
                                                defaultValue={collection.name}
                                                ref={e => { collectionNameRefs.current[collection._id] = e }}
                                            />
                                        </div>

                                        {pinnedCollections.includes(collection._id) && <Pin className="ml-auto" />}
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>

                                <CollectionsOption
                                    trigger={
                                        <SidebarMenuAction>
                                            <MoreHorizontal />
                                            <span className="sr-only">More</span>
                                        </SidebarMenuAction>
                                    }
                                    onOpenChange={(e) => setOpenCollectionsOption(e ? collection._id : false)}
                                    collection={collection}
                                    setIsRenaming={setIsCollectionRenaming}
                                    inputRef={{ current: collectionNameRefs.current[collection._id] }}
                                    setPinnedCollections={setPinnedCollections}
                                    pinnedCollections={pinnedCollections}
                                />
                            </div>

                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {collection.notes?.map((note) => (
                                        <SidebarMenuSubItem key={note._id}>
                                            <SidebarMenuSubButton asChild onClick={(e) => { setselectedNote(note._id) }}>
                                                <Link to={`/note/${note._id}`} className={`group/menu cursor-pointer ${selectedNote === note._id && 'bg-accent'} pr-0`}>
                                                    <File className="opacity-50 size-4" />
                                                    <span
                                                        ref={e => { noteNameRefs.current[note._id] = e }}
                                                        contentEditable={isNoteRenaming === note._id}
                                                        suppressContentEditableWarning={true}
                                                        className={`truncate w-full text-primary/70  ${(isNoteRenaming === note._id) ? 'bg-muted-foreground/20 p-1 outline-none  text-clip' : ''}`}
                                                    >{note.name}</span>

                                                    <div className="group-hover/menu:visible invisible">
                                                        <NotesOption
                                                            trigger={<EllipsisVertical />}
                                                            note={note}
                                                            nameRef={{ current: noteNameRefs.current[note._id] }}
                                                            setIsRenaming={setIsNoteRenaming}
                                                        />
                                                    </div>
                                                </Link>
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

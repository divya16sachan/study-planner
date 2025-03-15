import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import React, { useEffect, useState } from 'react'
import { SidebarMenuAction, useSidebar } from './ui/sidebar'
import { Button } from './ui/button'
import { Bookmark, FilePlus2, MoreHorizontal, Pencil, Pin, PinOff, Plus, Trash2 } from 'lucide-react'
import { DropdownMenuSeparator, Label } from '@radix-ui/react-dropdown-menu'
import { Input } from './ui/input'
import { useNoteStore } from '@/stores/useNoteStore'
import { Separator } from './ui/separator'

const CollectionsOption = ({ trigger, collection, inputRef, setIsRenaming, onOpenChange, pinnedCollections, setPinnedCollections }) => {
    const { isMobile } = useSidebar();
    const [noteName, setNoteName] = useState('');
    const {
        deleteCollection,
        renameCollection,
        createNote,
    } = useNoteStore();

    const handleBlur = () => {
        console.log('blur');
        const data = {
            _id: collection._id,
            newName: inputRef.current.value.trim(),
        };
        if (data.newName && data.newName !== collection.name) {
            renameCollection(data);
        }
        setIsRenaming(false);
    }
    const handleFocus = () => {
        console.log('focus');
    }

    const handleKeyDown = (e) => {
        e.stopPropagation();
        if (e.key === 'Enter') {
            handleBlur();
        }
    }

    const handleRename = () => {
        setIsRenaming(collection._id);
        setOpen(false);
        
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus(); 
                inputRef.current.select();
            }
        }, 0); 
    };
    

    const handleClick = (e) => {
        e.preventDefault();
    }

    useEffect(() => {
        const current = inputRef?.current;
        if (current) {
            current.addEventListener('blur', handleBlur);
            current.addEventListener('focus', handleFocus);
            current.addEventListener('keydown', handleKeyDown);
            current.addEventListener('click', handleClick);

            return () => {
                current.removeEventListener('blur', handleBlur);
                current.removeEventListener('keydown', handleKeyDown);
                current.removeEventListener('click', handleClick);
                current.removeEventListener('focus', handleFocus);
            };
        }
    }, [inputRef, handleBlur, handleKeyDown]);

    const togglePin = () => {
        const maxPinned = 3;
        if (pinnedCollections.includes(collection._id)) {
            const newPinnedCollections = pinnedCollections.filter(id => id !== collection._id);
            setPinnedCollections(newPinnedCollections);
            localStorage.setItem('pinnedCollections', JSON.stringify(newPinnedCollections));
        }
        else {
            const newPinnedCollections = [collection._id, ...pinnedCollections.slice(0, maxPinned - 1)];
            setPinnedCollections(newPinnedCollections);
            localStorage.setItem('pinnedCollections', JSON.stringify(newPinnedCollections));
        }
        setOpen(false);
    }
    const [open, setOpen] = useState(false);

    return (
        <Popover modal={true} open={open} onOpenChange={(e) => { setOpen(!open), onOpenChange(e) }}>
            <PopoverTrigger asChild>
                {trigger}
            </PopoverTrigger>
            <PopoverContent
                className="w-48 rounded-lg p-1 bg-popover border"
                side="bottom"
                align={isMobile ? "end" : "start"}
            >
                <Button
                    variant="ghost"
                    className="font-normal p-2 h-auto w-full justify-start "
                    onClick={togglePin}
                >
                    {!pinnedCollections.includes(collection._id) ?
                        <>
                            <Pin className="text-muted-foreground" />
                            Pin Top
                        </>
                        :
                        <>
                            <PinOff className='text-muted-foreground' />
                            Unpin
                        </>
                    }
                </Button>
                < Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" className="font-normal p-2 h-auto w-full justify-start">
                            <FilePlus2 className="text-muted-foreground" />
                            <span>Insert Note</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-70 rounded-lg bg-popover p-4 border"
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

                <Button
                    variant="ghost"
                    className="font-normal p-2 h-auto w-full justify-start "
                    onClick={handleRename}
                >
                    <Pencil className="text-muted-foreground" />
                    <span>Rename</span>
                </Button>

                <Separator orientation="horizontal" className="my-2" />

                <Button variant="ghost" className="font-normal p-2 h-auto w-full justify-start" onClick={() => deleteCollection(collection._id)}>
                    <Trash2 className="text-muted-foreground" />
                    <span>Delete Collection</span>
                </Button>
            </PopoverContent>
        </Popover>
    )
}

export default CollectionsOption
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import React, { useEffect, useState } from 'react'
import { SidebarMenuAction, useSidebar } from './ui/sidebar'
import { Button } from './ui/button'
import { FilePlus2, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'
import { DropdownMenuSeparator, Label } from '@radix-ui/react-dropdown-menu'
import { Input } from './ui/input'
import { useNoteStore } from '@/stores/useNoteStore'
import { Separator } from './ui/separator'

const CollectionsOption = ({ trigger, collection, nameRef, setIsRenaming, onOpenChange }) => {
    const { isMobile } = useSidebar();
    const [noteName, setNoteName] = useState('');
    const {
        deleteCollection,
        renameCollection,
        createNote,
    } = useNoteStore();

    const handleBlur = () => {
        if (nameRef?.current) {
            const newName = nameRef.current.textContent.trim();
            if(!newName){
                nameRef.current.textContent = collection.name;
            }
            else if (newName !== collection.name) {
                renameCollection({
                    _id: collection._id,
                    newName,
                });
            }
        }
        setIsRenaming(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (nameRef?.current) {
                nameRef.current.blur();
            }
        }
    };

    const selectAllText = (node) => {
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
    };

    const handleRename = () => {
        setIsRenaming(collection._id);
        setTimeout(() => {
            if (nameRef?.current) {
                nameRef.current.focus();
                selectAllText(nameRef.current);
            }
        });
    };

    useEffect(() => {
        const current = nameRef?.current;
        if (current) {
            current.addEventListener('blur', handleBlur);
            current.addEventListener('keydown', handleKeyDown);

            return () => {
                current.removeEventListener('blur', handleBlur);
                current.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [nameRef, handleBlur, handleKeyDown]);


    return (
        <Popover modal={true} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                {trigger}
            </PopoverTrigger>
            <PopoverContent
                className="w-48 rounded-lg p-1 bg-popover border"
                side="bottom"
                align={isMobile ? "end" : "start"}
            >
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
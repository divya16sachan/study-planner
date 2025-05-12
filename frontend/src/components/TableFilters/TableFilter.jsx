import React, { useState, useEffect } from "react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { CirclePlus } from "lucide-react";

// Updated to accept "selected" and "onChange" from parent (TaskTable)
export function TableFilter({ data, filterName, selected = [], onChange }) {
    const [open, setOpen] = useState(false);
    const [selectedValues, setSelectedValues] = useState(new Set(selected));

    useEffect(() => {
        // Sync external selected values
        setSelectedValues(new Set(selected));
    }, [selected]);

    const handleSelect = (currentValue) => {
        const updated = new Set(selectedValues);
        if (updated.has(currentValue)) {
            updated.delete(currentValue);
        } else {
            updated.add(currentValue);
        }
        setSelectedValues(updated);
        onChange && onChange(currentValue); // Notify parent
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline">
                    <CirclePlus className="mr-2 size-4" />
                    <span>{filterName}</span>
                    {selectedValues.size > 0 && (
                        <>
                            <div className="w-[1px] h-4 mx-2 bg-accent" />
                            <div className="text-sm p-1 bg-accent rounded-sm w-4 text-center">
                                {selectedValues.size}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-0" side="bottom">
                <Command>
                    <CommandInput placeholder={`Search ${filterName.toLowerCase()}...`} className="h-9" />
                    <CommandList>
                        <CommandEmpty>No options found.</CommandEmpty>
                        <CommandGroup>
                            {data.map((item) => {
                                const value = typeof item === "string" ? item : item.value;
                                const label = typeof item === "string" ? item : item.label;
                                const Icon = typeof item === "object" ? item.icon : null;
                                const count = typeof item === "object" ? item.count : null;

                                return (
                                    <CommandItem
                                        key={value}
                                        value={value}
                                        onSelect={() => handleSelect(value)}
                                        className="flex items-center gap-2"
                                    >
                                        <Checkbox checked={selectedValues.has(value)} className="border-muted-foreground" />
                                        {Icon && <Icon className="size-4 text-muted-foreground" />}
                                        <span>{label}</span>
                                        {count !== null && <span className="ml-auto text-sm text-muted-foreground">{count}</span>}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

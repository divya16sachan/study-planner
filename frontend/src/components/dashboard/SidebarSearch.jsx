import React, { useState } from 'react'
import { SidebarGroup, SidebarGroupContent, SidebarInput } from '../ui/sidebar'
import { Label } from '../ui/label'
import { Search } from 'lucide-react'

export function SidebarSearch({ onSearch }) {
    const [searchQuery, setSearchQuery] = useState('');
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        onSearch(e.target.value); 
    };

    return (
        <form>
            <SidebarGroup className="py-0">
                <SidebarGroupContent className="relative">
                    <Label htmlFor="search" className="sr-only">
                        Search
                    </Label>
                    <SidebarInput
                        id="search"
                        placeholder="Search the notes..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
                </SidebarGroupContent>
            </SidebarGroup>
        </form>
    )
}

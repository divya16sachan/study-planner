import React, { useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/input'; 
import { Label } from '../ui/label';


export function SidebarSearch({ inputRef, onSearch, setShowSearch, defaultValue = '' }) {
  const [searchQuery, setSearchQuery] = React.useState(defaultValue);

  // Sync with parent's onSearch
  useEffect(() => {
    onSearch(searchQuery);
  }, [searchQuery, onSearch]);

  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  return (
    <div className="relative w-full">
      <Label htmlFor="search" className="sr-only">
        Search notes
      </Label>
      <Input
        ref={inputRef}
        id="search"
        placeholder="Search notes..."
        className="pl-8 h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onBlur={()=>setShowSearch(false)}
      />
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
    </div>
  );
}
import React, { useState } from 'react';
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';

export default ({ node: { attrs: { language: defaultLanguage } }, updateAttributes, extension }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultLanguage);
  const languages = extension.options.lowlight.listLanguages();

  return (
    <NodeViewWrapper className="code-block">
      <div className='absolute right-2 top-2'>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="min-w-32 justify-between"
              contentEditable={false}
            >
              {value
                ? languages.find((language) => language === value)
                : "Select Language..."}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search language..." className="h-9" />
              <CommandList>
                <CommandEmpty>No language found.</CommandEmpty>
                <CommandGroup>
                  {languages.map((lang, index) => (
                    <CommandItem
                      key={index}
                      value={lang}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        updateAttributes({ language: currentValue });
                        setOpen(false);
                      }}
                    >
                      {lang}
                      <Check
                        className={cn(
                          "ml-auto",
                          value === lang ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
};

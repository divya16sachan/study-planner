import * as React from "react";
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
import { usePomodoroStore } from "@/stores/pomodoroStore";

const themes = [
  { name: "Desert", src: "background/desert.jpg" },
  { name: "Gradient Dark", src: "background/gradient-dark.jpg" },
  { name: "Gradient Light", src: "background/gradient-light.jpg" },
  { name: "Monstera", src: "background/monstera.jpg" },
  { name: "Ocean", src: "background/ocean.jpg" },
  { name: "Snowy Forest", src: "background/snowy-forest.jpg" },
  { name: "Summit", src: "background/summit.jpg" },
  { name: "Tokyo", src: "background/tokyo.jpg" },
  { name: "Tundra", src: "background/tundra.jpg" },
  { name: "Winter Trek", src: "background/winter-trek.jpg" },
];

const GeneralSetting = () => {
  const [open, setOpen] = React.useState(false);
  const currentTheme = usePomodoroStore((state) => state.currentTheme);
  const setCurrentTheme = usePomodoroStore((state) => state.setCurrentTheme);

  const selectedTheme = themes.find((img) => img.src === currentTheme);

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {selectedTheme ? selectedTheme.name : "Select background..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search Theme..." className="h-9" />
            <CommandList>
              <CommandEmpty>No Theme found.</CommandEmpty>
              <CommandGroup>
                {themes.map((img) => (
                  <CommandItem
                    key={img.name}
                    value={img.name}
                    onSelect={() => {
                      setCurrentTheme(img.src);
                      setOpen(false);
                    }}
                  >
                    {img.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        currentTheme === img.src ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <p className="text-muted-foreground mt-10">
        Flocus is not related to the Pomodoro Technique™ trademark holder Cirillo Company and respects its trademarks. Pomodoro Technique® and Pomodoro® are registered trademarks of Francesco Cirillo.
      </p>
    </div>
  );
};

export default GeneralSetting;

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
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { usePomodoroStore } from "@/stores/pomodoroStore";

const sounds = [
  { name: "Bell", src: "./sounds/bell.mp3" },
  { name: "Chime", src: "./sounds/chime.mp3" },
  { name: "Birds", src: "./sounds/birds.mp3" },
  { name: "Lofi", src: "./sounds/lofi.mp3" },
];

const SoundSetting = () => {
  const {
    currentSound,
    setCurrentSound,
    currentSoundVolume,
    setCurrentSoundVolume,
    shouldPlaySound,
    setShouldPlaySound,
    playSound,
  } = usePomodoroStore();

  const [open, setOpen] = React.useState(false);

  const currentSoundName =
    sounds.find((s) => s.src === currentSound)?.name || "Select sound...";

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
            {currentSoundName}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search sound..." className="h-9" />
            <CommandList>
              <CommandEmpty>No sound found.</CommandEmpty>
              <CommandGroup>
                {sounds.map((sound) => (
                  <CommandItem
                    key={sound.name}
                    value={sound.name}
                    onSelect={() => {
                      setCurrentSound(sound.src);
                      playSound();
                      setOpen(false);
                    }}
                  >
                    {sound.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        currentSound === sound.src ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="space-y-4 mt-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="sound"
            checked={shouldPlaySound}
            onCheckedChange={setShouldPlaySound}
          />
          <Label htmlFor="sound">Play sound when timer finishes</Label>
        </div>

        <div className="space-y-2">
          <Label>Alert volume</Label>
          <Slider
            value={[currentSoundVolume]}
            onValueChange={(val) => setCurrentSoundVolume(val[0])}
            max={100}
            step={1}
            className="w-[60%]"
          />
        </div>
      </div>
    </div>
  );
};

export default SoundSetting;

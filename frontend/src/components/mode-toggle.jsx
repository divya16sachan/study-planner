import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useTheme } from "./theme-provider";
import TooltipWrapper from "./TooltipWrapper";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const toggleMode = () => {
    setTheme(theme === "light" ? "dark" : "light");
  }
  return (
    <Button
      variant="ghost"
      className="size-8"
      onClick={toggleMode}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

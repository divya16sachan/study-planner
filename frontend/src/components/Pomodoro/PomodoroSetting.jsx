import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import TimerSetting from "./TimerSetting";
import GeneralSetting from "./GeneralSetting";
import SoundSetting from "./SoundSetting";
import { usePomodoroStore } from "@/stores/pomodoroStore";

export function PomodoroSetting() {
  const [selectedTab, setSelectedTab] = useState("general");
  const { resetAll } = usePomodoroStore();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-white hover:brightness-75 transition-all rounded-full text-black size-10 shadow-md grid place-items-center">
          <Settings className="size-5" />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Settings</DialogTitle>
          <DialogDescription>
            Make changes to your timer settings here. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 text-sm">
          {/* Sidebar Section Tabs */}
          <div className="w-[200px] space-y-1">
            <Button
              variant={selectedTab === "general" ? "secondary" : "ghost"}
              className={`${selectedTab !== "general" && "hover:bg-accent/30"} p-2 h-8 w-full justify-start`}
              onClick={() => setSelectedTab("general")}
            >
              General
            </Button>
            <Button
              variant={selectedTab === "sounds" ? "secondary" : "ghost"}
              className={`${selectedTab !== "sounds" && "hover:bg-accent/30"} p-2 h-8 w-full justify-start`}
              onClick={() => setSelectedTab("sounds")}
            >
              Sounds
            </Button>
            <Button
              variant={selectedTab === "timer" ? "secondary" : "ghost"}
              className={`${selectedTab !== "timer" && "hover:bg-accent/30"} p-2 h-8 w-full justify-start`}
              onClick={() => setSelectedTab("timer")}
            >
              Timer
            </Button>
          </div>

          {/* Content Area Based on Selected Tab */}
          <div className="space-y-4 w-full">
            {selectedTab === "general" && <GeneralSetting />}
            {selectedTab === "timer" && <TimerSetting />}
            {selectedTab === "sounds" && <SoundSetting />}
          </div>
        </div>

        <DialogFooter className={"mt-8 gap-2"}>
          <Button onClick={resetAll}>Reset All</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { Label } from "@radix-ui/react-dropdown-menu";
import React from "react";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { usePomodoroStore } from "@/stores/pomodoroStore"; // adjust path if needed

const TimerSetting = () => {
  const {
    pomodoro,
    shortBreak,
    longBreak,
    soundEnabled,
    setPomodoro,
    setShortBreak,
    setLongBreak,
    setSoundEnabled,
  } = usePomodoroStore();


  return (
    <div className="space-y-2">
      <div>
        <Label htmlFor="pomodoro">Pomodoro</Label>
        <Input
          id="pomodoro"
          min={1}
          type="number"
          value={parseInt(pomodoro / 60)}
          onChange={(e) => setPomodoro(parseInt(e.target.value * 60))}
          className="mt-1 w-full"
        />
        <Label className="text-xs font-normal text-muted-foreground">
          minutes
        </Label>
      </div>

      <div>
        <Label htmlFor="shortBreak">Short Break</Label>
        <Input
          id="shortBreak"
          min={1}
          type="number"
          value={parseInt(shortBreak / 60)}
          onChange={(e) => setShortBreak(parseInt(e.target.value * 60))}
          className="mt-1 w-full"
        />
        <Label className="text-xs font-normal text-muted-foreground">
          minutes
        </Label>
      </div>

      <div>
        <Label htmlFor="longBreak">Long Break</Label>
        <Input
          id="longBreak"
          min={1}
          type="number"
          value={parseInt(longBreak / 60)}
          onChange={(e) => setLongBreak(parseInt(e.target.value * 60))}
          className="mt-1 w-full"
        />
        <Label className="text-xs font-normal text-muted-foreground">
          minutes
        </Label>
      </div>

      <div className="flex space-x-2 mt-8">
        <Switch id="sound" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
        <Label htmlFor="sound">
          <p className="font-semibold">
            Use the Pomodoro sequence: Pomodoro → short break, repeat 4x, then
            one long break{" "}
          </p>
          <p className="text-muted-foreground">
            Number of Pomodoros complete is indicated with dots under 'Pomodoro'
          </p>
        </Label>
      </div>
    </div>
  );
};

export default TimerSetting;

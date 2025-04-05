import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Check, CircleCheck } from "lucide-react";
import ColorPicker from "./ui/colorPicker";

const colors = [
  { name: "Zinc", color: "#52525b" },
  { name: "Slate", color: "#475569" },
  { name: "Stone", color: "#57534e" },
  { name: "Gray", color: "#4b5563" },
  { name: "Neutral", color: "#525252" },
  { name: "Red", color: "#dc2626" },
  { name: "Rose", color: "#e11d48" },
  { name: "Orange", color: "#ea580c" },
  { name: "Green", color: "#22c55e" },
  { name: "Blue", color: "#3b82f6" },
  { name: "Yellow", color: "#facc15" },
  { name: "Violet", color: "#6d28d9" },
];

const variables = {
  "card" : {bg: '240 10% 3.9%', fg: '0 0% 98%'},
  "popover" : {bg: '240 10% 3.9%', fg: '0 0% 98%'},
  "primary" : {bg: '0 0% 98%', fg: '240 5.9% 10%'},
  "secondary" : {bg: '240 3.7% 15.9%', fg: '0 0% 98%'},
  "muted" : {bg: '240 3.7% 15.9%', fg: '240 5% 64.9%'},
  "accent" : {bg: '240 3.7% 15.9%', fg: '0 0% 98%'},
  "destructive" : {bg: '0 62.8% 30.6%', fg: '0 0% 98%'},
  "background" : {bg: '240 10% 3.9%', fg: '0 0% 98%'},
  "foreground" : {bg: '0 0% 98%', fg: '240 10% 3.9%'},
  "border" : {bg: '240 3.7% 15.9%', fg: ''},
  "input" : {bg: '240 3.7% 15.9%', fg: ''},
  "ring" : {bg: '240 4.9% 83.9%', fg: ''},
};

// Apply dynamically to CSS
function applyDarkTheme(variables) {
  Object.entries(variables).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--${key}`, value.bg);
    if (value.fg) {
      document.documentElement.style.setProperty(`--${key}-foreground`, value.fg);
    }
  });
}

// Initialize the dark theme
applyDarkTheme(variables);


const radius = [0, 0.3, 0.5, 0.75, 1.0];

const Theme = () => {
  const [selectedColor, setSelectedColor] = useState(colors[0].name);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cutomize Theme</CardTitle>
        <p className="text-xs text-muted-foreground">
          Pick a style and color for your components.
        </p>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* some default theme settings here  */}
        <div className="space-y-1.5">
          <Label>Color</Label>
          <div className="grid grid-cols-3 gap-2 ">
            {colors.map(({ name, color }) => (
              <Button
                key={name}
                variant="outline"
                className={`justify-start ${
                  selectedColor === name ? "border-2 border-primary" : ""
                }`}
                onClick={() => setSelectedColor(name)}
              >
                <span
                  className="h-5 w-5 flex-shrink-0 flex items-center justify-center rounded-full relative"
                  style={{ background: color }}
                >
                  {selectedColor === name && <Check />}
                </span>
                {name}
              </Button>
            ))}
          </div>
        </div>

        {/* radius for box corder roundness  */}
        <div className="space-y-1.5">
          <Label>Raius</Label>
          <div className="flex gap-2">
            {radius.map((r) => (
              <Button variant="outline" key={r}>
                <span
                  className="size-6 border-t-2 border-l-2 bg-primary/20 border-primary/70 grayscale"
                  style={{ borderTopLeftRadius: `${r}rem` }}
                />
                {r}
              </Button>
            ))}
          </div>
        </div>

        {/* css variables  */}

        <div className="space-y-1.5">
          <Label>CSS Variables</Label>
          <div className="grid grid-cols-2 gap-y-4 gap-x-8">
            {Object.keys(variables).map((v) => (
              <div
                key={v}
                className="flex flex-col p-2 space-y-2 border rounded-md"
              >
                <Label>{v}</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col items-center gap-2">
                    <ColorPicker
                    defaultColor={`hsl(${variables[v].bg})`}
                     />
                    <Label>BG</Label>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                  <ColorPicker
                    defaultColor={`hsl(${variables[v].fg})`}
                     />
                    <Label>FG</Label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Theme;

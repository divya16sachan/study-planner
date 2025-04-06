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
  card: { bg: "240 10% 3.9%", fg: "0 0% 98%" },
  popover: { bg: "240 10% 3.9%", fg: "0 0% 98%" },
  primary: { bg: "0 0% 98%", fg: "240 5.9% 10%" },
  secondary: { bg: "240 3.7% 15.9%", fg: "0 0% 98%" },
  muted: { bg: "240 3.7% 15.9%", fg: "240 5% 64.9%" },
  accent: { bg: "240 3.7% 15.9%", fg: "0 0% 98%" },
  destructive: { bg: "0 62.8% 30.6%", fg: "0 0% 98%" },
  background: { bg: "240 10% 3.9%", fg: "0 0% 98%" },
  foreground: { bg: "0 0% 98%", fg: "240 10% 3.9%" },
  border: { bg: "240 3.7% 15.9%", fg: "" },
  input: { bg: "240 3.7% 15.9%", fg: "" },
  ring: { bg: "240 4.9% 83.9%", fg: "" },
};

const radius = [0, 0.3, 0.5, 0.75, 1.0];

function hslToHex(hslString) {
  // Handle empty string case (like in border.fg)
  if (!hslString || hslString.trim() === '') return '';

  // Extract the numerical values from the string
  const values = hslString.split(/\s+/).map(val => {
    if (val.includes('%')) {
      return parseFloat(val) / 100;
    }
    return parseFloat(val);
  });

  // If we didn't get exactly 3 values, return a fallback
  if (values.length !== 3 || values.some(isNaN)) {
    console.warn(`Invalid HSL value: ${hslString}`);
    return '#000000';
  }

  let [h, s, l] = values;
  
  // Normalize values
  h = ((h % 360) + 360) % 360 / 360; // Ensure hue is between 0-1
  s = Math.min(1, Math.max(0, s));
  l = Math.min(1, Math.max(0, l));

  // HSL to RGB conversion
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  // Convert RGB to HEX
  const toHex = x => {
    const hex = Math.round(Math.min(1, Math.max(0, x)) * 255)
      .toString(16)
      .padStart(2, '0');
    return hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}


const Theme = () => {
  const [selectedColor, setSelectedColor] = useState(colors[0].name);

  function setProperty(property, value){
    
  };

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
                      defaultColor={`${hslToHex(variables[v].bg)}`}
                      onColorChange={(color)=> setProperty(`--background`, color)}
                    />
                    <Label>BG</Label>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <ColorPicker
                      defaultColor={`${hslToHex(variables[v].fg)}`}
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

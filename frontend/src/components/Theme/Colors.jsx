import React, { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Check } from "lucide-react";

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
  { name: "Voilet", color: "#6d28d9" },
];

const Colors = () => {
  const [selectedColor, setSelectedColor] = useState(() => {
    return localStorage.getItem("data-theme") || "zinc";
  });

  useEffect(() => {
    localStorage.setItem("data-theme", selectedColor.toLowerCase());
    document.documentElement.setAttribute("data-theme", selectedColor.toLowerCase());
  }, [selectedColor]);
  

  return (
    <div className="space-y-1.5">
      <Label>Color</Label>
      <div className="grid grid-cols-3 gap-2">
        {colors.map(({ name, color }) => (
          <Button
            key={name}
            variant="outline"
            className={`justify-start ${
              selectedColor.toLowerCase() === name.toLowerCase() ? "border-2 border-primary" : ""
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
  );
};

export default Colors;

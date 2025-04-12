import React from "react";
import { Label } from "../ui/label";
import ColorPicker from "./colorPicker";
import { hslToHex, hexToHSL } from "./colorConversion";

const variables = {
  card: {
    bg: { defaultColor: "240 10% 3.9%", property: "--card" },
    fg: { defaultColor: "0 0% 98%", property: "--card-foreground" },
  },
  popover: {
    bg: { defaultColor: "240 10% 3.9%", property: "--popover" },
    fg: { defaultColor: "0 0% 98%", property: "--popover-foreground" },
  },
  primary: {
    bg: { defaultColor: "0 0% 98%", property: "--primary" },
    fg: { defaultColor: "240 5.9% 10%", property: "--primary-foreground" },
  },
  secondary: {
    bg: { defaultColor: "240 3.7% 15.9%", property: "--secondary" },
    fg: { defaultColor: "0 0% 98%", property: "--secondary-foreground" },
  },
  muted: {
    bg: { defaultColor: "240 3.7% 15.9%", property: "--muted" },
    fg: { defaultColor: "240 5% 64.9%", property: "--muted-foreground" },
  },
  accent: {
    bg: { defaultColor: "240 3.7% 15.9%", property: "--accent" },
    fg: { defaultColor: "0 0% 98%", property: "--accent-foreground" },
  },
  destructive: {
    bg: { defaultColor: "0 62.8% 30.6%", property: "--destructive" },
    fg: { defaultColor: "0 0% 98%", property: "--destructive-foreground" },
  },
  background: {
    bg: {
      noLabel: true,
      defaultColor: "240 10% 3.9%",
      property: "--background",
    },
  },
  foreground: {
    bg: {
      noLabel: true,
      defaultColor: "240 10% 3.9%",
      property: "--background",
    },
  },
  border: {
    bg: { noLabel: true, defaultColor: "240 3.7% 15.9%", property: "--border" },
  },
  input: {
    bg: { noLabel: true, defaultColor: "240 3.7% 15.9%", property: "--input" },
  },
  ring: {
    bg: { noLabel: true, defaultColor: "240 4.9% 83.9%", property: "--ring" },
  },
};

const CssVariables = () => {
  function setProperty(property, value) {
    console.log(property, value);
    value = value.startsWith("#") ? hexToHSL(value) : value;
    document.documentElement.style.setProperty(property, value);
  }

  return (
    <div className="space-y-1.5">
      <Label>CSS Variables</Label>
      <div className="grid grid-cols-2 gap-y-4 gap-x-8">
        {Object.keys(variables).map((v) => (
          <div
            key={v}
            className="flex flex-col p-2 space-y-2 border rounded-md"
          >
            <Label>{v}</Label>
            <div className="flex gap-2">
              {Object.keys(variables[v]).map((key) => (
                <div
                  key={key}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <ColorPicker
                    defaultColor={`${hslToHex(variables[v][key].defaultColor)}`}
                    onColorChange={(color) =>
                      setProperty(variables[v][key].property, color)
                    }
                  />
                  <Label>
                    {variables[v][key].noLabel ? "" : key.toUpperCase()}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CssVariables;

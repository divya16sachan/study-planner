import React from "react";
import { Label } from "../ui/label";
import ColorPicker from "./colorPicker";
import { hslToHex, hexToHSL } from "./colorConversion";
import { useThemeStore } from "@/stores/useThemeStore";


const CssVariables = () => {
  const {variable} = useThemeStore();

  function setProperty(property, value) {
    document.documentElement.style.setProperty(property, hexToHSL(value));
  }
  

  return (
    <div className="space-y-1.5">
      <Label>CSS Variables</Label>
      <div className="grid grid-cols-2 gap-y-4 gap-x-4 sm:gap-x-8">
        {Object.keys(variable).map((v) => (
          <div
            key={v}
            className="flex flex-col p-2 space-y-2 border rounded-md"
          >
            <Label>{v}</Label>
            <div className="flex gap-2">
              {Object.keys(variable[v]).map((key) => (
                <div
                  key={key}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <ColorPicker
                    property={variable[v][key].property}
                  />
                  <Label>
                    {variable[v][key].noLabel ? "" : key.toUpperCase()}
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
